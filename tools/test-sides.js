#!/usr/bin/env node
// Checks the wrong-side detector without VS Code: which side a file runs on,
// and which calls count as calls.
//   node tools/test-sides.js
'use strict'

const assert = require('node:assert')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')

// Stand in for the editor so the whole path can run outside VS Code.
const Module = require('node:module')
const load = Module._load
Module._load = function (req, ...rest) {
  if (req !== 'vscode') return load.call(this, req, ...rest)
  return {
    Range: class { constructor (a, b) { this.start = a; this.end = b } },
    Diagnostic: class { constructor (range, message, severity) { Object.assign(this, { range, message, severity }) } },
    DiagnosticSeverity: { Warning: 1 },
  }
}

const { sideOfFile, blankNonCode, buildMatcher, scan } = require('../sides.js')

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sides-'))
const write = (rel, body) => {
  const full = path.join(root, rel)
  fs.mkdirSync(path.dirname(full), { recursive: true })
  fs.writeFileSync(full, body)
  return full
}

// --- the manifest is the authority ------------------------------------------
write('fxmanifest.lua', `
fx_version 'cerulean'
game 'gta5'

client_scripts { 'client/*.lua', 'cl_extra.lua' }
server_script 'logic/backend.lua'
shared_scripts { 'shared/**/*.lua' }
`)

const cl = write('client/main.lua', '')
const clExtra = write('cl_extra.lua', '')
const sv = write('logic/backend.lua', '')
const sh = write('shared/deep/util.lua', '')

assert.strictEqual(sideOfFile(cl), 'client', 'client/*.lua glob')
assert.strictEqual(sideOfFile(clExtra), 'client', 'literal client entry')
assert.strictEqual(sideOfFile(sv), 'server', 'a server path the name alone would not reveal')
assert.strictEqual(sideOfFile(sh), null, 'shared files run on both, so nothing is misplaced')

// --- naming conventions, when the manifest lists nothing ---------------------
const bare = fs.mkdtempSync(path.join(os.tmpdir(), 'sides-bare-'))
fs.mkdirSync(path.join(bare, 'server'), { recursive: true })
const guessed = path.join(bare, 'server', 'main.lua')
fs.writeFileSync(guessed, '')
assert.strictEqual(sideOfFile(guessed), 'server', 'fallback to the folder name')

// --- comments and strings are not code --------------------------------------
const blanked = blankNonCode(`
-- ESX.GetPlayerFromId(1)
local s = "ESX.GetPlayerFromId(1)"
ESX.GetPlayerFromId(1)
`)
assert.strictEqual((blanked.match(/ESX\.GetPlayerFromId/g) || []).length, 1,
  'only the real call survives')

// --- matching is anchored ---------------------------------------------------
const m = buildMatcher({ 'ESX.GetPlayerFromId': 'server', 'lib.notify': 'client' })
const found = [...'ESX.GetPlayerFromId(1) MyESX.GetPlayerFromId(1) lib.notify({})'.matchAll(m)]
  .map(x => x[1])
assert.deepStrictEqual(found, ['ESX.GetPlayerFromId', 'lib.notify'],
  'MyESX.GetPlayerFromId is a different table')

// --- the generated map is present and sane ----------------------------------
const sides = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'library', 'sides.json'), 'utf8'))
const n = Object.keys(sides).length
assert.ok(n >= 300, `sides.json has ${n} entries, expected at least 300`)
assert.ok(Object.values(sides).every(v => v === 'client' || v === 'server'),
  'every entry is client or server -- shared ones must be dropped')

// --- the whole path: a server call written in a client file -----------------
const MAP = { 'ESX.GetPlayerFromId': 'server', 'lib.notify': 'client' }
const matcher = buildMatcher(MAP)
const doc = (file, text) => ({ uri: { fsPath: file }, getText: () => text, positionAt: i => i })

const flagged = scan(doc(cl, 'ESX.GetPlayerFromId(1)\nlib.notify({})\n'), MAP, matcher)
assert.strictEqual(flagged.length, 1, 'exactly the server call is flagged in a client file')
assert.match(flagged[0].message, /runs on the server.*runs on the client/s)

assert.strictEqual(scan(doc(sv, 'ESX.GetPlayerFromId(1)'), MAP, matcher).length, 0,
  'the same call is correct in a server file')
assert.strictEqual(scan(doc(sh, 'ESX.GetPlayerFromId(1)'), MAP, matcher).length, 0,
  'shared files are never wrong')
assert.strictEqual(scan(doc(cl, '-- ESX.GetPlayerFromId(1)'), MAP, matcher).length, 0,
  'a commented-out call is not a call')

fs.rmSync(root, { recursive: true, force: true })
fs.rmSync(bare, { recursive: true, force: true })
console.log('ok -- side detection sound, ' + n + ' side-specific calls')
