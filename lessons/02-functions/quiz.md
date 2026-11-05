# 第2回 クイズ

## 問1 表示されるものは?

```ts
function double(n: number): number {
  return n * 2
}
console.log(double(double(3)))
```

<details><summary>答え</summary>

`12`。内側から:`double(3)` が `6`、`double(6)` が `12`。

</details>

## 問2 次の3つは同じ意味ですか?

```ts
const a = (n: number) => n + 1
const b = (n: number) => { return n + 1 }
const c = (n: number) => { n + 1 }
```

<details><summary>答え</summary>

**`a` と `b` は同じ。`c` は違う。**

`c` は `{ }` で囲んだのに `return` がないので、何も返さない(戻り値は `undefined`)。Claude Code が書いたコードでも起こりうる間違いで、TypeScript は戻り値の型を `number` と書いておけば「返していない」とエラーにしてくれる。**戻り値の型を書く理由の1つ。**

</details>

## 問3 この関数のシグネチャを日本語で説明してください

```ts
export function calcChange(received: number, totalIncl: number): ChangeResult
```

<details><summary>答え</summary>

「お預かり(`received`)と税込合計(`totalIncl`)の2つの数値を受け取り、`ChangeResult` という型の値を返す。他のファイルから使える」。

`ChangeResult` の中身は第7回で読む。**型の名前だけでも「お釣りの計算結果を返すんだな」と予想できる**のがポイント。

</details>

## 問4 `onConfirm` は何ですか?

```ts
type Props = {
  onCancel: () => void
  onConfirm: (result: { received: number; change: number }) => void
}
```

<details><summary>答え</summary>

`onCancel` も `onConfirm` も**関数**。

- `onCancel`:引数なし、何も返さない関数。
- `onConfirm`:`{ received, change }` という形のオブジェクトを1つ受け取り、何も返さない関数。

これは tyoubo の `PayDialog`(電卓画面)の Props。「確定ボタンが押されたら、お預かりとお釣りを渡して `onConfirm` を呼ぶ」という作りになっている。

</details>

## 問5 表示されるものは?

```ts
function greet(name = 'お客様') {
  return `いらっしゃいませ、${name}`
}
console.log(greet())
console.log(greet('山田様'))
```

<details><summary>答え</summary>

```
いらっしゃいませ、お客様
いらっしゃいませ、山田様
```

</details>

## 問6(レビュー目線)消費税を計算する関数が追加されました。気になる点は?

```ts
export function taxOf(totalIncl: number, ratePercent = 10): number {
  return Math.round((totalIncl * ratePercent) / (100 + ratePercent))
}
```

<details><summary>答え</summary>

1. **`Math.round`(四捨五入)になっている。** tyoubo の仕様は「1円未満は切り捨て」なので `Math.floor` が正しい。型は合っているのでコンパイラは何も言わない。**型では見つからない、仕様との食い違いを見つけるのがレビューの仕事。**
2. 税率が `10` と直接書かれている。`DEFAULT_TAX_RATE` という定数があるならそれを使うべき(税率が変わったとき、直し忘れが起きる)。

</details>
