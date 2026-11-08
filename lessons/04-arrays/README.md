# 第4回 配列と配列メソッド

**この回のゴール:** `lib/money.ts` の `cartTotal` と、`db/catalog.ts` の `loadCatalog` の中の配列の処理を読んで、何をしているかがわかる。

```ts
/** 会計の税込合計。 */
export function cartTotal(lines: readonly Line[]): number {
  return lines.reduce((sum, line) => sum + lineTotal(line), 0)
}
```

tyoubo では `map` が60回以上、`reduce`・`sort`・`some`・`filter` もそれぞれ10回以上出てきます。**この回の内容が読めると、tyoubo のかなりの部分が読めるようになります。**

---

## 1. 配列

```ts
const sizes = ['S', 'M', 'L']
console.log(sizes[0])       // 'S'(0 から数える)
console.log(sizes.length)   // 3(Python の len(sizes))
```

| | TypeScript | Python |
|---|---|---|
| 作る | `['S', 'M', 'L']` | `['S', 'M', 'L']` |
| 取り出す | `sizes[0]` | `sizes[0]` |
| 長さ | `sizes.length` | `len(sizes)` |
| 末尾に足す | `sizes.push('XL')` | `sizes.append('XL')` |
| 含むか | `sizes.includes('M')` | `'M' in sizes` |
| つなげて文字列に | `sizes.join(', ')` | `', '.join(sizes)` |

**型の書き方:** `string[]` は「文字列の配列」(Python の `list[str]`)。`Variant[]` なら「`Variant` の配列」。

```ts
const items: SaleItem[] = []   // 最初は空。あとで push する
```

`readonly Line[]` は「中身を書き換えない配列」。`cartTotal` は受け取った配列を読むだけで変更しない、という約束です。

## 2. `for ... of`:1つずつ取り出す

```ts
for (const size of sizes) {
  console.log(size)
}
```

Python の `for size in sizes:` と同じです。**`in` ではなく `of`** なので注意してください(`for ... in` という別の書き方もありますが、tyoubo では使っていません)。

`continue`(次へ進む)と `break`(ループを抜ける)は Python と同じです。

## 3. 配列メソッド:ここからが本題

tyoubo では `for` よりも、**配列メソッドに関数を渡す書き方**がずっと多く使われています。第2回で学んだアロー関数が、ここで大活躍します。

### `map`:全部を変換して、新しい配列を作る

```ts
const prices = [980, 6980, 1500]
const withTax = prices.map((p) => p * 2)   // [1960, 13960, 3000]
```

「各要素に関数を使って、その結果を並べた新しい配列」を作ります。Python のリスト内包表記 `[p * 2 for p in prices]` と同じです。

```ts
// tyoubo の loadCatalog:バリエーションの配列から、色だけの配列を作る
const colors = vs.map((v) => v.color)
```

**読み方:** `配列.map((1つ分) => 変換したもの)`。「全部の `v` について、`v.color` を取り出す」。

### `filter`:条件に合うものだけ残す

```ts
const active = products.filter((p) => p.isActive)
```

関数が `true` を返した要素だけを残します。Python の `[p for p in products if p.is_active]` です。

```ts
// tyoubo の cart.ts:カートの中で、まだ売っている商品だけを合計する
return cartTotal(items.filter((i) => i.available))
```

### `find`:条件に合う最初の1つ

```ts
const product = catalog.products.find((p) => p.id === pickingId)
```

見つからなかったときは **`undefined`** が返ります。なので `find` の結果の型は `Product | undefined` になります。`===` は「等しい」(第5回で詳しく)。

関連:`findIndex` は「何番目か」を返します(見つからなければ `-1`)。

### `some`:1つでも条件に合うものがあるか

```ts
// tyoubo の loadCatalog:在庫がマイナスのバリエーションが1つでもあるか
hasNegative: vs.some((v) => v.stock < 0),
```

結果は `true` か `false`。Python の `any(v.stock < 0 for v in vs)` です。全部が条件に合うかは `every`(Python の `all`)。

### `reduce`:全部をまとめて1つの値にする

一番難しいメソッドです。ゆっくり読んでください。

```ts
const total = [980, 6980, 1500].reduce((sum, p) => sum + p, 0)   // 9460
```

- 最後の `0` が**最初の値**
- `(sum, p) => sum + p` が「これまでの結果 `sum` と、次の要素 `p` から、新しい結果を作る」関数

1つずつ追うとこうなります:

| 回 | `sum` | `p` | `sum + p` |
|---|---|---|---|
| 1 | 0(最初の値) | 980 | 980 |
| 2 | 980 | 6980 | 7960 |
| 3 | 7960 | 1500 | **9460** ← 結果 |

