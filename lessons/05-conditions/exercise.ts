// 第5回 演習。採点:npm run check 05
// 関数の中身(TODO の部分)を書いて、テストを通してください。

// 問1:在庫数を受け取り、次の文字列を返す。(if / else if / else を使う)
//      マイナス → 'マイナス'  0 → '在庫なし'  1 以上 → '在庫あり'
export function stockStatus(stock: number): string {
  if(stock < 0) {
    return 'マイナス'
  } else if(stock === 0){
    return '在庫なし'
  } else {
    return "在庫あり"
  } // TODO
}

// 問2:サイズが 'F' なら 'フリー'、それ以外はそのまま返す。(三項演算子 ? : を使う。1行で)
export function sizeLabel(size: string): string {
  return size === 'F' ? 'フリー' : size // TODO
}

// 問3:売れる商品なら true を返す。(&& を使う。if は使わない)
//      「売れる」= 削除されていない(isActive が true)かつ 在庫が 1 以上
export function canSell(v: { isActive: boolean; stock: number }): boolean {
  return v.isActive === true  && v.stock >= 1 ; false // TODO
}

// 問4:id が一致するカテゴリーの名前を返す。見つからなければ ''(空文字)。
//      (find と ?. と ?? を使う。1行で)
export type Category = { id: string; name: string }

export function categoryNameOf(categories: Category[], id: string): string {
  return categories.find((p) => p.id === id)?.name ??'' // TODO
}

// 問5:予想する問題。それぞれの式の結果を、実行せずに予想して書いてください。
//      例:式が 1 + 1 なら 2、式が 'a' + 'b' なら 'ab' と書く
//      (式そのものを書いて計算させるのはなしです)

// (1) 0 || 100
export const q5_1 = 100 // TODO

// (2) 0 ?? 100
export const q5_2 = 0 // TODO

// (3) '' || '未設定'
export const q5_3 = '未設定' // TODO

// (4) [] ? 'ある' : 'ない'
export const q5_4 = 'ある' // TODO

// 問6(レビュー目線):次の関数にはバグがあります。見つけて直してください。
//      仕様:「準備金(レジに最初に入れておくお金)が設定されていなければ 30000 円とする」
//      お店によっては、準備金 0 円で始めることもあります。
export function openingFloatOf(settings: { openingFloat?: number }): number {
  return settings.openingFloat ?? 30000
}
