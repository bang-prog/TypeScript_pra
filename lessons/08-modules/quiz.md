# 第8回 クイズ

## 問1 `money.ts` が次のようになっています。`main.ts` で使えるのはどれ?

```ts
// money.ts
export const MAX_RECEIVED = 9_999_999
export function formatYen(value: number): string { ... }
function roundDown(value: number): number { ... }
```

```ts
// main.ts
import { MAX_RECEIVED, formatYen, roundDown } from './money'
```

<details><summary>答え</summary>

`MAX_RECEIVED` と `formatYen`。

`roundDown` には `export` が付いていないので、`money.ts` の外からは使えない(import するとエラー)。Python と違って、**`export` を付けたものだけ**が外から使える。

</details>

## 問2 次のファイルは `src/components/register/RegisterPage.tsx` にあります。それぞれ、どのファイルを指していますか?

```ts
import PayDialog from '../PayDialog'
import { cartReducer } from '../../lib/cart'
import ProductGrid from './ProductGrid'
```

<details><summary>答え</summary>

- `'../PayDialog'` → 1つ上の `src/components/` の `PayDialog.tsx`
- `'../../lib/cart'` → 2つ上の `src/` に出て、`lib/cart.ts`
- `'./ProductGrid'` → 同じ `src/components/register/` の `ProductGrid.tsx`

</details>

## 問3 次の import のうち、default import はどれ?

```ts
import { useState } from 'react'           // A
import Modal from './Modal'                // B
import { formatYen } from '../lib/money'   // C
import styles from './PayDialog.module.css' // D
```

<details><summary>答え</summary>

B と D(`{ }` がない)。

A と C は名前付き import。tyoubo では、画面の部品(`Modal` など)は default、`lib/` の関数は名前付き、という使い分けになっている。

</details>

## 問4 次の行のうち、型はどれ?関数・値はどれ?

```ts
import { isPaymentMethod, type PaymentMethod, PAYMENT_LABELS } from '../lib/payment'
```

<details><summary>答え</summary>

型は `PaymentMethod`(`type` が付いている)。`isPaymentMethod`(関数)と `PAYMENT_LABELS`(値)は、実行するときにも使われるもの。

`type` が付いたものは、実行するときには消える。

</details>

## 問5 tyoubo の `db/sales.ts` の `createSale` で、`calcChange(received, totalIncl)` という呼び出しを見つけました。`calcChange` の中身を読みたいとき、どのファイルを開けばいいですか?どうやって調べますか?

<details><summary>答え</summary>

`src/lib/money.ts`。

ファイルの先頭の `import { calcChange, ... } from '../lib/money'` を見ればわかる。`sales.ts` は `src/db/` にあるので、`../` で `src/` に出て `lib/money.ts`。

VS Code なら、`calcChange` の上で `F12`(定義へ移動)を押しても飛べる。**`import` の行は「どこを開けばいいか」の案内板**になっている。

</details>

## 問6(レビュー目線)返品の画面(`src/components/history/RefundDialog.tsx`)に、次の import が追加されました。気になる点は?

```ts
import { formatYen } from '../../lib/money'
import { recordRefund } from '../../db/refunds'
import { db } from '../../db/db'
import RefundDialog from './RefundDialog'
```

<details><summary>答え</summary>

**4行目で、自分自身(`RefundDialog.tsx`)を import している。** 同じフォルダの `./RefundDialog` は、このファイル自身。おそらく、別のファイルからコピーしてきたときの消し忘れ。

1〜3行目は、画面(`components/`)が計算(`lib/`)やデータ(`db/`)に頼る、正しい向き。

**import の行は、差分の中で一番読み飛ばされやすい場所**。「このファイルが本当にこれを使うのか」「頼る向きは正しいか」を見るのがレビューのポイント。

</details>
