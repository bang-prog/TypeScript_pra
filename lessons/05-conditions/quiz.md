# 第5回 クイズ

## 問1 表示されるものは?

```ts
const stock = 0
console.log(stock > 0 ? '在庫あり' : '在庫なし')
console.log(stock === 0 && '入荷待ち')
```

<details><summary>答え</summary>

```
在庫なし
入荷待ち
```

1行目は三項演算子。`0 > 0` は `false` なので右側。2行目の `&&` は、左が真なら**右側の値そのもの**を返す(Python の `and` と同じ)。

</details>

## 問2 表示されるものは?

```ts
const discount = 0
console.log(discount || 500)
console.log(discount ?? 500)
```

<details><summary>答え</summary>

`500` と `0`。

`||` は `0` を falsy として置き換えてしまう。`??` は `null` と `undefined` のときだけ置き換える。**「値引き 0 円」を指定したのに 500 円引かれる**、というバグの元。

</details>

## 問3 Python との違い。表示されるものは?

```ts
const lines: string[] = []
if (lines) console.log('A')
if (lines.length === 0) console.log('B')
```

<details><summary>答え</summary>

`A` と `B` の両方。

JavaScript では**空の配列も truthy**(Python とは違う)。空かどうかは `length === 0` で調べる。tyoubo の `createSale` も `if (input.lines.length === 0)` と書いている。

</details>

## 問4 `name` に入るものは?

```ts
type Category = { id: string; name: string }
const categories: Category[] = [{ id: 'c1', name: 'トップス' }]

const name = categories.find((c) => c.id === 'c9')?.name ?? '未分類'
```

<details><summary>答え</summary>

`'未分類'`。

`find` は見つからないので `undefined` → `?.name` もエラーにならず `undefined` → `??` で `'未分類'`。

</details>

## 問5 tyoubo の `lib/money.ts` の `calcChange`(お釣りの計算)の最後の行です。`received` が 5000、`totalIncl` が 6980 のとき、何が返りますか?

```ts
const diff = received - totalIncl
return diff >= 0 ? { ok: true, change: diff } : { ok: false, shortage: -diff }
```

<details><summary>答え</summary>

`{ ok: false, shortage: 1980 }`。

`diff` は `5000 - 6980 = -1980`。0 以上ではないので右側。`-diff` で符号を反転して、不足額を**プラスの数**にしている。ちょうど(`diff === 0`)のときは `>=` なので左側(お釣り 0 円)になる。

</details>

## 問6(レビュー目線)「在庫数が入力されていなければ 1 として登録する」という変更です。気になる点は?

```ts
/** 在庫数が未入力なら 1 にする */
function initialStock(input: { stock?: number }): number {
  return input.stock || 1
}
```

<details><summary>答え</summary>

**在庫数に `0` を入力したのに、`1` になってしまう。** `0` は falsy なので、`||` は「未入力」と区別できない。仕様が「未入力のときだけ 1」なら `input.stock ?? 1` にするべき。

型は合っているので、TypeScript は何も言わない。**数値に `||` で初期値を付けていたら、0 のときを考える**のがレビューのポイント。

</details>
