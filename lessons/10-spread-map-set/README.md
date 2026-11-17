# 第10回 スプレッド・分割代入・Map・Set

**この回のゴール:** `lib/cart.ts` の `cartReducer` の `{ ...l, qty: l.qty + 1 }` と、`db/catalog.ts` の `loadCatalog` の `new Map(...)` や `[...new Set(sizes)]` を読んで、何をしているかがわかる。

```ts
// cartReducer の case 'add'
return lines.some((l) => l.variantId === action.variantId)
  ? lines.map((l) => (l.variantId === action.variantId ? { ...l, qty: l.qty + 1 } : l))
  : [...lines, { variantId: action.variantId, qty: 1 }]
```

これまで「第10回でやります」と後回しにしてきた `...` を、ここで回収します。

---

## 1. 配列の `...`:中身を広げる

`...` は「**中身を全部、ここに広げる**」という意味です(スプレッド構文)。

```ts
const sizes = ['S', 'M']

const copy = [...sizes]               // ['S', 'M'](コピー)
const added = [...sizes, 'L']         // ['S', 'M', 'L'](最後に足す)
const both = [...sizes, ...['L', 'XL']] // ['S', 'M', 'L', 'XL'](つなげる)
```

Python の `[*sizes, 'L']` と同じです。

**どれも新しい配列を作ります。元の `sizes` は変わりません。** ここが `push`(元の配列に足す)との違いです。

```ts
// cartReducer:カートにない商品なら、最後に1行足した「新しいカート」を返す
[...lines, { variantId: action.variantId, qty: 1 }]

// loadCatalog:sort が元を書き換えないように、コピーしてから並べ替える(第4回)
[...vs].sort((a, b) => a.sizeOrder - b.sizeOrder)
```

関数の引数に広げることもできます。

```ts
// catalog.ts の addCategory:並び順の最大 + 1
Math.max(0, ...all.map((c) => c.sortOrder)) + 1
// all.map(...) が [1, 2, 3] なら、Math.max(0, 1, 2, 3) と同じ
```

## 2. オブジェクトの `...`:項目を全部写して、一部だけ変える

```ts
const line = { variantId: 'v1', qty: 2 }
const next = { ...line, qty: 3 }   // { variantId: 'v1', qty: 3 }
```

「`line` の項目を全部写して、そのあと `qty` だけ `3` にする」という意味です。Python の `{**line, 'qty': 3}` と同じです。

**同じ名前の項目があったら、後ろに書いたほうが勝ちます。**

```ts
{ ...line, qty: 3 }   // qty は 3(後ろの qty: 3 が勝つ)
{ qty: 3, ...line }   // qty は 2(後ろの ...line の qty: 2 が勝つ)
```

(2行目のように書くと、TypeScript が「`qty: 3` はすぐ上書きされるので意味がありません」と型エラーで教えてくれます。)

tyoubo の例です。

```ts
// cartReducer:同じ商品の行だけ、数量を1増やした「新しい行」にする
{ ...l, qty: l.qty + 1 }

// loadCatalog:商品(p)の項目を全部写して、画面用の項目を足す
return {
  ...p,
  categoryName: categoryById.get(p.categoryId)?.name ?? '',
  totalStock: vs.reduce((sum, v) => sum + v.stock, 0),
  ...
}

// saveProduct:共通の項目(fields)に、更新日時を足して保存する
await db.products.update(id, { ...fields, updatedAt: now })
```

### なぜ `l.qty += 1` と書かないのか

```ts
l.qty += 1          // ❌ 元の行そのものを書き換える
{ ...l, qty: l.qty + 1 }  // ✅ 新しい行を作る。元の行はそのまま
```

React(第15回〜)では、**画面に出している状態を直接書き換えてはいけない**という決まりがあります。書き換えると、画面が更新されないなどのバグになります。そのため tyoubo では、変えたいときは `...` で新しいものを作ります。第7回の `cartReducer` で「元のカートは書き換えていない」と言ったのは、このことです。

> **レビューで効くポイント:** `reducer` や画面のコードで、`x.qty += 1` や `list.push(...)` のように**元のものを書き換えている**差分を見たら要注意です。`{ ...x, qty: ... }` や `[...list, ...]` で新しく作るべきところかもしれません。

## 3. 分割代入(配列の形も)

第3回でオブジェクトの分割代入をやりました。

```ts
// lib/cart.ts の buildCartView
const { product, variant } = found
// const product = found.product; const variant = found.variant と同じ
```

**配列でもできます。** `[ ]` を使って、順番どおりに取り出します。

```ts
// lib/time.ts の parseBusinessDate
const [y, m, d] = businessDate.split('-').map(Number)
// '2026-11-17' → y = 2026, m = 11, d = 17
```

Python の `y, m, d = ...` と同じです。

`entries()` と組み合わせると、「何番目か」と「中身」を同時に取り出せます。Python の `enumerate` です。

```ts
// catalog.ts の saveProduct
for (const [colorOrder, color] of colors.entries()) {
  // colorOrder は 0, 1, 2 …、color は '白', '黒' …
}
```

第5回の `examples.ts` で出てきた `for (const [label, v] of values)` も、この形です。

## 4. `Map`:キーで引ける表

```ts
const stockOf = new Map<string, number>()   // キーは文字列、値は数値
stockOf.set('M/白', 3)       // 入れる
stockOf.get('M/白')          // 3(取り出す)
stockOf.get('L/黒')          // undefined(ない)
stockOf.has('M/白')          // true(あるか)
```

