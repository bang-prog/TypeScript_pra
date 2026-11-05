# 第3回 オブジェクトと `type`

**この回のゴール:** `db/types.ts` を読んで、tyoubo が保存しているデータ(商品・在庫・会計…)の形がわかる。

```ts
export type Product = {
  id: string
  name: string
  categoryId: string
  /** 販売価格(税込) */
  priceIncl: number
  ...
}
```

---

## 1. オブジェクト

いくつかの値に名前を付けてまとめたものです。Python の dict に近い見た目です。

```ts
const product = {
  id: 'p1',
  name: 'オックスフォードシャツ',
  priceIncl: 6980,
  isActive: true,
}

console.log(product.name)       // 'オックスフォードシャツ'
console.log(product['name'])    // 同じ(普段は . を使う)
```

| | TypeScript | Python(dict) |
|---|---|---|
| キー | `name:`(`'` 不要) | `'name':` |
| 取り出し | `product.name` | `product['name']` |
| 区切り | `,`(最後の `,` はあってもよい) | `,` |

tyoubo では、データはほぼすべてオブジェクトで表されています(クラスはほぼ使っていません)。

## 2. `type` でオブジェクトの形に名前を付ける

```ts
type TaxBreakdown = {
  /** 税込金額 */
  incl: number
  /** うち消費税 */
  tax: number
  /** 税抜金額 */
  excl: number
}
```

「`incl`・`tax`・`excl` の3つの数値を持つオブジェクト」という**形に名前を付けた**ものです。これを**型エイリアス**と呼びます。

```ts
const b: TaxBreakdown = { incl: 11270, tax: 1024, excl: 10246 }  // OK
const c: TaxBreakdown = { incl: 11270, tax: 1024 }               // エラー:excl がない
const d: TaxBreakdown = { incl: 11270, tax: 1024, excl: 0, x: 1 } // エラー:余計な x がある
```

- 項目の区切りは改行(`;` や `,` でもよい)。1行で書くときは `{ variantId: string; qty: number }` のように `;` で区切ります。
- Python の `TypedDict` や `@dataclass` に近い役割ですが、**実行時には消えます。** 型チェックのためだけにあります。
- `interface` という似た書き方もあります(`interface Product { ... }`)。ほぼ同じ意味だと思って読んで大丈夫です。tyoubo は `type` で統一しています。

> **読むときのコツ:** 型の名前を見たら、F12(定義へ移動)で中身を見に行く。`db/types.ts` のように型をまとめたファイルは、**アプリが扱うデータの一覧表**として読める。

## 3. 構造で判断される

TypeScript は「**同じ形なら同じ型**」と考えます(構造的型付け)。

```ts
type Line = { unitPriceIncl: number; qty: number }

function lineTotal(line: Line): number {
  return line.unitPriceIncl * line.qty
}

lineTotal({ unitPriceIncl: 990, qty: 3 })   // OK。Line と宣言していなくても、形が合えばよい
```

tyoubo の `sales.ts` では、`SaleItem`(会計の明細)の配列を、`Line[]` を受け取る `cartTotal` にそのまま渡しています。`SaleItem` は `unitPriceIncl` と `qty` を持っているので、形が合うからです。

## 4. `?:` 省略できる項目

```ts
type Props = {
  total: number
  /** 保存している間は確定できないようにする */
  busy?: boolean
}
```

`busy?:` は「`busy` はあってもなくてもよい」。ないときの値は `undefined` です。つまり `busy` の型は実質 `boolean | undefined` になります。

```ts
const p1: Props = { total: 100 }               // OK
const p2: Props = { total: 100, busy: true }   // OK
```

## 5. ネストと配列

```ts
type Catalog = {
  categories: Category[]     // Category の配列
  products: ProductView[]
}
```

`Category[]` は「`Category` の配列」(Python の `list[Category]`)。配列は第4回で詳しくやります。

