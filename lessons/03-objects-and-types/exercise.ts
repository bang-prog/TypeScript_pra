// 第3回 演習。採点:npm run check 03
// この回は「型を書く」演習です。型が間違っていると、採点の「型チェック」でエラーになります。

// 問1:カテゴリーの型 Category を書く。
//      項目:id(文字列)、name(文字列)、sortOrder(数値)
export type Category = {
  // TODO
}

export const tops: Category = { id: 'c1', name: 'トップス', sortOrder: 1 }

// 問2:Variant(サイズ × 色の組み合わせ)の型を書く。
//      項目:id、productId、size、color(すべて文字列)、stock(数値)
//      そのあと、在庫 3 の「白 / M」の Variant を作る。productId は 'p1'、id は 'v1'
export type Variant = {
  // TODO
}

export const whiteM: Variant = {
  // TODO
}

// 問3:画面の Props の型。
//      title(文字列、必須)と note(文字列、省略できる)
export type PlaceholderProps = {
  // TODO
}

export const withoutNote: PlaceholderProps = { title: '会計履歴' } // note を省略してもエラーにならないこと

// 問4:Variant に「商品名 productName(文字列)」を足した型 VariantView を、& を使って書く
export type VariantView = {} // TODO

export const whiteMView: VariantView = { ...whiteM, productName: 'シャツ' }

// 問5:税込金額を受け取り、{ incl, tax, excl } を返す関数(消費税 10%、1円未満切り捨て)
//      省略記法 { incl, tax, excl } を使って返すこと
export type TaxBreakdown = { incl: number; tax: number; excl: number }

export function splitTax(incl: number): TaxBreakdown {
  return { incl: 0, tax: 0, excl: 0 } // TODO
}

// 問6:分割代入。引数のオブジェクトから name と priceIncl を取り出して '商品名:¥価格' を返す
//      例:{ name: 'シャツ', priceIncl: 6980 } → 'シャツ:¥6,980'
//      引数のところで { name, priceIncl } と分割代入して書くこと
export function label(product: { name: string; priceIncl: number }): string {
  return '' // TODO
}
