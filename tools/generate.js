#!/usr/bin/env node
// Regenerates library/*.lua from the upstream framework sources.
// The frameworks already ship LuaLS annotations, so we harvest rather than hand-write.
//   node tools/generate.js
'use strict'

const { execFileSync } = require('node:child_process')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')

const ROOT = path.join(__dirname, '..')
const OUT = path.join(ROOT, 'library')

const FRAMEWORKS = [
  { id: 'qbcore', repo: 'qbcore-fivem/qb-core', branch: 'main', title: 'QBCore' },
  { id: 'qbx', repo: 'Qbox-project/qbx_core', branch: 'main', title: 'Qbox (qbx_core)' },
  { id: 'esx', repo: 'esx-framework/esx_core', branch: 'main', title: 'ESX' },
]

// Directories that hold config/translations/vendored code, never public API.
const SKIP_DIR = /[\\/](locale|locales|cfg|config|node_modules|\.github|web|html|ui|nui|stream)[\\/]/i

const DEF_DOTTED = /^function\s+([A-Za-z_][\w.]*)([.:])([A-Za-z_]\w*)\s*\(([^)]*)\)/
const DEF_ASSIGN = /^([A-Za-z_][\w.]*)\.([A-Za-z_]\w*)\s*=\s*function\s*\(([^)]*)\)/
const DEF_GLOBAL = /^function\s+([A-Za-z_]\w*)\s*\(([^)]*)\)/
const EXPORT_CALL = /^exports\(\s*["']([\w.]+)["']\s*,\s*([A-Za-z_]\w*)\s*\)/
const CLASS_START = /^---@(class|alias|enum)\s/
const SIDE_TAG = /^---\s*@?(server|client)\s*$/i

// Lua's own globals: extend them, never redeclare them.
const LUA_STDLIB = new Set(['string', 'math', 'table', 'os', 'io', 'package', 'coroutine', 'debug', 'utf8', '_G', 'arg'])

function download (fw, dir) {
  const src = path.join(dir, fw.id)
  const url = 'https://codeload.github.com/' + fw.repo + '/tar.gz/refs/heads/' + fw.branch
  fs.mkdirSync(src, { recursive: true })
  // Relative paths + cwd: GNU tar reads `C:\...` as a remote host spec and fails.
  const run = (cmd, args) => execFileSync(cmd, args, { cwd: dir, stdio: 'inherit' })
  run('curl', ['-sfL', '--retry', '2', '-m', '120', '-o', fw.id + '.tar.gz', url])
  run('tar', ['xzf', fw.id + '.tar.gz', '-C', fw.id, '--strip-components=1'])
  return src
}

function luaFiles (dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) {
      if (!SKIP_DIR.test(p + path.sep)) luaFiles(p, acc)
    } else if (e.name.endsWith('.lua')) acc.push(p)
  }
  return acc
}

function sideOf (p) {
  if (/[\\/]server[\\/]/i.test(p)) return 'server'
  if (/[\\/]client[\\/]/i.test(p)) return 'client'
  return 'shared'
}

// Contiguous `---` block directly above line i.
function docAbove (lines, i) {
  const doc = []
  for (let j = i - 1; j >= 0 && lines[j].trim().startsWith('---'); j--) doc.unshift(lines[j].trim())
  return doc.filter(l => !SIDE_TAG.test(l))
}

function cleanArgs (a) {
  return a.split(',').map(s => s.replace(/--.*/, '').trim()).filter(Boolean).join(', ')
}

