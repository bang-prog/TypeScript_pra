// 第4回 演習。採点:npm run check 04
// 関数の中身(TODO の部分)を書いて、テストを通してください。
// 問1〜5は、for を使わず、問題文で指定した配列メソッドで書くこと。

export type Product = {
  id: string
  name: string
  priceIncl: number
  stock: number
  isActive: boolean
}

// 問1:商品の配列を受け取り、商品名だけの配列を返す。(map を使う)
//      例:[シャツ, デニム] → ['シャツ', 'デニム']
export function names(products: Product[]): string[] {
  return products.map((p) => p.name) // TODO
}

// 問2:削除していない(isActive が true の)商品だけを返す。(filter を使う)
export function activeOnly(products: Product[]): Product[] {
  return products.filter((p) => p.isActive) // TODO
}

// 問3:在庫数(stock)の合計を返す。(reduce を使う)
//      空の配列なら 0。
export function totalStock(products: Product[]): number {
  return products.reduce((sum, p) => sum + p.stock, 0) // TODO
}

// 問4:在庫がマイナスの商品が1つでもあれば true を返す。(some を使う)
export function hasNegative(products: Product[]): boolean {
  return products.some((p) => p.stock < 0) // TODO
}

// 問5:id が一致する商品を返す。見つからなければ undefined。(find を使う)
//      戻り値の型も自分で書くこと(「Product または undefined」)
export function findById(products: Product[], id: string): Product | undefined {
  return products.find((p) => p.id === id) // TODO
}

// 問6:価格の安い順に並べた「新しい配列」を返す。
//      受け取った配列そのものの順番は変えないこと(テストで確かめます)。
//      ヒント:[...products] でコピーを作ってから sort する
export function sortByPrice(products: Product[]): Product[] {
  return [...products].sort((a, b) => a.priceIncl - b.priceIncl) // TODO
}
