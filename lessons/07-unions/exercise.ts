// 第7回 演習。採点:npm run check 07
// 関数の中身(TODO の部分)を書いて、テストを通してください。

// 問1:サイズの型 Size を書く。'S'・'M'・'L' の3つだけを許す型にすること。(リテラル型と | を使う)
export type Size = 'S' | 'M' | 'L' // TODO

// 問2:価格が null なら '未入力'、そうでなければ '6980円' のような文字列を返す。
//      (if で null を先に追い出してから、テンプレート文字列で返す)
export function priceText(price: number | null): string {
  if (price === null) return '未入力'
  return `${price}` + '円' // TODO
}

// 問3:お釣りの計算結果から、画面に出すメッセージを返す。
//      足りた(ok が true)   → 'お釣り 3020円'
//      足りない(ok が false)→ '1980円 足りません'
export type ChangeResult =
  | { ok: true; change: number }
  | { ok: false; shortage: number }

export function changeMessage(result: ChangeResult): string {
  return result.ok ? `お釣り ${result.change}円` : `${result.shortage}円 足りません` // TODO
}

// 問4:点数カウンターの reducer。switch を使って、action の種類ごとに次の点数を返す。
//      'add'      → 1 増やす
//      'decrement'→ 1 減らす。ただし 0 より小さくはしない(0 のときは 0 のまま)
//      'clear'    → 0 にする
export type CountAction = { type: 'add' } | { type: 'decrement' } | { type: 'clear' }

export function countReducer(count: number, action: CountAction): number {
  switch (action.type) {
    case 'add':
      return count + 1
    case 'decrement':
      if(count === 0) {
        return 0
      }
      return count - 1
    case 'clear':
      return 0
  }
  return count // TODO
}

// 問5:予想する問題。次のうち、型エラーになるものを全部選んで、記号を配列で書いてください。
//      例:A と C なら ['A', 'C']
//
//      type DifferenceStatus = 'even' | 'over' | 'short'
//      A: const a: DifferenceStatus = 'even'
//      B: const b: DifferenceStatus = 'Even'
//      C: const c: DifferenceStatus = 'short'
//      D: const d: DifferenceStatus = 'ok'
export const q5: string[] = ['B', 'D'] // TODO

// 問6(レビュー目線):次の型ガードにはバグがあります。見つけて直してください。
//      仕様:「value が Size('S'・'M'・'L' のどれか)なら true」
export function isSize(value: string): value is Size {
  return value === 'S' || value === 'M' || value === 'L'
}