Python の `dict` とほぼ同じです。

| | TypeScript の `Map` | Python の `dict` |
|---|---|---|
| 作る | `new Map<string, number>()` | `{}` |
| 入れる | `m.set(k, v)` | `d[k] = v` |
| 取り出す | `m.get(k)` | `d.get(k)` |
| あるか | `m.has(k)` | `k in d` |
| 個数 | `m.size` | `len(d)` |

**`get` はキーがないと `undefined` を返します**(Python の `d[k]` のようにエラーにはなりません)。なので型は `number | undefined` になり、tyoubo では `?? 0` や `?? []` と組み合わせて使います(第5回)。

```ts
// saveProduct:入力された在庫数を引く。入力がなければ 0
const stock = stockOf.get(key) ?? 0
```

### 配列から `Map` を作る

```ts
// loadCatalog:カテゴリーの id から、カテゴリーを引ける表を作る
const categoryById = new Map(categories.map((c) => [c.id, c]))
```

`[キー, 値]` の組の配列を `new Map(...)` に渡すと、表になります。Python の `{c.id: c for c in categories}` です。

**なぜ `find` ではなく `Map` を使うのでしょう。** 商品が100個あったら、`find` は毎回カテゴリーの配列を最初から探します。`Map` を一度作っておけば、`get` ですぐに引けます。

> **読むときのコツ:** `xxxById`・`xxxByProduct`・`byKey` のような名前の変数は、たいてい `Map` です。「**By のあとのものから、前のものを引ける表**」と読みます。

## 5. `Set`:重複のない集まり

```ts
const kept = new Set<string>()
kept.add('v1')
kept.add('v1')       // 同じものは増えない
kept.has('v1')       // true
kept.size            // 1
```

Python の `set` と同じです。tyoubo では、「**これはもう処理したか**」を覚えておくのに使っています(`saveProduct` の `kept`)。

### 重複を消す決まり文句

```ts
[...new Set(sizes)]
// ['S', 'M', 'S', 'L'] → ['S', 'M', 'L']
```

`new Set(sizes)` で重複を消し、`[... ]` で配列に戻しています。**順番は、最初に出てきた順のまま**です。第6回の `splitList` の最後もこれでした。

## 6. `as const` と `as`

### `as const`:値を固定する

```ts
// lib/payment.ts
export const PAYMENT_METHODS = ['cash', 'card', 'emoney', 'qr'] as const
```

`as const` を付けると、「この配列は書き換えない。中身はこの4つの文字列そのもの」という意味になります。付けないと、型はただの `string[]` です。第7回の「中身のどれか」という型(`PaymentMethod`)は、`as const` があるから作れます。

### `as`:型を言い張る(型アサーション)

```ts
// lib/pinAttempts.ts
const v = JSON.parse(raw) as Partial<State>
```

`値 as 型` は、「**この値はこの型だと、私が保証する**」と TypeScript に伝える書き方です。`JSON.parse` の結果は何が入っているかわからないので、「`State` の形のはず」と言い張っています。

第5回の後ろの `!` と同じ仲間です。**TypeScript は `as` を信じるだけで、実行するときに本当にその型かは確かめません。**

> **レビューで効くポイント:** 差分に `as` が出てきたら、「**本当にその型と言い切れるか**」を確認します。特に `as unknown as 型` は、「型チェックを完全に黙らせる」書き方です。外から来たデータ(ファイル・保存データ)に `as` を使っているなら、その前に中身を確かめているか(第7回の型ガードのように)を見ます。tyoubo の `db/backup.ts` の `parseBackup` は、中身を1つずつ確かめてから最後に `as BackupFile` しています。

---

## やってみる

```bash
node lessons/10-spread-map-set/examples.ts
```

→ [quiz.md](quiz.md) → [exercise.ts](exercise.ts)(採点:`npm run check 10`)

## tyoubo を読む

[../../../tyoubo/src/db/catalog.ts](../../../tyoubo/src/db/catalog.ts) の `loadCatalog` を開いて答えてください。第4回でも読んだ関数です。今度は全部読めるはずです。

1. `categoryById` は何から何を引ける表ですか?
2. `variantsByProduct` を作っている `for` の中で、`?? []` は何のためにありますか?
3. `sizes: [...new Set(sizes)]` は、どんな配列ですか?なぜ `new Set` が必要なのでしょう?(ヒント:サイズ × 色の組み合わせごとにバリエーションがある)

[../../../tyoubo/src/lib/cart.ts](../../../tyoubo/src/lib/cart.ts) を開いてください。

4. `cartReducer` の `case 'add':` で、`{ ...l, qty: l.qty + 1 }` は何を作っていますか?元の `l` は変わりますか?
5. `buildCartView` の `const { product, variant } = found` は、何をしていますか?

<details>
<summary>答え</summary>

1. カテゴリーの `id` から、カテゴリー(名前や並び順)を引ける表。
2. その商品のバリエーションがまだ表に1つもない(`get` が `undefined`)ときに、空の配列から始めるため。そのあと `push` して `set` し直している。
3. その商品のサイズを、重複なしで並べた配列。バリエーションは「サイズ × 色」ごとにあるので、白の M と黒の M のように同じサイズが何回も出てくる。`new Set` で重複を消している。
4. `l` の項目を全部写して、`qty` だけ1増やした新しい行。元の `l` は変わらない。
5. `found`(`{ product: ..., variant: ... }`)から、`product` と `variant` を取り出して、同じ名前の変数にしている。

</details>
