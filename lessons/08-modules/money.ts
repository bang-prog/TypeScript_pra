// 第8回の部品:お金の計算(tyoubo の lib/money.ts を小さくしたもの)

/** お預かりの上限 */
export const MAX_RECEIVED = 9_999_999

/** 画面に表示する形にする。12345 → "¥12,345" */
export function formatYen(value: number): string {
  return '¥' + value.toLocaleString('ja-JP')
}

/** export が付いていないので、このファイルの中でしか使えない */
function roundDown(value: number): number {
  return Math.floor(value)
}

/** 税込金額に含まれる消費税(10%) */
export function taxOf(totalIncl: number): number {
  return roundDown((totalIncl * 10) / 110)
}
