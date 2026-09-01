#!/usr/bin/env node
// Guards the generator: if an upstream framework restructures and the regexes stop
// matching, the counts crater and this fails instead of shipping empty definitions.
//   node tools/check.js
'use strict'

const assert = require('node:assert')
const fs = require('node:fs')
const path = require('node:path')

const ROOT = path.join(__dirname, '..')
const LIB = path.join(ROOT, 'library')

// Floors, not exact counts -- upstream adds functions all the time.
const MIN = { 'qbcore.lua': 100, 'qbx.lua': 100, 'qbx_exports.lua': 50, 'esx.lua': 300 }

for (const [file, min] of Object.entries(MIN)) {
  const full = path.join(LIB, file)
  assert.ok(fs.existsSync(full), `${file} is missing -- run: node tools/generate.js`)

  const lines = fs.readFileSync(full, 'utf8').split('\n')
  assert.strictEqual(lines[0], '---@meta', `${file} must start with ---@meta`)

  const defs = lines.filter(l => l.startsWith('function '))
  assert.ok(defs.length >= min, `${file} has ${defs.length} functions, expected at least ${min}`)

  const bad = defs.filter(l => !/^function [\w.:]+\([^)]*\) end$/.test(l))
  assert.deepStrictEqual(bad, [], `${file} has malformed definitions`)

  const names = defs.map(l => l.slice(9, l.indexOf('(')))
  assert.strictEqual(new Set(names).size, names.length, `${file} has duplicate definitions`)
}

// Every library file the extension maps to a framework must actually exist.
const listed = fs.readFileSync(path.join(ROOT, 'extension.js'), 'utf8')
  .matchAll(/'([\w]+\.lua)'/g)
for (const [, f] of listed) {
  assert.ok(fs.existsSync(path.join(LIB, f)), `extension.js references missing library/${f}`)
}

console.log('ok -- ' + Object.keys(MIN).length + ' definition files valid')
