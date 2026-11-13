# 第8回 モジュール

**この回のゴール:** tyoubo のどのファイルでも先頭にある `import` の行を読んで、「どのファイルの、何を使っているか」がわかる。

```ts
// db/sales.ts の先頭
import { newId } from '../lib/id'
import { isPaymentMethod, type PaymentMethod } from '../lib/payment'
import { calcChange, cartTotal, lineTotal, MAX_RECEIVED, taxOf } from '../lib/money'
import type { AppDB } from './db'
import { ValidationError } from './errors'
```

`import` の行は、**そのファイルが何に頼っているかの一覧**です。ここが読めると、知らない関数が出てきたときに「どこを開けばいいか」がすぐわかります。

---

## 1. モジュール = 1つのファイル

TypeScript では、**1つのファイルが1つのモジュール**です。Python と同じ考え方です。

| | TypeScript | Python |
|---|---|---|
| 他のファイルから使えるようにする | `export` を付ける | (何もしなくても使える) |
| 他のファイルのものを使う | `import { formatYen } from './money'` | `from money import format_yen` |

**大きな違い:** Python は、ファイルに書いたものは全部、他のファイルから import できます。TypeScript は、**`export` を付けたものだけ**が外から使えます。

```ts
// money.ts
export function formatYen(value: number): string { ... }  // 外から使える
function roundDown(value: number): number { ... }         // このファイルの中だけ
```

`export` が付いていないものは、そのファイルの中だけの「内部の部品」です。tyoubo の `lib/cashInput.ts` の `fromAmount` がその例です。

> **読むときのコツ:** 知らないファイルを開いたら、まず **`export` が付いているもの**を探す。それが「このファイルが外に提供しているもの」です。`export` のないものは、その手伝い役です。

## 2. `import { 名前 } from 'パス'`

```ts
import { calcChange, formatYen } from '../lib/money'
```

「`../lib/money` というファイルから、`calcChange` と `formatYen` を持ってくる」という意味です。`{ }` の中には、相手のファイルで **`export` されている名前をそのまま**書きます。

この形を**名前付き export / import** と言います。tyoubo の `lib/` と `db/` は、ほぼ全部この形です。

## 3. パスの読み方:`./` と `../`

`'../lib/money'` のように `.` で始まるパスは、**今のファイルから見た場所**(相対パス)です。

| 書き方 | 意味 |
|---|---|
| `./` | 今のファイルと**同じフォルダ** |
| `../` | **1つ上**のフォルダ |
| `../../` | 2つ上のフォルダ |

tyoubo のフォルダはこうなっています。

```
src/
├── lib/
│   └── money.ts
├── db/
│   ├── sales.ts
│   └── errors.ts
└── components/
    ├── PayDialog.tsx
    └── products/
        └── ProductForm.tsx
```

- `db/sales.ts` の `'./errors'` → 同じ `db/` の中の `errors.ts`
- `db/sales.ts` の `'../lib/money'` → 1つ上(`src/`)に出て、`lib/` の中の `money.ts`
- `components/products/ProductForm.tsx` の `'../../lib/money'` → 2つ上(`src/`)に出て、`lib/money.ts`

**拡張子(`.ts`)は書かないのが普通です。** tyoubo を動かしている道具(Vite)が、自動で `.ts` や `.tsx` を探してくれます。

(この学習フォルダでは、Node でそのまま動かすために `'./money.ts'` と拡張子まで書いています。意味は同じです。)

### `.` で始まらないパス

```ts
import { useReducer } from 'react'
```

`.` で始まらないものは、**インストールしたライブラリ**です(`node_modules` の中にあります)。Python の `import requests` のように、自分で書いたものではないファイルです。

> **読むときのコツ:** `import` の行は、**`.` で始まるか**で2つに分けて読む。`.` で始まらないもの(`react` など)はライブラリ、`.` で始まるものは tyoubo 自身のファイルです。

## 4. `import type`:型だけを持ってくる

```ts
import type { AppDB } from './db'
import { isPaymentMethod, type PaymentMethod } from '../lib/payment'
```

