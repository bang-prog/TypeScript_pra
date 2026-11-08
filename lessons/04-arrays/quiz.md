# 第4回 クイズ

## 問1 表示されるものは?

```ts
const qtys = [1, 3, 2]
console.log(qtys.map((q) => q * 10))
console.log(qtys.filter((q) => q >= 2))
```

<details><summary>答え</summary>

```
[ 10, 30, 20 ]
[ 3, 2 ]
```

`map` は全部を変換(個数は変わらない)。`filter` は条件に合うものだけ残す(順番はそのまま)。

</details>

## 問2 表示されるものは?

```ts
const prices = [500, 1200, 300]
console.log(prices.reduce((sum, p) => sum + p, 0))
console.log(prices.reduce((sum, p) => sum + p, 1000))
```

<details><summary>答え</summary>

`2000` と `3000`。

2つ目は最初の値が `1000` なので、`1000 + 500 + 1200 + 300`。**最初の値を間違えると、合計がずれる。**

</details>

## 問3 `found` の型と、表示されるものは?

```ts
const sizes = ['S', 'M', 'L']
const found = sizes.find((s) => s === 'XL')
console.log(found)
```

<details><summary>答え</summary>

型は `string | undefined`、表示は `undefined`。

`find` は見つからないことがあるので、結果の型に `undefined` が含まれる。TypeScript は「`found` が `undefined` かもしれないのに、そのまま使おうとしている」とエラーで教えてくれる(第5回・第7回)。

</details>

## 問4 次の2つの結果は?

```ts
const stocks = [3, 0, -2]
const a = stocks.some((s) => s < 0)
const b = stocks.every((s) => s > 0)
```

<details><summary>答え</summary>

`a` は `true`(マイナスが1つある)、`b` は `false`(全部がプラスではない)。

</details>

## 問5 tyoubo の `catalog.ts` の `addCategory` に、次の行があります。何をしていますか?

```ts
if (all.some((c) => c.name === clean)) throw new ValidationError(`カテゴリー「${clean}」はすでにあります`)
```

<details><summary>答え</summary>

`all`(登録済みのカテゴリー全部)の中に、これから登録しようとしている名前(`clean`)と同じ名前のものが1つでもあれば、エラーにしている。**同じ名前のカテゴリーを二重に登録できないようにするチェック。**

</details>

## 問6(レビュー目線)商品一覧を価格の安い順に表示する関数が追加されました。気になる点は?

```ts
/** 商品一覧を価格の安い順にする */
export function sortByPrice(products: ProductView[]): ProductView[] {
  return products.sort((a, b) => b.priceIncl - a.priceIncl)
}
```

<details><summary>答え</summary>

1. **`b - a` なので、高い順になっている。** コメントでは「安い順」と言っているのに、コードと食い違っている。安い順なら `a.priceIncl - b.priceIncl`。型は合っているので、コンパイラは何も言わない。
2. **`sort` が、受け取った `products` そのものを書き換えている。** 呼び出し側が元の順番(カテゴリー順など)のまま `products` を別の場所でも使っていると、そちらの順番まで変わってしまう。`[...products].sort(...)` のようにコピーしてから並べ替えるべき。

**コメントとコードが食い違っていないか**は、レビューで必ず見るポイント。どちらが正しいのか(仕様はどちらか)を確認する。

</details>
