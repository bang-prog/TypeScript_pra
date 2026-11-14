# 第9回 エラー処理とクラス

**この回のゴール:** `db/errors.ts`(エラーの種類と、画面に出す文)と、`pages/RegisterPage.tsx` の `confirmSale`(会計を確定するときの処理)を読んで、**保存に失敗したときに何が起きるか**がわかる。

```ts
// db/errors.ts(ファイル全体)
export class ValidationError extends Error {
  name = 'ValidationError'
}

export function userMessage(error: unknown): string {
  if (error instanceof ValidationError) return error.message
  console.error(error)
  return '保存できませんでした。もう一度お試しください。'
}
```

レジのアプリでは、「失敗したときにどうなるか」がとても大事です。会計が保存できなかったのにカートが消えたら、お店の人は困ります。

---

## 1. `throw`:エラーを投げる

```ts
if (input.lines.length === 0) throw new ValidationError('カートに商品がありません')
```

Python の `raise ValueError('...')` と同じです。`throw` した時点で、**その関数はそこで止まり**、呼び出した側にエラーが伝わります。

| | TypeScript | Python |
|---|---|---|
| エラーを投げる | `throw new Error('...')` | `raise Exception('...')` |
| エラーの文 | `error.message` | `str(e)` |

`new` は「クラスから新しいものを作る」という意味です(4節)。

```ts
// lib/money.ts の assertYen:0以上の整数でなければエラー
export function assertYen(value: number, label = '金額'): void {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new RangeError(`${label}は0以上の整数(円)で指定してください: ${value}`)
  }
}
```

`RangeError` は、JavaScript に最初から用意されているエラーの1つです(「値の範囲がおかしい」という意味)。

## 2. `try` / `catch` / `finally`:エラーを受け止める

```ts
try {
  // エラーが起きるかもしれない処理
} catch (e) {
  // エラーが起きたときの処理。e に投げられたエラーが入る
} finally {
  // 成功しても失敗しても、最後に必ず行う処理
}
```

Python の `try` / `except` / `finally` と同じです。

tyoubo の `confirmSale` を、形だけ取り出すとこうなります(`await` は第11回、`setXxx` は第15回でやります)。

```ts
async function confirmSale(received: number) {
  if (saving) return       // 保存中なら何もしない(二重に保存しないため)
  setSaving(true)          // 「保存中」にする
  try {
    const sale = await createSale(db, { ... })  // 会計を保存する
    dispatch({ type: 'clear' })                 // カートを空にする
    setDone({ ... })                            // 「お釣り」の画面を出す
  } catch (e) {
    // 保存できなかったときはカートを消さず、電卓の画面にエラーを出す
    setPayError(userMessage(e))
  } finally {
    setSaving(false)       // 成功でも失敗でも、「保存中」を終わらせる
  }
}
```

**流れを2通り追ってみます。**

- **保存できたとき:** `try` の中を最後まで実行 → `catch` は飛ばす → `finally`
- **`createSale` がエラーを投げたとき:** `try` の中はそこで止まる(**カートを空にする行は実行されない**)→ `catch` → `finally`

エラーのときにカートが消えないのは、「カートを空にする」行が `createSale` より**後ろ**にあるからです。

> **読むときのコツ:** `try` の中は、**どの行でエラーが起きたら、そのあとの行が飛ばされるか**を考えながら読む。順番に意味があります。

`catch (e)` の `(e)` は省略することもあります(`db/backup.ts` の `parseBackup`)。エラーの中身を使わないときの書き方です。

## 3. `finally` は「後片付け」

`finally` には、成功しても失敗しても必ずやりたいことを書きます。tyoubo では、ほとんどが「**保存中の印を消す**」(`setSaving(false)`)です。

もし `finally` を使わずに、`try` の最後に `setSaving(false)` を書いたらどうなるでしょう。エラーが起きると、その行は飛ばされます。すると「保存中」のまま、**ボタンが二度と押せなくなります**。

> **レビューで効くポイント:** 「保存中」「読み込み中」の印を付けるコードを見たら、**エラーのときにも元に戻るか**を確認します。`finally` で戻しているか、`catch` でも戻しているかを見ます。

## 4. クラス:同じ形のものを作る型紙

Python のクラスとほぼ同じです。

```ts
class Counter {
  count = 0                  // 項目(Python の self.count = 0)

  add(): void {              // メソッド(Python の def add(self):)
    this.count += 1          // this は Python の self
  }
}

const c = new Counter()      // 作る(Python の Counter())
c.add()
console.log(c.count)         // 1
```

