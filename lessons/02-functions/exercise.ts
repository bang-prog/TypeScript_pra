// 第2回 演習。採点:npm run check 02
// 関数の中身(TODO の部分)を書いて、テストを通してください。

// 問1:単価と数量を受け取り、明細の金額(単価 × 数量)を返す。
export function lineTotal(unitPrice: number, qty: number): number {
  return unitPrice * qty // TODO
}

// 問2:税込金額と税率(省略したら 10)を受け取り、消費税を返す。1円未満は切り捨て。
//      式:税込 × 税率 ÷ (100 + 税率)
//      → 引数 ratePercent にデフォルト値を付けるところから
export function taxOf(totalIncl: number, ratePercent = 10): number {
  return Math.floor(totalIncl * ratePercent /(100 + ratePercent)) // TODO
}

// 問3:数値を受け取り、3桁になるよう先頭を '0' で埋めた文字列を返す。
//      例:7 → '007'、42 → '042'、123 → '123'
//      アロー関数で書くこと。ヒント:String(n).padStart(桁数, '0')
export const pad3 = (n: number): string => {
  return String(n).padStart(3, '0')
} // TODO

// 問4:数値を受け取り、'¥12,345' の形の文字列を返す。
//      ヒント:value.toLocaleString('ja-JP') で 3 桁ごとのカンマが付く
export function formatYen(value: number): string {
  return '¥' + value.toLocaleString('ja-JP') // TODO
}

// 問5:お預かりと合計を受け取り、足りていれば true を返す(ちょうどでも true)。
// 答え（いちばん短い形）
export const isEnough = (received: number, total: number): boolean => received >= total
  // TODO

// 問6:関数を受け取る関数。
//      数値 n と、数値を受け取って数値を返す関数 fn を受け取り、fn を n に2回使った結果を返す。
//      例:applyTwice(3, (x) => x + 10) → 23
export function applyTwice(n: number, fn: (x: number) => number): number {
  return fn(fn(n))  // TODO
}
