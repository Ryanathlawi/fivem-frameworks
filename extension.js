// Points the Lua language server at this extension's framework definitions.
// All completion, hover, signature help and formatting come from sumneko.lua --
// this extension only supplies the data and wires up the path.
'use strict'

const path = require('node:path')
const vscode = require('vscode')

// A framework is "present" when its own resource is in the workspace.
const DETECT = {
  qbcore: '**/qb-core/fxmanifest.lua',
  qbx: '**/qbx_core/fxmanifest.lua',
  esx: '**/es_extended/fxmanifest.lua',
  vrp: '**/vrp/fxmanifest.lua',
}

const FILES = {
  qbcore: ['qbcore.lua'],
  qbx: ['qbx.lua', 'qbx_exports.lua'],
  esx: ['esx.lua'],
  vrp: ['vrp.lua'],
}

const ALL = Object.keys(DETECT)

async function detect () {
  const found = []
  for (const id of ALL) {
    const hit = await vscode.workspace.findFiles(DETECT[id], '**/node_modules/**', 1)
    if (hit.length) found.push(id)
  }
  // Nothing recognisable: load everything rather than silently doing nothing.
  return found.length ? found : ALL
}

async function resolve () {
  const picked = vscode.workspace.getConfiguration('fivemFrameworks').get('frameworks') || ['auto']
  if (picked.includes('auto')) return detect()
  const ids = picked.filter(id => ALL.includes(id))
  return ids.length ? ids : ALL
}

const same = (a, b) => a.length === b.length && a.every((v, i) => v === b[i])

async function apply (ctx, announce) {
  const ids = await resolve()
  const mine = ids.flatMap(id => FILES[id].map(f => path.join(ctx.extensionPath, 'library', f)))

  const lua = vscode.workspace.getConfiguration('Lua')
  const target = vscode.workspace.workspaceFolders?.length
    ? vscode.ConfigurationTarget.Workspace
    : vscode.ConfigurationTarget.Global

  // Drop entries from older installs of this extension (the path carries the version).
  const others = (lua.get('workspace.library') || []).filter(p => !String(p).includes(ctx.extension.id))
  const next = [...others, ...mine]

  if (!same(lua.get('workspace.library') || [], next)) {
    await lua.update('workspace.library', next, target)
  }
  if (lua.get('runtime.version') !== 'LuaJIT') {
    await lua.update('runtime.version', 'LuaJIT', target)
  }

  if (announce) {
    vscode.window.showInformationMessage(`FiveM: loaded definitions for ${ids.join(', ')}.`)
  }
}

function activate (ctx) {
  ctx.subscriptions.push(
    vscode.commands.registerCommand('fivemFrameworks.reload', () => apply(ctx, true)),
    vscode.workspace.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration('fivemFrameworks.frameworks')) apply(ctx, false)
    }),
  )
  apply(ctx, false)
}

module.exports = { activate, deactivate () {} }
