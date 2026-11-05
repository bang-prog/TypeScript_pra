# 第3回 クイズ

## 問1 エラーになるのはどれ?

```ts
type CartLine = { variantId: string; qty: number }

const a: CartLine = { variantId: 'v1', qty: 2 }             // (ア)
const b: CartLine = { variantId: 'v1' }                     // (イ)
const c: CartLine = { variantId: 'v1', qty: '2' }           // (ウ)
const d: CartLine = { qty: 2, variantId: 'v1' }             // (エ)
```

<details><summary>答え</summary>

**(イ)と(ウ)。**

- (イ):`qty` がない。
- (ウ):`qty` が文字列 `'2'` になっている。
- (エ):OK。項目の順番は関係ない。

</details>

## 問2 表示されるものは?

```ts
const tax = 80
const result = { incl: 880, tax, excl: 880 - tax }
console.log(result.excl, result.tax)
```

<details><summary>答え</summary>

`800 80`。`tax` は `tax: tax`(= 80)の省略。

</details>

## 問3 `ProductView` が持っている項目は?

```ts
type Product = { id: string; name: string; priceIncl: number }
type ProductView = Product & { categoryName: string; totalStock: number }
```

<details><summary>答え</summary>

`id`、`name`、`priceIncl`、`categoryName`、`totalStock` の5つ。`&` で両方の項目を全部持つ。

</details>

## 問4 次の関数の中で、`busy` と `error` の値は?

```ts
type Props = { total: number; busy?: boolean; error?: string | null }

function f({ total, busy = false, error = null }: Props) {
  console.log(total, busy, error)
}
f({ total: 500 })
```

<details><summary>答え</summary>

`500 false null`。

`busy` と `error` は省略されたので `undefined` だが、分割代入のデフォルト値(`= false`、`= null`)が使われる。

</details>

## 問5 `money.ts` の `cartTotal(lines: readonly Line[])` に、`SaleItem[]` を渡せるのはなぜ?

```ts
type Line = { unitPriceIncl: number; qty: number }
type SaleItem = { id: string; saleId: string; productName: string; unitPriceIncl: number; qty: number; /* ほか */ }
```

<details><summary>答え</summary>

`SaleItem` が `unitPriceIncl: number` と `qty: number` を持っていて、**`Line` の形を満たしている**から(構造的型付け)。項目が多い分には問題ない。

</details>

## 問6(レビュー目線)`types.ts` に次の変更が入りました。気になる点は?

```ts
export type Product = {
  id: string
  name: string
  categoryId: string
  price: number
  cost: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}
```

<details><summary>答え</summary>

`priceIncl` が `price` に変わっていて、**税込か税抜かが名前からわからなくなった**。

さらに大事なのは、**保存済みのデータとの互換性**。IndexedDB にはすでに `priceIncl` という名前でデータが保存されているので、型の名前だけ変えると、古いデータを読んだときに `price` が `undefined` になる。型を変えたら、それを使っている全部の場所と、保存済みデータの移行(Dexie の `version(2)`)まで確認が必要。

`types.ts` の変更は影響範囲が広いので、レビューでは特に丁寧に見る。

</details>
