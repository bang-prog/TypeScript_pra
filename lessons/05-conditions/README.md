# 第5回 条件分岐と演算子

**この回のゴール:** `db/sales.ts` の `createSale`(会計を保存する関数)の最初の「入力チェック」と、`lib/closing.ts` の `differenceOf`(レジ締めの過不足)を読んで、どんなときに何が起きるかがわかる。

```ts
const paymentMethod = input.paymentMethod ?? 'cash'
const isCash = paymentMethod === 'cash'
if (isCash && (!Number.isSafeInteger(input.received) || input.received < 0 || input.received > MAX_RECEIVED)) {
  throw new ValidationError('お預かりの金額が正しくありません')
}
```

記号が多くて読みにくそうですが、1つずつ分ければ難しくありません。この回が終わると、この4行が日本語に訳せるようになります。

---

## 1. `if` と比べる演算子

```ts
if (stock < 0) {
  console.log('マイナス')
} else if (stock === 0) {
  console.log('在庫なし')
} else {
  console.log('在庫あり')
}
```

| | TypeScript | Python |
|---|---|---|
| 条件 | `if (条件) { ... }` | `if 条件:` |
| その他の条件 | `else if` | `elif` |
| 等しい | `===` | `==` |
| 等しくない | `!==` | `!=` |

- 条件は `( )` で囲み、中身は `{ }` で囲みます。インデントは見た目だけで、意味はありません
- 中身が1行なら `{ }` を省略できます。tyoubo ではよく使われています

```ts
if (input.lines.length === 0) throw new ValidationError('カートに商品がありません')
```

**`==` ではなく `===` を使います。** `==` は型が違っても無理やり合わせて比べる(`0 == ''` が `true` になる)ので、思わぬ結果になります。tyoubo では `===` と `!==` だけを使っています。

## 2. `&&`(かつ)・`||`(または)・`!`(否定)

| TypeScript | Python | 意味 |
|---|---|---|
| `a && b` | `a and b` | a かつ b |
| `a \|\| b` | `a or b` | a または b |
| `!a` | `not a` | a ではない |

```ts
// sales.ts の createSale:数量が「整数ではない」または「1より小さい」ならエラー
if (!Number.isSafeInteger(line.qty) || line.qty < 1) throw new ValidationError('数量が正しくありません')
```

`Number.isSafeInteger(x)` は「x がちゃんとした整数か」を調べる関数です。その前に `!` が付いているので「整数ではない」になります。

> **読むときのコツ:** `!` と `||` が並んだ条件は、「**ダメな場合**を並べている」ことが多いです。「〜ではない、または〜より小さい … ならエラー」と読みます。

Python と同じく、`&&` は左が偽なら右を見ません。`||` は左が真なら右を見ません。

## 3. truthy と falsy

`if` の条件には `true` / `false` 以外も書けます。そのとき、**偽として扱われる値(falsy)**は次の6つだけです。

```
false   0   ''(空文字)   null   undefined   NaN
```

それ以外は全部、真として扱われます(truthy)。

```ts
// catalog.ts の saveProduct:id があれば「編集」、なければ「新規追加」
if (id) {
  // 編集
} else {
  // 新規追加
}
```

`id?: string` は省略できる引数なので、省略されると `undefined`(falsy)です。

**Python との違いに注意:** Python では空のリスト `[]` は偽ですが、**JavaScript では `[]` も `{}` も truthy** です。空の配列を調べたいときは `if (list.length === 0)` と書きます。

## 4. 三項演算子 `条件 ? A : B`

「条件が真なら A、偽なら B」という**値**を作ります。Python の `A if 条件 else B` です。順番が違うので注意してください。

```ts
// lib/labels.ts の sizeLabel:サイズが F なら「フリー」、それ以外はそのまま
return size === 'F' ? 'フリー' : size
```

```python
# Python なら
return 'フリー' if size == 'F' else size
```

**つなげることもできます。** `lib/closing.ts` の `differenceOf` です。

```ts
status: difference === 0 ? 'even' : difference > 0 ? 'over' : 'short'
```

左から読みます。「0 なら `'even'`(ぴったり)、そうでなくてプラスなら `'over'`(多い)、それ以外は `'short'`(足りない)」。`if` / `else if` / `else` と同じ形です。

## 5. `??`:なければこれ

```ts
// lib/payment.ts の paymentMethodOf
return record.paymentMethod ?? 'cash'
```

`A ?? B` は「**A が `null` か `undefined` なら B、それ以外は A**」です。古いデータには支払い方法がないので、そのときは現金(`'cash'`)として扱う、という意味です。

### `||` との違い(とても大事)

