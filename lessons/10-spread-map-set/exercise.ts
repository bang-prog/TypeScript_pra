// 第10回 演習。採点:npm run check 10
// 関数の中身(TODO の部分)を書いて、テストを通してください。

export type CartLine = { variantId: string; qty: number }

// 問1:カートの1行を受け取り、数量だけを qty に変えた「新しい行」を返す。
//      元の line は変えないこと。(オブジェクトの ... を使う)
//      例:withQty({ variantId: 'v1', qty: 2 }, 5) → { variantId: 'v1', qty: 5 }
export function withQty(line: CartLine, qty: number): CartLine {
  return {...line, qty: qty} // TODO
}

// 問2:カートの最後に1行足した「新しいカート」を返す。
//      元の lines は変えないこと。(配列の ... を使う。push は使わない)
export function addLine(lines: CartLine[], line: CartLine): CartLine[] {
  return [...lines, line] // TODO
}

// 問3:色の配列を受け取り、色ごとの個数を数えた Map を返す。(Map の get・set を使う)
//      例:['白', '黒', '白'] → Map { '白' => 2, '黒' => 1 }
//      ヒント:まだ数えていない色は get が undefined になる
export function countByColor(colors: string[]): Map<string, number> {
  const counts = new Map<string, number>()
  // TODO
  for (const color of colors) {
  counts.set(color, (counts.get(color) ?? 0)+1)
}
return counts
}

// 問4:サイズの配列から重複を消した配列を返す。順番は最初に出てきた順のまま。(Set を使う。1行で)
//      例:['S', 'M', 'S', 'L', 'M'] → ['S', 'M', 'L']
export function uniqueSizes(sizes: string[]): string[] {
  return [...new Set(sizes)] // TODO
}

// 問5:予想する問題。それぞれの式の結果を、実行せずに予想して書いてください。

// (1) { ...{ name: 'シャツ', qty: 1 }, qty: 3 } の qty
export const q5_1 = 3 // TODO

// (2) const [a, b, c] = '2026-11-17'.split('-') のときの b(文字列です)
export const q5_2 = '11' // TODO

// (3) new Map([['S', 2], ['M', 4]]).get('L') ?? 0
export const q5_3 = 0 // TODO

// (4) new Set(['白', '黒', '白', '白']).size
export const q5_4 = 2 // TODO

// 問6(レビュー目線):次の関数にはバグがあります。見つけて直してください。
//      仕様:「variantId が一致する行の数量を1増やした、新しいカートを返す。元のカートは変えない」
//      (テストでは、元のカートが変わっていないかも確かめます)
export function increment(lines: CartLine[], variantId: string): CartLine[] {
  return lines.map((l) => (l.variantId === variantId ? { ...l, qty: l.qty+1 } : l))
}