Python なら `sum(prices)` や `functools.reduce(lambda s, p: s + p, prices, 0)` です。tyoubo の `reduce` は、ほぼすべて「**合計を出す**」ために使われています。

```ts
// money.ts の cartTotal:明細ごとの金額(単価 × 数量)を足していく
lines.reduce((sum, line) => sum + lineTotal(line), 0)

// catalog.ts の loadCatalog:在庫数の合計
totalStock: vs.reduce((sum, v) => sum + v.stock, 0),
```

> **読むときのコツ:** `reduce` を見たら、まず**最後の引数(最初の値)**を見る。`0` なら、たいてい合計。

### `sort`:並べ替え

```ts
const sorted = [...vs].sort((a, b) => a.sizeOrder - b.sizeOrder)
```

`(a, b) => a.sizeOrder - b.sizeOrder` は「`a` と `b` のどちらを先にするか」を決める関数です。

- 結果がマイナス → `a` が先
- 結果がプラス → `b` が先

なので、**`a.x - b.x` なら小さい順、`b.x - a.x` なら大きい順**、と覚えておけば読めます。文字列は `a.name.localeCompare(b.name, 'ja')` で比べます(第2回で出てきたロケールです)。

**注意:`sort` は元の配列を書き換えます。** `map` や `filter` は新しい配列を作りますが、`sort` だけは違います。そこで tyoubo では `[...vs]` で配列をコピーしてから並べ替えています(`...` は第10回で詳しくやります。ここでは「コピーを作る」と読めれば十分です)。

## 4. つなげて書く(メソッドチェーン)

メソッドは結果が配列なので、続けてつなげられます。上から順に読みます。

```ts
// tyoubo の loadCatalog(簡単にしたもの)
const views = products
  .filter((p) => p.isActive)   // ① 削除していない商品だけにして
  .map((p) => ({ ...p, ... })) // ② それぞれ画面用の形に変えて
  .sort((a, b) => ...)         // ③ 並べ替える
```

> **レビューで効くポイント:** `sort` が元の配列を書き換えることを忘れたコードは、よくあるバグの原因になります。「並べ替えたら、別の場所で使っている元の配列の順番まで変わっていた」というものです。差分に `.sort(` が出てきたら、**元の配列を書き換えても困らないか**を確認します。

---

## やってみる

```bash
node lessons/04-arrays/examples.ts
```

→ [quiz.md](quiz.md) → [exercise.ts](exercise.ts)(採点:`npm run check 04`)

## tyoubo を読む

[../../../tyoubo/src/db/catalog.ts](../../../tyoubo/src/db/catalog.ts) の `loadCatalog` を開いて答えてください。`?.` や `??`、`new Set`、`new Map` などまだ習っていないものも出てきますが、**配列メソッドの部分だけ**読めれば大丈夫です。

1. `products.filter((p) => p.isActive)` は何をしていますか?なぜこれが必要なのでしょう?(第3回の「論理削除」を思い出す)
2. `totalStock` には何が入りますか?
3. `hasNegative` が `true` になるのはどんなときですか?
4. `const sizes = [...vs].sort(...).map((v) => v.size)` は、どんな配列を作っていますか?なぜ `vs.sort(...)` ではなく `[...vs].sort(...)` なのでしょう?(ヒント:次の行で `vs` をもう一度使っている)

もう1つ、[../../../tyoubo/src/lib/closing.ts](../../../tyoubo/src/lib/closing.ts)(レジ締めの計算)の `countedTotal` も見てください。

5. この関数は何を計算していますか?`reduce` の最初の値と、足しているものに注目してください。(`?? 0` は「なければ 0」という意味です。第5回でやります)

<details>
<summary>答え</summary>

1. 削除していない(`isActive` が `true` の)商品だけを残している。tyoubo は商品を削除しても本当には消さない(論理削除)ので、こうして画面に出す前に取り除く必要がある。
2. その商品のすべてのバリエーション(サイズ × 色)の在庫数の合計。
3. バリエーションのうち、1つでも在庫(`stock`)がマイナスのものがあるとき。
4. サイズを `sizeOrder`(サイズの並び順)の順に並べた、サイズ名の配列。`sort` は元の配列を書き換えるので、`vs.sort(...)` と書くと `vs` の順番が変わってしまう。`vs` は直前で「色の順 → サイズの順」に並べてあり、次の行の `colors` やそのあとの `variants: vs` でその順番のまま使いたいので、コピーしてから並べ替えている。
5. レジの中の現金の合計。最初の値は `0` で、金種(1万円札〜1円玉)ごとに「額面 × 枚数」を足していく。

</details>
