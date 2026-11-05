# 第1回 変数と基本の型

**この回のゴール:** `lib/money.ts` の先頭にある定数の行を読んで、意味がわかる。

```ts
/** 消費税率(%)。衣料品のため一律10%。 */
export const DEFAULT_TAX_RATE = 10
```

---

## 1. TypeScript とは

**TypeScript = JavaScript + 型。**

- ブラウザや Node.js が実際に動かすのは **JavaScript**。
- TypeScript は JavaScript に「この変数は数値」「この関数は文字列を返す」といった**型**を書き足した言語。
- 実行する前に型を取り除いて JavaScript として動かす。**型は実行前のチェックのためだけにある。**

Python で言うと、型ヒント(`def f(x: int) -> str:`)と mypy の組み合わせに近いです。違いは、TypeScript では型チェックが開発の流れに組み込まれていて、型が合わないと**ビルドが失敗する**こと(tyoubo の `npm run build` は最初に `tsc -b` で型チェックしています)。

> **レビューで効くポイント:** 型が合っていればコンパイラが多くの間違いを先に見つけてくれる。だからレビューでは「型では防げない間違い(計算の中身、仕様どおりか)」に集中できる。

## 2. 変数:`const` と `let`

```ts
const taxRate = 10     // 再代入できない
let count = 0          // 再代入できる
count = count + 1      // OK
// taxRate = 8         // エラー:const には再代入できない
```

| TypeScript | Python | 意味 |
|---|---|---|
| `const x = 1` | `X = 1`(慣習で大文字) | 再代入しない変数。**ほとんどこちら** |
| `let x = 1` | `x = 1` | 後で値を変える変数 |
| `var x = 1` | — | 古い書き方。今のコードでは使わない |

tyoubo のコードはほとんど `const` です。`let` が出てきたら「この変数は後で書き換わるんだな」と注意して読みます。

- 行末の `;` は書いても書かなくてもよい。tyoubo は書かないスタイル。
- 名前は `camelCase`(Python の `snake_case` ではない)。定数は `UPPER_SNAKE_CASE` のことも多い。

## 3. 基本の型

| 型 | 例 | Python との違い |
|---|---|---|
| `number` | `10`、`3.14`、`-1` | **整数と小数の区別がない**(Python の `int` と `float` が1つ) |
| `string` | `'abc'`、`"abc"` | `'` と `"` はどちらも同じ。tyoubo は `'` |
| `boolean` | `true`、`false` | **小文字**(Python は `True`) |
| `null` | `null` | 「値がない」。Python の `None` に近い |
| `undefined` | `undefined` | 「まだ決まっていない / 存在しない」。Python にはない |

`null` と `undefined` が2つあるのは JavaScript の歴史的な事情です。今は「どちらも『値がない』」と思っておけば十分です(第5回・第7回でもう一度出てきます)。

**数値の `_`:** `9_999_999` は `9999999` と同じ。読みやすくするための区切りです(Python と同じ)。

## 4. 型注釈と型推論

型は `変数名: 型` で書きます(Python の型ヒントと同じ位置)。

```ts
const price: number = 980
const name: string = 'シャツ'
const isActive: boolean = true
```

でも、**実際のコードではほとんど型を書きません。** 代入する値から TypeScript が型を推論するからです。

```ts
const price = 980        // number と推論される
const name = 'シャツ'     // string と推論される
```

VS Code で変数にマウスを乗せると、推論された型が表示されます。**コードを読むときは、これを多用してください。**

> **const の場合の細かい話:** `const price = 980` にマウスを乗せると、`number` ではなく `980` と表示されます。「再代入できないので、この値そのものが型」という意味です。第7回のリテラル型で詳しくやります。今は気にしなくて大丈夫です。

型を書くのは主に次のような場面です:
- 関数の引数(第2回)
- 最初は空で、後から値が入るもの(例:`const items: SaleItem[] = []`)
- 「この変数には null も入る」と伝えたいとき(例:`let x: string | null = null`)

## 5. コメント

```ts
// 1行コメント

/* 複数行の
   コメント */

/** ドキュメントコメント。直後の変数や関数の説明 */
export const DEFAULT_TAX_RATE = 10
```

`/** */` は特別で、VS Code で `DEFAULT_TAX_RATE` を使っている場所にマウスを乗せると、この説明が表示されます。tyoubo ではほぼすべての定数・型・関数に付いているので、**読むときの大きな助けになります。**

## 6. `export`

```ts
export const DEFAULT_TAX_RATE = 10
```

`export` は「この変数を他のファイルから使えるようにする」という意味です。付いていないものはそのファイルの中だけで使われます。詳しくは第8回。

## 7. 画面に出す:`console.log`

Python の `print` にあたります。

```ts
console.log('合計', 980)   // → 合計 980
```

---

## やってみる

```bash
node lessons/01-variables-and-types/examples.ts
```

Node.js 24 は `.ts` ファイルをそのまま実行できます(型を取り除いて動かす)。

次に [quiz.md](quiz.md) → [exercise.ts](exercise.ts) へ。

演習の採点:

```bash
npm run check 01
```

## tyoubo を読む

[../../../tyoubo/src/lib/money.ts](../../../tyoubo/src/lib/money.ts) の最初の10行ほどを開いて、答えてください。

1. `DEFAULT_TAX_RATE` と `MAX_RECEIVED` は、それぞれ何を表していますか?(コメントを読む)
2. `MAX_RECEIVED` の値はいくつですか?なぜ `_` が入っていますか?
3. この2つは `let` ではなく `const` です。それはなぜだと思いますか?
4. この2つは他のファイルから使えますか?

<details>
<summary>答え</summary>

1. `DEFAULT_TAX_RATE` は消費税率(10%)。`MAX_RECEIVED` は電卓で入力できる「お預かり金額」の上限。
2. 9,999,999(7桁)。`_` は読みやすくするための区切りで、値には影響しない。
3. 税率や上限はプログラムの途中で変わってはいけない値だから。うっかり書き換えると計算が全部狂う。
4. 使える。`export` が付いているから。実際に `lib/cashInput.ts` や `db/catalog.ts` が `MAX_RECEIVED` を使っている(VS Code で右クリック →「すべての参照を検索」で確かめられる)。

</details>

**VS Code の操作も練習:** `MAX_RECEIVED` の上で右クリック →「すべての参照を検索」(Shift+Alt+F12)。どのファイルで使われているか一覧が出ます。コードを読むときに一番よく使う機能です。