| | TypeScript | Python |
|---|---|---|
| 作る | `new Counter()` | `Counter()` |
| 自分自身 | `this` | `self` |
| 継承 | `class A extends B` | `class A(B):` |

**ただし、tyoubo でクラスを定義しているのは `ValidationError` の1つだけです。** tyoubo では、データはオブジェクトと `type`(第3回)、処理は関数で書いています。クラスは「見たら意味がわかる」程度で十分です。

## 5. `class ... extends Error`:自分用のエラーの種類を作る

```ts
export class ValidationError extends Error {
  name = 'ValidationError'
}
```

「`Error` を元にして、`ValidationError` という新しい種類のエラーを作る」という意味です。中身は、`name` を決めているだけです。Python の `class ValidationError(Exception): pass` と同じです。

```ts
throw new ValidationError('数量が正しくありません')
```

なぜ種類を分けるのでしょう。tyoubo では、エラーを2種類に分けて扱っています。

| 種類 | 例 | 画面に出すもの |
|---|---|---|
| `ValidationError` | 入力の間違い(数量が0、カートが空、など) | **エラーの文をそのまま**(お店の人に直してもらう) |
| それ以外 | プログラムのバグ、保存の失敗など | 「保存できませんでした。もう一度お試しください。」 |

## 6. `instanceof` と `unknown`:エラーの種類を見分ける

```ts
export function userMessage(error: unknown): string {
  if (error instanceof ValidationError) return error.message
  console.error(error)
  return '保存できませんでした。もう一度お試しください。'
}
```

- `error instanceof ValidationError` は「`error` は `ValidationError` か」を調べます。Python の `isinstance(error, ValidationError)` です。
- 引数の型は `unknown`(何が入っているかわからない)です(第7回)。JavaScript では、`throw` に何でも投げられるからです(`throw 'abc'` も書けてしまいます)。そのため `catch (e)` の `e` も `unknown` です。
- `instanceof` で調べたあとは、`error` が `ValidationError` に絞り込まれます(第7回)。なので `error.message` が使えます。

`ValidationError` 以外のときは、中身を `console.error` で記録して(開発者が調べるため)、画面には決まった文を出します。**利用者には、意味のわからない英語のエラーを見せない**ための工夫です。

> **レビューで効くポイント:** 新しい入力チェックを足した差分で、`throw new Error('価格を入力してください')` のように**普通の `Error`** を投げていたら要注意です。`ValidationError` ではないので、画面には「保存できませんでした」としか出ず、お店の人は何を直せばいいかわかりません。**利用者に見せたい文は `ValidationError` で投げているか**を確認します。

---

## やってみる

```bash
node lessons/09-errors/examples.ts
```

→ [quiz.md](quiz.md) → [exercise.ts](exercise.ts)(採点:`npm run check 09`)

## tyoubo を読む

[../../../tyoubo/src/pages/RegisterPage.tsx](../../../tyoubo/src/pages/RegisterPage.tsx) の `confirmSale` を開いて答えてください。画面のコード(第14回〜)なので知らない書き方も多いですが、`try` / `catch` / `finally` の形だけ追えれば大丈夫です。

1. `createSale` がエラーを投げたとき、カートは空になりますか?なぜですか?
2. エラーのとき、画面にはどこにエラーが出ますか?(コメントを読んでください)
3. `finally` の `setSaving(false)` は、成功したときと失敗したときのどちらで実行されますか?

[../../../tyoubo/src/db/sales.ts](../../../tyoubo/src/db/sales.ts) の `createSale` を開いてください。

4. `throw new ValidationError(...)` を探して、どんなときにエラーになるかを3つ挙げてください。
5. カートが空で会計しようとしたとき、お店の人の画面には何と表示されますか?`userMessage` を通ることを考えてください。

<details>
<summary>答え</summary>

1. ならない。`createSale` の行でエラーになると、`try` の中のそのあとの行(`dispatch({ type: 'clear' })` など)は実行されずに `catch` へ飛ぶから。
2. 電卓の画面(`PayDialog`)。コメントに「カートを消さず、電卓の画面にエラーを出す」とある。`setPayError` で、電卓の画面に渡すエラーの文を決めている。
3. 両方。`finally` は、成功しても失敗しても必ず実行される。
4. たとえば「カートに商品がありません」(カートが空)、「数量が正しくありません」(数量が整数でない・1より小さい)、「お預かりの金額が正しくありません」、「削除された商品がカートに入っています…」、「お預かりが足りません」など。
5. 「カートに商品がありません」。`ValidationError` なので、`userMessage` はエラーの文をそのまま返す。

</details>
