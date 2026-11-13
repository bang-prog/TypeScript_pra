// 第8回 演習。採点:npm run check 08
// このフォルダの money.ts・types.ts・labels.ts を開いて、何が export されているか確かめてから解いてください。
// import の行は、このファイルの一番上(このコメントのすぐ下)に書いてください。
// (この学習フォルダでは、パスの最後に .ts を付けて './money.ts' のように書きます)



// 問1:money.ts の formatYen を import して、金額を '¥6,980' の形で返す。
//      (名前付き import を使う。¥ は formatYen が付けてくれるので、自分で打たなくてよい)
import { formatYen } from './money.ts'
export function totalLabel(total: number): string {
  return formatYen(total) // TODO
}

// 問2:この定数を、他のファイルから import できるようにする。(行の先頭に1語足すだけ)
export const TAX_RATE = 10

// 問3:types.ts の Product 型を import type で持ってきて、引数 p の型を Product に書き換える。
//      中身は「商品名 半角スペース 価格」を返す。例:'シャツ ¥6,980'(問1の formatYen を使う)
import type { Product } from './types.ts'
export function productLabel(p : Product ): string {
  return `${p.name} ${formatYen(p.priceIncl)}` // TODO
}

// 問4:labels.ts の sizeLabel を import して、'白 / フリー' のような文字列を返す。
//      (labels.ts は export default です。import の書き方に注意)
import sizeLabel from './labels.ts'
export function variantText(color: string, size: string): string {
  return `${color} / ${sizeLabel(size)}` // TODO
}

// 問5:予想する問題。tyoubo の次のファイルの import は、どのファイルを指していますか?
//      'src/lib/money.ts' のように、src/ から始まるパスで、拡張子 .ts まで書いてください。
//      (どれも指している先は .ts のファイルです)

// (1) src/components/PayDialog.tsx の中の  from '../lib/cashInput'
export const q5_1 = 'src/lib/cashInput.ts' // TODO

// (2) src/db/sales.ts の中の  from './settings'
export const q5_2 = 'src/db/settings.ts' // TODO

// (3) src/components/products/ProductForm.tsx の中の  from '../../db/catalog'
export const q5_3 = 'src/db/catalog.ts' // TODO

// 問6(レビュー目線):このフォルダの money.ts・labels.ts・types.ts について、
//      次の import のうち、エラーになるものを全部選んで、記号を配列で書いてください。
//
//      A: import { formatYen } from './money.ts'
//      B: import { roundDown } from './money.ts'
//      C: import { sizeLabel } from './labels.ts'
//      D: import type { Product } from './types.ts'
export const q6: string[] = ['B','C'] // TODO
