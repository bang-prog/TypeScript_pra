// 第8回のサンプル。実行:node lessons/08-modules/examples.ts
// 同じフォルダの money.ts・types.ts・labels.ts から import しています。

// ---------- 名前付き import ----------

import { formatYen, MAX_RECEIVED, taxOf } from './money.ts'

console.log(formatYen(6980))
console.log('お預かりの上限:', formatYen(MAX_RECEIVED))
console.log('6980円に含まれる消費税:', taxOf(6980))

// import { roundDown } from './money.ts'
// ↑ コメントを外すとエラー。roundDown には export が付いていないので、money.ts の外からは使えない

// ---------- import type ----------

import type { Product } from './types.ts'

const shirt: Product = { id: 'p1', name: 'シャツ', priceIncl: 6980 }
console.log(`${shirt.name} ${formatYen(shirt.priceIncl)}`)

// ---------- default import ----------

import sizeLabel from './labels.ts' // { } がない = default
console.log(sizeLabel('F'), sizeLabel('M'))

import labelOfSize from './labels.ts' // default は好きな名前で受け取れる(同じ関数)
console.log(labelOfSize('F'))

// ---------- ライブラリの import ----------

import { basename } from 'node:path' // . で始まらない = 自分で書いたファイルではない
console.log(basename('src/lib/money.ts'))