`import type` は「**型だけ**を持ってくる」という意味です。2行目のように、`{ }` の中で1つずつ `type` を付けることもできます。`isPaymentMethod` は関数、`PaymentMethod` は型です。

なぜ分けるのでしょう。第1回で「型は実行前のチェック用で、実行するときには消える」と学びました。`type` が付いていると、「これは実行するときには消してよい」とすぐわかります。

> **読むときのコツ:** `type` が付いた名前は「型」、付いていない名前は「関数・値・クラス」。`import` の行だけで区別できます。

## 5. `export default`:ファイルの「主役」を1つだけ

```ts
// components/PayDialog.tsx
export default function PayDialog(...) { ... }
```

```ts
// 使う側
import PayDialog from './PayDialog'
```

`export default` は、**そのファイルの主役を1つだけ**決める書き方です。使う側では `{ }` を付けずに書きます。

tyoubo では、**画面の部品(`components/` の中の `.tsx` ファイル)は `export default`** を使っています。1ファイルに1つの部品、という作りだからです。それ以外(`lib/`・`db/`)は名前付き export です。

| | 書き出す側 | 使う側 |
|---|---|---|
| 名前付き | `export function formatYen` | `import { formatYen } from ...` |
| default | `export default function PayDialog` | `import PayDialog from ...` |

`{ }` があるかないかで、どちらなのかがわかります。

**注意:** default の場合、使う側は好きな名前を付けられます。`import Hoge from './PayDialog'` と書いてもエラーになりません。tyoubo では、ファイル名と同じ名前にそろえています。

## 6. その他の import

```ts
// main.tsx
import './styles/global.css'
import styles from './PayDialog.module.css'
```

1行目のように `from` がないものは、「**そのファイルを読み込むだけ**」(ここでは画面のデザインの CSS)です。2行目は、CSS の読み込み方の一つです(第14回で少し触れます)。今は「見た目の設定を読み込んでいる」と思えば十分です。

> **レビューで効くポイント:** 差分で `import` の行が増えたら、「**どのファイルに頼るようになったか**」を見ます。たとえば `lib/`(計算)や `db/`(データの保存)のファイルが `components/`(画面)から import し始めたら、作りが崩れているサインです。tyoubo では「画面 → データ → 計算」の向きにだけ頼るように分けていて、今は `lib/` と `db/` から `components/` を import しているファイルはありません(第18回で詳しく)。

---

## やってみる

```bash
node lessons/08-modules/examples.ts
```

このフォルダには、`examples.ts` から import される部品のファイル(`money.ts`・`types.ts`・`labels.ts`)もあります。開いて、`export` が付いているものを確かめてください。

→ [quiz.md](quiz.md) → [exercise.ts](exercise.ts)(採点:`npm run check 08`)

## tyoubo を読む

[../../../tyoubo/src/db/sales.ts](../../../tyoubo/src/db/sales.ts) の先頭の `import` を見て答えてください。

1. `calcChange` はどのファイルにありますか?`src/` から始まるパスで答えてください。
2. `ValidationError` はどのファイルにありますか?
3. `AppDB` と `Sale` は、関数・値ですか?それとも型ですか?どこでわかりますか?

[../../../tyoubo/src/components/PayDialog.tsx](../../../tyoubo/src/components/PayDialog.tsx) の先頭を見てください。

4. `react` からの import と、`../lib/money` からの import は、何が違いますか?
5. `import Modal from './Modal'` は、名前付きと default のどちらですか?`Modal.tsx` を開いて確かめてください。

<details>
<summary>答え</summary>

1. `src/lib/money.ts`(`sales.ts` は `src/db/` にあるので、`../` で `src/` に出て `lib/money`)。
2. `src/db/errors.ts`(`./` なので同じ `db/` フォルダ)。
3. 型。`import type { AppDB }`・`import type { Sale, SaleItem }` と、`type` が付いている。
4. `react` は `.` で始まらないので、インストールしたライブラリ(React 本体)。`../lib/money` は tyoubo 自身のファイル。
5. default(`{ }` がない)。`Modal.tsx` には `export default function Modal` がある。

</details>
