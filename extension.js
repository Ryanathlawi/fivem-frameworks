// Points the Lua language server at this extension's framework definitions.
// All completion, hover, signature help and formatting come from sumneko.lua --
// this extension only supplies the data and wires up the path.
'use strict'

const path = require('node:path')
const vscode = require('vscode')

// A framework or resource is "present" when its own folder is in the workspace.
const DETECT = {
  qbcore: '**/qb-core/fxmanifest.lua',
  qbx: '**/qbx_core/fxmanifest.lua',
  esx: '**/es_extended/fxmanifest.lua',
  ox_lib: '**/ox_lib/fxmanifest.lua',
  ox_inventory: '**/ox_inventory/fxmanifest.lua',
  qb_target: '**/qb-target/fxmanifest.lua',
  qb_menu: '**/qb-menu/fxmanifest.lua',
  qb_inventory: '**/qb-inventory/fxmanifest.lua',
}

const FILES = {
  qbcore: ['qbcore.lua'],
  qbx: ['qbx.lua', 'qbx_exports.lua'],
  esx: ['esx.lua'],
  ox_lib: ['ox_lib.lua'],
  ox_inventory: ['ox_inventory.lua', 'ox_inventory_exports.lua'],
  qb_target: ['qb_target_exports.lua'],
  qb_menu: ['qb_menu_exports.lua'],
  qb_inventory: ['qb_inventory_exports.lua'],
}

const ALL = Object.keys(DETECT)

// Manifest directives, loaded whatever the framework: without them every
// fxmanifest.lua in the workspace lights up with undefined-global warnings.
const ALWAYS = ['cfx_manifest.lua']

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
  const files = [...ALWAYS, ...ids.flatMap(id => FILES[id])]
  const mine = files.map(f => path.join(ctx.extensionPath, 'library', f))

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