function harvest (srcDir) {
  const classes = []       // verbatim ---@class / ---@alias / ---@enum blocks
  const funcs = new Map()  // fullName -> definition
  const globals = new Map()
  const exported = []
  const seenClass = new Set()

  for (const file of luaFiles(srcDir)) {
    const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/)
    const side = sideOf(file)

    // `function Player:AddMoney()` on a `local Player = {}` is not a global API.
    // Emitting it as one leaks the framework's private tables -- and names like
    // `self`, `math` and `string` would shadow Lua's own standard library.
    const locals = new Set()
    for (const l of lines) {
      const t = l.trim()
      const m = t.match(/^local\s+(?!function\b)([A-Za-z_][\w,\s]*)/)
      if (m) for (const n of m[1].split(',')) locals.add(n.trim())
      // ...unless the file hands it back to the global environment. Qbox does
      // exactly this (`local qbx = {}` ... `_ENV.qbx = qbx`), so `qbx` is public
      // while QBCore's `local Player = {}`, never re-exposed, is not.
      // Deliberately not `return x`: `return self` at the end of a constructor
      // is idiomatic Lua and says nothing about the module's public surface.
      const e = t.match(/^(?:_ENV|_G)\.([A-Za-z_]\w*)\s*=/)
      if (e) locals.delete(e[1])
    }
    locals.delete('')

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()

      // Standalone class/alias/enum blocks (ones not attached to a function).
      if (CLASS_START.test(line)) {
        const block = []
        let j = i
        while (j < lines.length && lines[j].trim().startsWith('---')) { block.push(lines[j].trim()); j++ }
        const next = (lines[j] || '').trim()
        const attached = /^(local\s+)?function\s/.test(next) || /=\s*function\s*\(/.test(next)
        if (!attached && !seenClass.has(block[0])) { seenClass.add(block[0]); classes.push(block) }
        i = j - 1
        continue
      }

      if (line.startsWith('local function')) continue

      let m, prefix, sep, name, args
      if ((m = line.match(DEF_DOTTED))) {
        prefix = m[1]; sep = m[2]; name = m[3]; args = m[4]
      } else if ((m = line.match(DEF_ASSIGN))) {
        prefix = m[1]; sep = '.'; name = m[2]; args = m[3]
      } else if ((m = line.match(DEF_GLOBAL))) {
        // Keyed by side: qbx defines the same name on client and server with different signatures.
        const key = side + ':' + m[1]
        if (!globals.has(key)) globals.set(key, { doc: docAbove(lines, i), args: cleanArgs(m[2]), side })
        continue
      } else if ((m = line.match(EXPORT_CALL))) {
        exported.push({ exportName: m[1], fn: m[2], side })
        continue
      } else continue

      if (name.startsWith('_') || prefix.startsWith('_')) continue
      const full = prefix + sep + name
      const doc = docAbove(lines, i)
      const prev = funcs.get(full)
      if (prev && prev.doc.length >= doc.length) continue
      const localScope = locals.has(prefix.split(/[.:]/)[0])
      funcs.set(full, { prefix, sep, name, args: cleanArgs(args), doc, side, localScope })
    }
  }
  return { classes, funcs, globals, exports: exported }
}

// Every intermediate table a dotted name needs, so LuaLS can resolve it.
function tableDecls (names) {
  const decl = new Set()
  for (const full of names) {
    const parts = full.split(/[.:]/)
    for (let i = 1; i < parts.length; i++) decl.add(parts.slice(0, i).join('.'))
  }
  return [...decl].sort((a, b) => a.split('.').length - b.split('.').length || a.localeCompare(b))
}

function renderFn (d) {
  return ['---[' + d.side + ']', ...d.doc, 'function ' + d.prefix + d.sep + d.name + '(' + d.args + ') end', ''].join('\n')
}

function render (fw, h, extra) {
  // Locally-scoped tables stay out of the output; the ones that matter are
  // re-exposed under a proper class (see qbPlayerAlias) or via an @class block.
  const names = [...h.funcs.keys()].filter(n => !h.funcs.get(n).localScope)
  const banner = [
    '---@meta',
    '-- ' + fw.title + ' definitions, generated from https://github.com/' + fw.repo + ' (' + fw.branch + ').',
    '-- Generated by tools/generate.js -- do not edit by hand.',
    '',
  ]
  const classBlocks = h.classes.map(b => b.join('\n') + '\n')
  const tables = tableDecls(names)
  for (const r of new Set(names.map(n => n.split(/[.:]/)[0]))) {
    if (!tables.includes(r)) tables.unshift(r)
  }
  const decls = []
  for (const t of tables) {
    // Frameworks add helpers to `string`, `math` and friends. Declaring those
    // tables here would REPLACE Lua's own, hiding string.format and the rest --
    // emitting only the added functions lets the language server merge them in.
    if (LUA_STDLIB.has(t)) continue
    // Plain assignment, not `t or {}`: the union with `table` would make the type
    // open and silence undefined-field on typo'd calls.
    if (!t.includes('.') && !h.classes.some(b => b[0].startsWith('---@class ' + t))) decls.push('---@class ' + t)
    decls.push(t + ' = {}', '')
  }
  return [...banner, ...classBlocks, ...decls, ...names.sort().map(n => renderFn(h.funcs.get(n))), extra || ''].join('\n')
}

