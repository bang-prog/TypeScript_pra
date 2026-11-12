# 第7回 ユニオン型と型の絞り込み

**この回のゴール:** `lib/cart.ts` の `CartAction` と `cartReducer`(カートの中身を変える関数)、`lib/money.ts` の `ChangeResult`(お釣りの計算結果)を読んで、どんな種類があって、それぞれ何が起きるかがわかる。

```ts
export type CartAction =
  | { type: 'add'; variantId: string }
  | { type: 'decrement'; variantId: string }
  | { type: 'clear' }

export function cartReducer(lines: CartLine[], action: CartAction): CartLine[] {
  switch (action.type) {
    case 'add':
      // カートに1点足す
    case 'decrement':
      // カートから1点減らす
    case 'clear':
      return []
  }
}
```

この形は、tyoubo の画面のコード(第15〜16回)で何度も出てきます。**TypeScript らしさが一番出る回**です。

---

## 1. ユニオン型 `A | B`:「A または B」

もう何度か見ています。

```ts
const found: Product | undefined = products.find(...)   // 第4回
```

`|` は「**どちらか**」です。Python の `Product | None`(`Optional[Product]`)と同じです。

```ts
// ProductForm.tsx の toInt:整数に読めれば数値、読めなければ null
function toInt(text: string): number | null {
  if (!/^-?\d+$/.test(text)) return null
  return Number(text)
}
```

`null` と `undefined` は、どちらも「値がない」です(第1回)。tyoubo では「あえて空にしている」ときに `null` を使うことが多いです。

## 2. リテラル型:決まった値だけを許す型

```ts
// lib/closing.ts
export type DifferenceStatus = 'even' | 'over' | 'short'
```

`'even'` は「文字列なら何でも」ではなく、「**`'even'` という文字列だけ**」を表す型です。それを `|` でつなぐと、「この3つのどれか」という型になります。

```ts
let status: DifferenceStatus
status = 'even'    // ✅
status = 'Even'    // ❌ 型エラー(大文字は別の文字列)
status = 'ok'      // ❌ 型エラー(3つのどれでもない)
```

Python なら `Literal['even', 'over', 'short']` です。**打ち間違いを実行前に見つけてくれる**のが便利なところです。

tyoubo の支払い方法も、この形です。

```ts
// lib/payment.ts
export const PAYMENT_METHODS = ['cash', 'card', 'emoney', 'qr'] as const
export type PaymentMethod = (typeof PAYMENT_METHODS)[number]
```

2行目は難しく見えますが、「**配列 `PAYMENT_METHODS` の中身のどれか**」という意味です。結果は `'cash' | 'card' | 'emoney' | 'qr'` と同じ型になります(書き方の仕組みは第12回でやります)。

## 3. 型の絞り込み:`if` で調べると型が狭まる

```ts
function priceLabel(price: number | null): string {
  if (price === null) return '未入力'
  // ここから下では、price は number だとわかっている
  return price.toLocaleString() + '円'
}
```

`if (price === null) return ...` を通り過ぎたあとは、`price` は `null` ではありません。TypeScript はそれを理解して、**ここから下では `price` を `number` として扱います**。これを**絞り込み**と言います。

もし `if` を書かずに `price.toLocaleString()` と書くと、「`price` は `null` かもしれません」という型エラーになります。

`typeof` でも絞り込めます(Python の `isinstance` に当たります)。

```ts
// lib/payment.ts の isPaymentMethod
typeof value === 'string'   // value が文字列か
```

> **読むときのコツ:** `if (x === null) return` や `if (!x) return` のように、**先にダメな場合を `return` で追い出す**書き方は、tyoubo のあちこちにあります。その下では「`x` はちゃんとある」と思って読めます。

## 4. 判別可能なユニオン:印の項目で種類を見分ける

```ts
// lib/money.ts
export type ChangeResult =
  | { ok: true; change: number }      // 足りた:お釣りがある
  | { ok: false; shortage: number }   // 足りない:不足額がある
```

お釣りの計算結果は、2種類のどちらかです。

- 足りたら、`ok` が `true` で、`change`(お釣り)がある
- 足りなければ、`ok` が `false` で、`shortage`(不足額)がある

`ok` が「どちらの種類か」を表す**印**です。この形を**判別可能なユニオン**と言います。

```ts
const result = calcChange(received, total)

result.change          // ❌ 型エラー(足りなかった場合は change がない)

if (result.ok) {
  result.change        // ✅ ok が true なので、change がある
} else {
  result.shortage      // ✅ ok が false なので、shortage がある
}
```

`result.ok` を調べるまでは、TypeScript は `change` を使わせてくれません。**「足りなかった場合」を考え忘れる**ことを、型が防いでいます。

```ts
// sales.ts の createSale
if (!result.ok) throw new ValidationError('お預かりが足りません')
```

