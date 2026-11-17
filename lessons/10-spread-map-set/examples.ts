// 第10回のサンプル。実行:node lessons/10-spread-map-set/examples.ts

// ---------- 配列の ... ----------

const sizes = ['S', 'M']
const added = [...sizes, 'L']
console.log('足す:', added, '/ 元:', sizes)
console.log('つなげる:', [...sizes, ...['L', 'XL']])

const orders = [1, 2, 3]
console.log('Math.max(0, ...orders) + 1 →', Math.max(0, ...orders) + 1)

// ---------- オブジェクトの ... ----------

const line = { variantId: 'v1', qty: 2 }
const next = { ...line, qty: 3 }
console.log('一部だけ変える:', next, '/ 元:', line)
const defaults = { qty: 3 }
console.log('後ろが勝つ:', { ...defaults, ...line }) // qty は line の 2

type Product = { id: string; name: string; categoryId: string }
const p: Product = { id: 'p1', name: 'シャツ', categoryId: 'c1' }
const view = { ...p, categoryName: 'トップス', totalStock: 5 }
console.log('項目を足す:', view)

// 書き換える場合と、新しく作る場合
const cartA = [{ variantId: 'v1', qty: 1 }]
const cartB = cartA.map((l) => ({ ...l, qty: l.qty + 1 }))
console.log('新しく作る → A:', cartA, 'B:', cartB)

const cartC = [{ variantId: 'v1', qty: 1 }]
const cartD = cartC.map((l) => {
  l.qty += 1 // 元の行を書き換えてしまう
  return l
})
console.log('書き換える → C:', cartC, 'D:', cartD, '← C まで変わった')

// ---------- 分割代入 ----------

const [y, m, d] = '2026-11-17'.split('-').map(Number)
console.log('配列の分割代入:', y, m, d)

const found = { product: { name: 'シャツ' }, variant: { size: 'M' } }
const { product, variant } = found
console.log('オブジェクトの分割代入:', product.name, variant.size)

for (const [order, color] of ['白', '黒', '紺'].entries()) {
  console.log(`  ${order}番目:${color}`)
}

// ---------- Map ----------

const stockOf = new Map<string, number>()
stockOf.set('M/白', 3)
stockOf.set('L/白', 0)
console.log('get:', stockOf.get('M/白'), stockOf.get('L/黒'), stockOf.get('L/黒') ?? 0)
console.log('has:', stockOf.has('M/白'), 'size:', stockOf.size)

type Category = { id: string; name: string }
const categories: Category[] = [
  { id: 'c1', name: 'トップス' },
  { id: 'c2', name: 'ボトムス' },
]
const categoryById = new Map(categories.map((c) => [c.id, c]))
console.log('categoryById.get(c2):', categoryById.get('c2'))

// ---------- Set ----------

const kept = new Set<string>()
kept.add('v1')
kept.add('v1')
kept.add('v2')
console.log('Set:', kept, 'has(v1):', kept.has('v1'), 'size:', kept.size)

const allSizes = ['S', 'M', 'S', 'L', 'M']
console.log('重複を消す:', [...new Set(allSizes)])

// ---------- as const と as ----------

const PAYMENT_METHODS = ['cash', 'card'] as const
type PaymentMethod = (typeof PAYMENT_METHODS)[number] // 'cash' | 'card'
const method: PaymentMethod = 'card'
console.log('as const:', PAYMENT_METHODS, method)

const raw = '{"failures": 2}'
const state = JSON.parse(raw) as { failures: number; lockedUntil: number }
console.log('as で言い張る:', state.failures, state.lockedUntil, '← lockedUntil は本当はない')
