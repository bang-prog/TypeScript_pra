// 第3回のサンプル。実行:node lessons/03-objects-and-types/examples.ts

// ---------- オブジェクトと type ----------

type Product = {
  id: string
  name: string
  /** 販売価格(税込) */
  priceIncl: number
  isActive: boolean
}

const shirt: Product = {
  id: 'p1',
  name: 'オックスフォードシャツ',
  priceIncl: 6980,
  isActive: true,
}
console.log(shirt.name, shirt.priceIncl)

// const でも中身は書き換えられる
shirt.priceIncl = 5980
console.log('値下げ後:', shirt.priceIncl)

// ---------- 構造的型付け:形が合えば OK ----------

type Line = { unitPriceIncl: number; qty: number }

function lineTotal(line: Line): number {
  return line.unitPriceIncl * line.qty
}

// SaleItem は Line より項目が多いが、unitPriceIncl と qty を持っているので渡せる
type SaleItem = { id: string; productName: string; unitPriceIncl: number; qty: number }
const item: SaleItem = { id: 's1', productName: 'シャツ', unitPriceIncl: 990, qty: 3 }
console.log('lineTotal:', lineTotal(item))

// ---------- ?: 省略できる項目 ----------

type Props = { total: number; busy?: boolean }
const p1: Props = { total: 100 }
const p2: Props = { total: 100, busy: true }
console.log('p1.busy:', p1.busy, 'p2.busy:', p2.busy) // 省略したものは undefined

// ---------- & で合成 ----------

type ProductView = Product & { categoryName: string; totalStock: number }
const view: ProductView = { ...shirt, categoryName: 'シャツ', totalStock: 12 }
// ↑ ...shirt は「shirt の項目を全部ここに並べる」(スプレッド。第10回で詳しく)
console.log(view)

// ---------- 省略記法と分割代入 ----------

function splitTax(totalIncl: number) {
  const tax = Math.floor((totalIncl * 10) / 110)
  return { incl: totalIncl, tax, excl: totalIncl - tax } // tax は tax: tax の省略
}
const breakdown = splitTax(11270)
console.log(breakdown)

const { tax, excl } = breakdown // 項目を取り出して変数にする
console.log('tax:', tax, 'excl:', excl)

// 引数で分割代入 + デフォルト値(画面のコンポーネントでよく見る形)
function describe({ total, busy = false }: Props): string {
  return busy ? `保存中…(${total}円)` : `${total}円`
}
console.log(describe({ total: 6980 }), '/', describe({ total: 6980, busy: true }))