## 5. `switch`:種類ごとに分ける

印が3つ以上あるときは、`if` を並べる代わりに `switch` を使います。

```ts
switch (action.type) {
  case 'add':
    // action.type が 'add' のとき
  case 'decrement':
    // action.type が 'decrement' のとき
  case 'clear':
    return []
}
```

Python 3.10 の `match` / `case` に似ています。

`CartAction` の印は `type` という項目です。`case 'add':` の中では、TypeScript は「`action` は `{ type: 'add'; variantId: string }` だ」とわかります。なので `action.variantId` が使えます。`case 'clear':` の中では `variantId` は使えません(`clear` には `variantId` がないため)。

**`switch` の注意点:** `case` の最後で `return`(か `break`)しないと、**次の `case` に流れ込みます**。tyoubo の `cartReducer` では、どの `case` も `return` しているので大丈夫です。

`case 'press': { ... }` のように `{ }` が付いていることもあります。これは、その `case` の中だけで使う変数(`const next = ...`)を作るためです(`lib/cashInput.ts` の `cashInputReducer`)。

> **レビューで効くポイント:** `CartAction` に新しい種類(たとえば `{ type: 'remove' }`)を足したのに、`switch` に `case 'remove':` を書き忘れると、どうなるでしょう。`cartReducer` は戻り値の型が `CartLine[]` なので、「何も返さない場合がある」と TypeScript がエラーにしてくれます。**種類を足した差分では、それを使っている `switch` が全部直っているか**を確認します。

## 6. 型ガード `x is T`:自分で絞り込みの関数を作る

```ts
// lib/payment.ts
export function isPaymentMethod(value: unknown): value is PaymentMethod {
  return typeof value === 'string' && (PAYMENT_METHODS as readonly string[]).includes(value)
}
```

戻り値の型が `boolean` ではなく **`value is PaymentMethod`** になっています。これは「この関数が `true` を返したら、`value` は `PaymentMethod` だと思ってよい」という意味です。

```ts
// sales.ts の createSale
if (!isPaymentMethod(paymentMethod)) throw new ValidationError('支払い方法が正しくありません')
// ここから下では、paymentMethod は PaymentMethod
```

`unknown` は「何が入っているか全くわからない」型です。バックアップファイルの読み込みなど、外から来たデータに使います(`db/backup.ts`)。

> **レビューで効くポイント:** TypeScript は、型ガードの**中身が正しいかどうかは確かめません**。`value is PaymentMethod` と書いてあれば、中身が間違っていても信じます。型ガードの差分を見たら、**中身の条件が型と合っているか**(たとえば支払い方法を1つ足したのに、チェックに入っていない、など)を自分の目で確かめます。

---

## やってみる

```bash
node lessons/07-unions/examples.ts
```

→ [quiz.md](quiz.md) → [exercise.ts](exercise.ts)(採点:`npm run check 07`)

## tyoubo を読む

[../../../tyoubo/src/lib/cart.ts](../../../tyoubo/src/lib/cart.ts) の `CartAction` と `cartReducer` を開いて答えてください。`...l` や `flatMap` など、まだ習っていないものも出てきます。**どの `case` で何をしているか**だけ読めれば大丈夫です(コメントもヒントになります)。

1. `CartAction` には何種類ありますか?それぞれ、どんな情報を持っていますか?
2. `cartReducer(lines, { type: 'clear' })` は何を返しますか?
3. `case 'add':` で、`lines.some((l) => l.variantId === action.variantId)` は何を調べていますか?(第4回の `some` です)

[../../../tyoubo/src/lib/cashInput.ts](../../../tyoubo/src/lib/cashInput.ts)(電卓の「お預かり」入力)を開いてください。

4. `CashAction` には何種類ありますか?「＋1,000」ボタンを押したときは、どの種類が使われると思いますか?
5. `case 'backspace':` の `input.slice(0, -1)` は何をしていますか?(`-1` は「後ろから1つ目」です)

<details>
<summary>答え</summary>

1. 3種類。`'add'`(足す)と `'decrement'`(1つ減らす)は、どのバリエーションかを表す `variantId` を持つ。`'clear'`(空にする)は `type` だけ。
2. `[]`(空の配列)。カートを空にする。
3. カートに、同じバリエーション(同じ商品・サイズ・色)がもう入っているか。入っていれば数量を1増やし、入っていなければ新しく1点で追加する(三項演算子 `? :` で分けている)。
4. 5種類(`press`・`backspace`・`clear`・`add`・`set`)。「＋1,000」は `{ type: 'add'; amount: 1000 }`(コメントに「今の金額に足す」とある)。
5. 最後の1文字を消している(電卓の「⌫」キー)。`'1234'` なら `'123'`。

</details>
