// 第5回のサンプル。実行:node lessons/05-conditions/examples.ts

// ---------- if / else if / else ----------

function stockStatus(stock: number): string {
  if (stock < 0) {
    return 'マイナス'
  } else if (stock === 0) {
    return '在庫なし'
  } else {
    return '在庫あり'
  }
}
console.log(stockStatus(-1), stockStatus(0), stockStatus(3))

// ---------- === と == ----------

console.log('0 === 0:', 0 === 0)
console.log("'1' === 1:", '1' === (1 as unknown)) // 型が違うので false
console.log("0 == '':", (0 as unknown) == '') // == は無理やり合わせるので true(使わない)

// ---------- && || ! ----------

const qty = 1.5
if (!Number.isSafeInteger(qty) || qty < 1) console.log('数量が正しくありません:', qty)

const isActive = true
const stock = 0
console.log('売れる?', isActive && stock > 0)

// ---------- truthy と falsy ----------

const values: [string, unknown][] = [
  ['false', false], ['0', 0], ["''", ''], ['null', null], ['undefined', undefined], ['NaN', NaN],
  ["'a'", 'a'], ['1', 1], ['[]', []], ['{}', {}],
]
for (const [label, v] of values) {
  console.log(label, '→', v ? 'truthy' : 'falsy')
}

// ---------- 三項演算子 ----------

const sizeLabel = (size: string) => (size === 'F' ? 'フリー' : size)
console.log(sizeLabel('F'), sizeLabel('M'))

function status(difference: number) {
  return difference === 0 ? 'even' : difference > 0 ? 'over' : 'short'
}
console.log(status(0), status(500), status(-1000))

// ---------- ?? と || ----------

// (値をそのまま書くと TypeScript が「意味がない」と怒るので、変数に入れて試す)
const zero: number | undefined = Number('0')
const empty: string | undefined = String('')
const none: number | undefined = [1].find((n) => n > 5) // 見つからないので undefined

console.log('0 ?? 100 →', zero ?? 100)
console.log('0 || 100 →', zero || 100)
console.log("'' ?? '未設定' →", JSON.stringify(empty ?? '未設定'))
console.log("'' || '未設定' →", empty || '未設定')
console.log('undefined ?? 100 →', none ?? 100)

type Sale = { id: string; paymentMethod?: string }
const oldSale: Sale = { id: 's1' } // 古いデータ(支払い方法がない)
const newSale: Sale = { id: 's2', paymentMethod: 'card' }
console.log(oldSale.paymentMethod ?? 'cash', newSale.paymentMethod ?? 'cash')

// ---------- ?. ----------

type Category = { id: string; name: string }
const categories: Category[] = [{ id: 'c1', name: 'トップス' }]

const found = categories.find((c) => c.id === 'c1')
const missing = categories.find((c) => c.id === 'zzz')
console.log(found?.name, missing?.name, missing?.name ?? '(なし)')

// ---------- ! と ?. ----------

type Product = { id: string; isActive: boolean }
const check = (p: Product | undefined) => (!p?.isActive ? 'エラー' : 'OK')
console.log('見つからない:', check(undefined))
console.log('削除済み:', check({ id: 'p1', isActive: false }))
console.log('ある:', check({ id: 'p2', isActive: true }))