`||` も「なければこれ」に使えますが、**falsy なら何でも**右側に置き換えてしまいます。

```ts
0 ?? 100     // 0   (0 は null でも undefined でもないので、そのまま)
0 || 100     // 100 (0 は falsy なので、置き換わる)
'' ?? '未設定' // ''
'' || '未設定' // '未設定'
```

金額や在庫数では `0` がちゃんとした値です。`在庫 || 10` と書くと、在庫が 0 のときに 10 になってしまいます。

> **レビューで効くポイント:** 数値に `||` で初期値を付けているコードを見たら、「**0 のときに困らないか**」を確認します。たいていは `??` にするべきです。

## 6. `?.`:あれば中を見る

```ts
// catalog.ts の loadCatalog:カテゴリーが見つかれば名前、なければ ''
categoryName: categoryById.get(p.categoryId)?.name ?? '',
```

`A?.name` は「**A が `null` か `undefined` なら、エラーにせず `undefined`。そうでなければ `A.name`**」です。

第4回の `find` を思い出してください。`find` は見つからないと `undefined` を返します。`undefined.name` はエラーで止まってしまいますが、`?.name` ならエラーになりません。

```ts
const found = categories.find((c) => c.id === id)
found.name    // ❌ 型エラー(found は undefined かもしれない)
found?.name   // ✅ 見つからなければ undefined
found?.name ?? '' // ✅ 見つからなければ ''
```

**`?.` と `??` はよくセットで使われます。** 「あれば中を見て、なければこれ」と読みます。

## 7. `!` と `?.` の組み合わせ

```ts
// catalog.ts の saveProduct(編集のとき)
const existing = await db.products.get(id)
if (!existing?.isActive) throw new ValidationError('この商品は削除されています')
```

`existing?.isActive` は次のどれかになります。

| `existing` | `existing?.isActive` | `!existing?.isActive` |
|---|---|---|
| 見つからない(`undefined`) | `undefined` | `true` → エラー |
| 削除済み | `false` | `true` → エラー |
| ある | `true` | `false` → 先へ進む |

つまり「**見つからない、または削除済みならエラー**」を1行で書いています。

**おまけ:** `x!`(後ろに `!`)という別の書き方もあります。「`undefined` ではないと私が保証する」と TypeScript に伝えて、型チェックを黙らせるものです。tyoubo では `main.tsx` の `document.getElementById('root')!` の1か所だけです(画面の土台になる要素は必ずあるため)。

> **レビューで効くポイント:** 差分に `x!.name` のような**後ろの `!`** が出てきたら、本当に `undefined` にならないかを確認します。なったときは実行時エラーで止まります。

---

## やってみる

```bash
node lessons/05-conditions/examples.ts
```

→ [quiz.md](quiz.md) → [exercise.ts](exercise.ts)(採点:`npm run check 05`)

## tyoubo を読む

[../../../tyoubo/src/lib/closing.ts](../../../tyoubo/src/lib/closing.ts) を開いて答えてください。

1. `differenceOf(30000, 31000)` の結果は何ですか?(`difference` と `status`)
2. `countedTotal` の中の `counts[d.key] ?? 0` は、どんなときに `0` になりますか?

[../../../tyoubo/src/db/sales.ts](../../../tyoubo/src/db/sales.ts) の `createSale` を開いてください。最初の十数行(`db.transaction` の前まで)が入力チェックです。

3. `input.paymentMethod ?? 'cash'` は、どんな場合に `'cash'` になりますか?
4. 「お預かりの金額が正しくありません」のエラーになるのは、どんなときですか?日本語で説明してください。カード払いのときはどうなりますか?
5. `db.transaction` の中の `if (!variant?.isActive || !product?.isActive)` は、どんなときにエラーにしていますか?

<details>
<summary>答え</summary>

1. `difference` は `30000 - 31000` で `-1000`。0 でもプラスでもないので `status` は `'short'`(現金が1000円足りない)。
2. その金種の枚数が入っていない(`undefined` の)とき。たとえば 2千円札を入力していなければ、0枚として計算する。
3. `input.paymentMethod` が `undefined`(または `null`)のとき。つまり、支払い方法が指定されていないとき。
4. 現金払いで、かつ「お預かりが整数ではない」「0より小さい」「上限(`MAX_RECEIVED`)より大きい」のどれか1つでも当てはまるとき。カード払いのときは `isCash` が `false` なので、`&&` の右側は見ずに、このチェックは飛ばされる(お預かりの金額は関係ないため)。
5. バリエーション(サイズ × 色)が見つからないか削除済みのとき、または商品が見つからないか削除済みのとき。削除された商品は売れないようにしている。

</details>
