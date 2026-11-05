// 第2回のサンプル。実行:node lessons/02-functions/examples.ts

// ---------- function の基本 ----------

function lineTotal(unitPrice: number, qty: number): number {
  return unitPrice * qty
}
console.log('lineTotal:', lineTotal(6980, 3))

// ---------- 戻り値なし(void)と throw ----------

function assertYen(value: number, label = '金額'): void {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new RangeError(`${label}は0以上の整数(円)で指定してください: ${value}`)
  }
}

assertYen(100) // 問題なければ何も起きない
try {
  assertYen(-5, '単価')
} catch (e) {
  // エラーを受け止めて表示する(第9回で詳しく)
  console.log('エラー:', (e as Error).message)
}

// ---------- デフォルト引数 ----------

const DEFAULT_TAX_RATE = 10

function taxOf(totalIncl: number, ratePercent = DEFAULT_TAX_RATE): number {
  return Math.floor((totalIncl * ratePercent) / (100 + ratePercent))
}
console.log('taxOf(11270):', taxOf(11270))
console.log('taxOf(1080, 8):', taxOf(1080, 8))

// ---------- アロー関数 ----------

const pad2 = (n: number) => String(n).padStart(2, '0')
console.log('pad2:', pad2(5), pad2(12))

// { } を使うと複数行書ける。このときは return が必要
const describe = (name: string, price: number) => {
  const yen = '¥' + price.toLocaleString('ja-JP')
  return `${name}:${yen}`
}
console.log(describe('シャツ', 6980))

// オブジェクトを返すときは ( ) で囲む
const makeLine = (variantId: string) => ({ variantId, qty: 1 })
console.log(makeLine('v1'))

// ---------- 関数を値として渡す ----------

function runTwice(fn: () => void): void {
  fn()
  fn()
}
runTwice(() => console.log('呼ばれた'))

// 関数の型を引数に持つ例(画面のコードの onSaved などと同じ形)
function save(name: string, onSaved: (id: string) => void): void {
  const id = 'id-' + name
  onSaved(id) // 保存が終わったら、渡された関数を呼ぶ
}
save('シャツ', (id) => console.log('保存しました:', id))