// Qbox is consumed as `exports.qbx_core:Fn()`, so its globals become a typed export class.
function renderQbxExports (h) {
  const out = [
    '---@meta',
    '-- Qbox exports (`exports.qbx_core:Fn()`), generated by tools/generate.js.',
    '',
    '---@class QbxCoreExports',
    'local qbx_core = {}',
    '',
  ]
  // One entry per export name; a name registered on both sides is labelled client/server.
  const byName = new Map()
  for (const e of h.exports) {
    const g = h.globals.get(e.side + ':' + e.fn) || [...h.globals].find(([k]) => k.endsWith(':' + e.fn))?.[1]
    if (!g) continue
    const prev = byName.get(e.exportName)
    if (!prev) { byName.set(e.exportName, { ...g, side: e.side }); continue }
    if (prev.side !== e.side) prev.side = 'client/server'
    if (g.doc.length > prev.doc.length) { prev.doc = g.doc; prev.args = g.args }
  }
  for (const [name, g] of byName) {
    out.push('---[' + g.side + ']', ...g.doc, 'function qbx_core:' + name + '(' + g.args + ') end', '')
  }
  out.push('---@class CfxExports', '---@field qbx_core QbxCoreExports', 'exports = exports or {}', '')
  return out.join('\n')
}

// Upstream QBCore annotates its player getters as `@return table`, which dead-ends
// completion on `Player.Functions.*`. Point them at the class instead.
const QB_GETTERS = /^(GetPlayer|GetPlayerByCitizenId|GetPlayerByLicense|GetPlayerByPhone|GetPlayerByAccount|GetPlayerByCharInfo|GetOfflinePlayer|GetOfflinePlayerByLicense|CreatePlayer|Login)$/

function typeQbPlayers (h) {
  for (const d of h.funcs.values()) {
    if (!QB_GETTERS.test(d.name)) continue
    d.doc = d.doc.map(l => l.replace(/^---@return\s+table(\??)/, '---@return QBCorePlayer$1'))
  }
}

// QBCore instance methods are reached as `Player.Functions.AddMoney(...)`, not `Player:AddMoney(...)`.
function qbPlayerAlias (h) {
  const out = ['---@class QBCorePlayer', '---@field PlayerData table', '---@field Offline boolean', 'QBCorePlayer = {}', '', 'QBCorePlayer.Functions = {}', '']
  let n = 0
  for (const d of h.funcs.values()) {
    if (d.prefix !== 'Player' || d.sep !== ':') continue
    out.push('---[server]', ...d.doc, 'function QBCorePlayer.Functions.' + d.name + '(' + d.args + ') end', '')
    n++
  }
  return n ? out.join('\n') : ''
}

function main () {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'fwdefs-'))
  fs.mkdirSync(OUT, { recursive: true })
  for (const fw of FRAMEWORKS) {
    process.stdout.write('\n== ' + fw.title + ' (' + fw.repo + '@' + fw.branch + ')\n')
    const h = harvest(download(fw, tmp))
    if (fw.id === 'qbcore') typeQbPlayers(h)
    const extra = fw.id === 'qbcore' ? qbPlayerAlias(h) : ''
    fs.writeFileSync(path.join(OUT, fw.id + '.lua'), render(fw, h, extra), 'utf8')
    if (fw.id === 'qbx') fs.writeFileSync(path.join(OUT, 'qbx_exports.lua'), renderQbxExports(h), 'utf8')
    console.log('   ' + h.funcs.size + ' functions, ' + h.classes.length + ' classes, ' + h.exports.length + ' exports')
  }
  fs.rmSync(tmp, { recursive: true, force: true })
}

main()
