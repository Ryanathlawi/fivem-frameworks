#!/usr/bin/env node
// Draws icon.png (the Marketplace tile) with zlib alone -- no image dependency.
//   node tools/icon.js
'use strict'

const fs = require('node:fs')
const path = require('node:path')
const zlib = require('node:zlib')

const S = Number(process.argv[2]) || 256
const px = Buffer.alloc(S * S * 4)

// Squared distance to a rounded rectangle, so edges can be antialiased by coverage.
function roundRect (x, y, x0, y0, x1, y1, r) {
  const dx = Math.max(x0 + r - x, 0, x - (x1 - r))
  const dy = Math.max(y0 + r - y, 0, y - (y1 - r))
  return r - Math.hypot(dx, dy)
}

function blend (i, [r, g, b], a) {
  if (a <= 0) return
  a = Math.min(a, 1)
  for (let c = 0; c < 3; c++) px[i + c] = Math.round(px[i + c] * (1 - a) + [r, g, b][c] * a)
  px[i + 3] = Math.round(px[i + 3] * (1 - a) + 255 * a)
}

const BARS = [
  { y0: 84, y1: 108, x1: 192, color: [251, 191, 36], alpha: 1 },
  { y0: 122, y1: 146, x1: 168, color: [255, 255, 255], alpha: 1 },
  { y0: 160, y1: 184, x1: 148, color: [255, 255, 255], alpha: 0.7 },
]

for (let y = 0; y < S; y++) {
  for (let x = 0; x < S; x++) {
    const i = (y * S + x) * 4

    // Tile: rounded square, purple to blue down the diagonal.
    const t = (x + y) / (2 * S)
    const bg = [
      Math.round(109 + (37 - 109) * t),
      Math.round(40 + (99 - 40) * t),
      Math.round(217 + (235 - 217) * t),
    ]
    blend(i, bg, roundRect(x + 0.5, y + 0.5, 8, 8, S - 8, S - 8, 56))

    // Three bars: lines of code.
    for (const b of BARS) {
      blend(i, b.color, roundRect(x + 0.5, y + 0.5, 64, b.y0, b.x1, b.y1, 12) * b.alpha)
    }
  }
}

const raw = Buffer.alloc(S * (S * 4 + 1))
for (let y = 0; y < S; y++) {
  raw[y * (S * 4 + 1)] = 0 // filter: none
  px.copy(raw, y * (S * 4 + 1) + 1, y * S * 4, (y + 1) * S * 4)
}

const chunk = (type, data) => {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'latin1'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(zlib.crc32(body))
  return Buffer.concat([len, body, crc])
}

const ihdr = Buffer.alloc(13)
ihdr.writeUInt32BE(S, 0)
ihdr.writeUInt32BE(S, 4)
ihdr[8] = 8 // bit depth
ihdr[9] = 6 // colour type: RGBA

const out = process.argv[3] || path.join(__dirname, '..', 'icon.png')
fs.writeFileSync(out, Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0)),
]))

console.log('wrote ' + out + ' (' + fs.statSync(out).size + ' bytes)')
