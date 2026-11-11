// 第6回 演習。採点:npm run check 06
// 関数の中身(TODO の部分)を書いて、テストを通してください。

// 問1:色とサイズから、'白 / M' のような文字列を返す。(テンプレート文字列 `${}` を使う)
//      / の前後には半角スペースを1つずつ入れる
export function variantLabel(color: string, size: string): string {
  return `${color} / ${size}` // TODO
}

// 問2:会計の連番(数値)を、3桁の文字列にする。(padStart を使う)
//      例:7 → '007'  42 → '042'  123 → '123'
export function seqText(n: number): string {
  return String(n).padStart(3, '0') // TODO
}

// 問3:'S, M,, L ' のような入力を、['S', 'M', 'L'] にする。(split・map・filter を使う)
//      区切りは半角カンマ , だけでよい。前後の空白を取り、空のものは捨てる
export function splitSizes(text: string): string[] {
  return text.split(/[,]/).map((s) =>
  s.trim()).filter(Boolean) // TODO
}

// 問4:'2026-11-06T14:05:09+09:00' のような日時から、日付の '2026-11-06' を取り出す。(slice を使う)
export function dateOf(iso: string): string {
  return iso.slice(0, 10) // TODO
}

// 問5:予想する問題。それぞれの式の結果を、実行せずに予想して書いてください。
//      文字列なら '...' で囲んで書く(例:'abc')

// (1) String(5).padStart(2, '0')
export const q5_1 = '05' // TODO

// (2) '20261108-012'.split('-')[1]
export const q5_2 = '012' // TODO

// (3) 'S-M-L'.replace('-', '')
export const q5_3 = 'SM-L' // TODO

// (4) `${1 + 2}点`
export const q5_4 = '3点' // TODO

// 問6(レビュー目線):次の関数にはバグがあります。見つけて直してください。
//      仕様:「営業日 '2026-11-08' から、会計番号の頭の '20261108' を作る」
export function datePrefix(businessDate: string): string {
  return businessDate.replaceAll('-', '')
}