## 6. `&`:型を合成する

```ts
export type ProductView = Product & {
  categoryName: string
  sizes: string[]
  ...
}
```

`A & B` は「`A` の項目も `B` の項目も全部持つ」。`ProductView` は「`Product` の全項目 + 画面表示用の項目(カテゴリー名やサイズの一覧など)」です。データベースに保存する形(`Product`)と、画面で使う形(`ProductView`)を分けている、と読めます。

## 7. 書き方の省略:`{ tax }`

変数名とキー名が同じとき、省略して書けます。

```ts
const tax = 1024
const excl = 10246
const b = { incl: 11270, tax, excl }   // { incl: 11270, tax: tax, excl: excl } と同じ
```

`money.ts` の `splitTax` がこの形です:

```ts
return { incl: totalIncl, tax, excl: totalIncl - tax }
```

## 8. 分割代入(取り出し)の基本

オブジェクトから項目を取り出して、同じ名前の変数にします。

```ts
const { product, variant } = found
// const product = found.product
// const variant = found.variant  と同じ
```

関数の引数でもよく使います。**画面のコードはほぼすべてこの形です:**

```ts
export default function PayDialog({ total, busy = false, error = null, onCancel, onConfirm }: Props) {
```

「`Props` 型のオブジェクトを受け取り、そこから `total`、`busy`(なければ `false`)… を取り出す」。第10回でもう一度やります。

## 9. `readonly` / `Readonly<...>`

```ts
export const DEFAULT_SETTINGS: Readonly<Settings> = { ... }
```

`Readonly<Settings>` は「`Settings` と同じ形だけど、項目を書き換えられない」。`const` は「変数に別の値を入れ直せない」だけで、**オブジェクトの中身は書き換えられてしまう**ので、中身も守りたいときに使います。

```ts
const a = { x: 1 }
a.x = 2          // OK(const でも中身は変えられる)
a = { x: 3 }     // エラー(入れ直しはできない)
```

---

## やってみる

```bash
node lessons/03-objects-and-types/examples.ts
```

→ [quiz.md](quiz.md) → [exercise.ts](exercise.ts)(採点:`npm run check 03`)

この回の演習は**型エラーも採点に入ります**(`npm run check` はテストと型チェックの両方を見ます)。

## tyoubo を読む

[../../../tyoubo/src/db/types.ts](../../../tyoubo/src/db/types.ts) を開いて答えてください。

1. 商品(`Product`)の価格は、税込と税抜のどちらで保存していますか?
2. 商品を削除しても、データベースからは消えません。どの項目でそれがわかりますか?なぜ消さないのですか?
3. 「Mサイズの白」のような組み合わせは、どの型で表されていますか?在庫はどこに持っていますか?
4. `SaleItem`(会計の明細)には、`variantId` があるのに `productName` も持っています。なぜ商品名をわざわざ書き写しているのでしょう?(コメントを読む)
5. `Sale` と `SaleItem` はどの項目でつながっていますか?

<details>
<summary>答え</summary>

1. **税込**(`priceIncl`、コメント「販売価格(税込)」)。Incl は including tax の略。
2. `isActive`。過去の売上(`SaleItem`)がその商品を参照しているので、消すと過去の記録がおかしくなるから(論理削除)。
3. `Variant`(バリエーション)。`size` と `color` の組み合わせ1つが1件で、`stock`(在庫数)を持つ。`productId` で商品とつながっている。
4. 「会計した時点の値を書き写しておく」ため。あとで商品名や価格を変えても、過去の会計の記録が変わらないようにしている。
5. `SaleItem.saleId` が `Sale.id` を指している(1回の会計に明細が複数ある)。

</details>

**発展:** `docs/spec.md` の「§8」(データの設計)と見比べると、仕様書の表と `types.ts` がほぼ1対1で対応しているのがわかります。**レビューでは「仕様書と型が食い違っていないか」も確認ポイントです。**
