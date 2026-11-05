// 第1回のサンプル。実行:node lessons/01-variables-and-types/examples.ts
// 1行ずつ「何が表示されるか」を予想してから実行してみてください。

// ---------- const と let ----------

const taxRate = 10
let count = 0
count = count + 1
count += 1 // count = count + 1 と同じ
console.log('count:', count)

// ---------- 基本の型 ----------

const price = 980 // number
const half = price / 2 // number(整数でも小数でも number)
const third = price / 3
console.log('half:', half, 'third:', third)

// 整数にしたいときは Math.floor(切り捨て)など。Python の // にあたる
console.log('floor:', Math.floor(price / 3))

const productName = 'オックスフォードシャツ' // string
const isActive = true // boolean(小文字)
console.log(productName, isActive)

// 数値の _ は区切り。値は変わらない
const MAX_RECEIVED = 9_999_999
console.log('MAX_RECEIVED:', MAX_RECEIVED)

// ---------- null と undefined ----------

let lastBackupAt: string | null = null // 「文字列か null」。最初は null
console.log('lastBackupAt:', lastBackupAt)
lastBackupAt = '2026-11-04T10:00:00+09:00'
console.log('lastBackupAt:', lastBackupAt)

let notYet // 値を入れていない変数は undefined
console.log('notYet:', notYet)

// ---------- typeof で実行時の型を調べる ----------

console.log(typeof price, typeof productName, typeof isActive, typeof null, typeof undefined)
// ↑ typeof null が 'object' になるのは JavaScript の有名な仕様ミス。気にしなくてよい

// ---------- 型は実行時には消えている ----------

const rate: number = taxRate
console.log('rate:', rate) // 型注釈を書いても書かなくても、動きは同じ
