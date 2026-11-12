# 第7回 クイズ

## 問1 型エラーになるのはどれ?

```ts
type LedgerMode = 'day' | 'month' | 'date'

const a: LedgerMode = 'day'
const b: LedgerMode = 'week'
const c: LedgerMode = 'Month'
```

<details><summary>答え</summary>

`b` と `c`。

`'week'` は3つのどれでもない。`'Month'` は大文字なので `'month'` とは別の文字列。リテラル型は**1文字でも違えばエラー**にしてくれる。

</details>

## 問2 型エラーになるのはどこ?

```ts
function label(price: number | null): string {
  const text = price.toLocaleString()   // ①
  if (price === null) return '未入力'
  return price.toLocaleString() + '円'  // ②
}
```

<details><summary>答え</summary>

①。

①の時点では、まだ `null` かどうかを調べていないので、`price` は `number | null`。`null` には `toLocaleString` がないのでエラー。②は `if` で `null` を追い出したあとなので `number` として使える。**絞り込みは、調べた「あと」の行にだけ効く。**

</details>

## 問3 表示されるものは?

```ts
type ChangeResult =
  | { ok: true; change: number }
  | { ok: false; shortage: number }

const r: ChangeResult = { ok: false, shortage: 300 }
console.log(r.ok ? `お釣り ${r.change}円` : `${r.shortage}円 足りません`)
```

<details><summary>答え</summary>

`300円 足りません`。

三項演算子でも絞り込みは効く。`? ` の右(真のとき)では `r.change`、`:` の右(偽のとき)では `r.shortage` が使える。

</details>

## 問4 `count` は最後にいくつ?

```ts
type Action = { type: 'inc' } | { type: 'reset' }

function reducer(count: number, action: Action): number {
  switch (action.type) {
    case 'inc':
      return count + 1
    case 'reset':
      return 0
  }
}

let count = 0
count = reducer(count, { type: 'inc' })
count = reducer(count, { type: 'inc' })
count = reducer(count, { type: 'reset' })
count = reducer(count, { type: 'inc' })
```

<details><summary>答え</summary>

`1`。

`0 → 1 → 2 → 0(reset)→ 1`。tyoubo の `cartReducer` や `cashInputReducer` も、「今の状態と、何が起きたか(action)から、次の状態を返す」という同じ形をしている。この形を **reducer** と呼ぶ(第16回でもう一度出てくる)。

</details>

## 問5 tyoubo の `components/PayDialog.tsx`(会計の画面)にある1行です。何をしていますか?

```ts
if (!busy && entered && result.ok) onConfirm({ received, change: result.change })
```

(`busy` は「保存中」、`entered` は「お預かりを入力済み」、`result` は `calcChange` の結果です)

<details><summary>答え</summary>

「保存中ではなく、お預かりが入力済みで、お預かりが足りている」ときだけ、会計を確定する(`onConfirm` を呼ぶ)。

`&&` の中で `result.ok` を調べているので、その右側では `result.change` が使える。足りないときは確定させない。

</details>

## 問6(レビュー目線)支払い方法に「商品券」を追加する変更です。気になる点は?

```ts
// payment.ts
export type PaymentMethod = 'cash' | 'card' | 'emoney' | 'qr' | 'giftcard'

export function isPaymentMethod(value: unknown): value is PaymentMethod {
  return value === 'cash' || value === 'card' || value === 'emoney' || value === 'qr'
}
```

<details><summary>答え</summary>

**型には `'giftcard'` を足したのに、型ガード `isPaymentMethod` のチェックに `'giftcard'` を足し忘れている。** 商品券で払った会計は「支払い方法が正しくありません」とエラーになる。

TypeScript は型ガードの中身が正しいかを確かめないので、エラーは出ない。**型と、型ガードの中身がそろっているか**は、人間が見るしかない。

(tyoubo では、`PAYMENT_METHODS` という1つの配列から型もチェックも作っているので、この食い違いが起きない作りになっている。)

</details>
