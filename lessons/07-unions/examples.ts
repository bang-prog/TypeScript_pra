// 第7回のサンプル。実行:node lessons/07-unions/examples.ts

// ---------- ユニオン型と絞り込み ----------

function toInt(text: string): number | null {
  if (!/^-?\d+$/.test(text)) return null
  return Number(text)
}

function priceLabel(price: number | null): string {
  if (price === null) return '未入力'
  return price.toLocaleString() + '円' // ここでは price は number
}

console.log(toInt('6980'), toInt('abc'))
console.log(priceLabel(toInt('6980')), priceLabel(toInt('abc')))

// ---------- リテラル型 ----------

type DifferenceStatus = 'even' | 'over' | 'short'

function differenceOf(difference: number): DifferenceStatus {
  return difference === 0 ? 'even' : difference > 0 ? 'over' : 'short'
}
console.log(differenceOf(0), differenceOf(500), differenceOf(-1000))

// let s: DifferenceStatus = 'Even'  // ← コメントを外すと型エラー(VS Code で赤線が出る)

// ---------- 判別可能なユニオン ----------

type ChangeResult =
  | { ok: true; change: number }
  | { ok: false; shortage: number }

function calcChange(received: number, totalIncl: number): ChangeResult {
  const diff = received - totalIncl
  return diff >= 0 ? { ok: true, change: diff } : { ok: false, shortage: -diff }
}

for (const received of [10000, 6980, 5000]) {
  const result = calcChange(received, 6980)
  if (result.ok) {
    console.log(`お預かり ${received}円 → お釣り ${result.change}円`)
  } else {
    console.log(`お預かり ${received}円 → ${result.shortage}円 足りません`)
  }
}

// ---------- switch ----------

type CartLine = { variantId: string; qty: number }
type CartAction =
  | { type: 'add'; variantId: string }
  | { type: 'decrement'; variantId: string }
  | { type: 'clear' }

// tyoubo の cartReducer を、習った書き方だけで書き直したもの
function cartReducer(lines: CartLine[], action: CartAction): CartLine[] {
  switch (action.type) {
    case 'add': {
      const found = lines.find((l) => l.variantId === action.variantId)
      if (found) return lines.map((l) => (l === found ? { variantId: l.variantId, qty: l.qty + 1 } : l))
      return [...lines, { variantId: action.variantId, qty: 1 }]
    }
    case 'decrement':
      return lines
        .map((l) => (l.variantId === action.variantId ? { variantId: l.variantId, qty: l.qty - 1 } : l))
        .filter((l) => l.qty > 0) // 0点になったら消す
    case 'clear':
      return []
  }
}

let cart: CartLine[] = []
cart = cartReducer(cart, { type: 'add', variantId: 'v1' })
cart = cartReducer(cart, { type: 'add', variantId: 'v1' })
cart = cartReducer(cart, { type: 'add', variantId: 'v2' })
console.log('add ×3     :', cart)
cart = cartReducer(cart, { type: 'decrement', variantId: 'v2' })
console.log('decrement  :', cart)
cart = cartReducer(cart, { type: 'clear' })
console.log('clear      :', cart)

// ---------- 型ガード ----------

const PAYMENT_METHODS = ['cash', 'card', 'emoney', 'qr'] as const
type PaymentMethod = (typeof PAYMENT_METHODS)[number]

function isPaymentMethod(value: unknown): value is PaymentMethod {
  return typeof value === 'string' && (PAYMENT_METHODS as readonly string[]).includes(value)
}

for (const v of ['card', 'bitcoin', 123]) {
  console.log(v, '→', isPaymentMethod(v) ? '支払い方法として正しい' : '正しくない')
}
