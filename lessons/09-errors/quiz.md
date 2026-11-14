# 第9回 クイズ

## 問1 表示されるものは?(順番に)

```ts
function check(qty: number): void {
  console.log('A')
  if (qty < 1) throw new Error('数量が正しくありません')
  console.log('B')
}

try {
  check(0)
  console.log('C')
} catch (e) {
  console.log('D')
}
console.log('E')
```

<details><summary>答え</summary>

`A` → `D` → `E`。

`check(0)` の中で `throw` した時点で、`check` は止まる(`B` は出ない)。呼び出した側の `try` の中も止まり(`C` は出ない)、`catch` に飛ぶ。`catch` で受け止めたので、そのあとの `E` は普通に実行される。

</details>

## 問2 `finally` があるとき、表示されるものは?

```ts
function save(ok: boolean): void {
  try {
    if (!ok) throw new Error('失敗')
    console.log('保存しました')
  } catch (e) {
    console.log('エラー')
  } finally {
    console.log('保存中を終わる')
  }
}

save(true)
save(false)
```

<details><summary>答え</summary>

```
保存しました
保存中を終わる
エラー
保存中を終わる
```

`finally` は、成功しても失敗しても必ず実行される。

</details>

## 問3 `userMessage` は何を返す?

```ts
class ValidationError extends Error {
  name = 'ValidationError'
}

function userMessage(error: unknown): string {
  if (error instanceof ValidationError) return error.message
  return '保存できませんでした。もう一度お試しください。'
}

userMessage(new ValidationError('在庫が足りません'))  // ①
userMessage(new Error('在庫が足りません'))            // ②
userMessage(new RangeError('金額がおかしい'))         // ③
```

<details><summary>答え</summary>

① `'在庫が足りません'`
② `'保存できませんでした。もう一度お試しください。'`
③ `'保存できませんでした。もう一度お試しください。'`

②は文が同じでも、`ValidationError` ではなく普通の `Error` なので、決まった文になる。**文の中身ではなく、エラーの種類で見分けている。**

</details>

## 問4 次のうち、TypeScript が型エラーにするのはどれ?

```ts
try {
  createSale(...)
} catch (e) {
  console.log(e.message)                                // A
  if (e instanceof Error) console.log(e.message)        // B
}
```

<details><summary>答え</summary>

A。

`catch (e)` の `e` は `unknown`(何が入っているかわからない)なので、いきなり `.message` は使えない。B は `instanceof Error` で調べたあとなので、`e` が `Error` に絞り込まれていて `.message` が使える。

</details>

## 問5 tyoubo の `db/backup.ts` の `parseBackup` の最初の部分です。何をしていますか?

```ts
let data: unknown
try {
  data = JSON.parse(text)
} catch {
  throw new ValidationError('このファイルは読み込めません。レジ帳簿のバックアップファイルを選んでください。')
}
```

(`JSON.parse` は、文字列を読んでオブジェクトにする関数です。JSON の形になっていないとエラーを投げます)

<details><summary>答え</summary>

バックアップファイルの中身(`text`)を読んでオブジェクトにしている。読めなかった(JSON の形でなかった)ときは、`JSON.parse` が投げた英語のエラーを受け止めて、**お店の人に読める `ValidationError` に投げ直している**。

`catch` のあとに `(e)` がないのは、元のエラーの中身を使わないから。

</details>

## 問6(レビュー目線)商品を保存する関数に、次の変更がありました。気になる点は?

```ts
async function handleSave() {
  setSaving(true)
  try {
    if (name.trim() === '') throw new Error('商品名を入力してください')
    await saveProduct(db, input)
    setSaving(false)
    onSaved()
  } catch (e) {
    setError(userMessage(e))
  }
}
```

<details><summary>答え</summary>

気になる点は2つ。

1. **`throw new Error(...)` で投げている。** `userMessage` は `ValidationError` 以外を「保存できませんでした。もう一度お試しください。」にしてしまうので、「商品名を入力してください」が画面に出ない。お店の人は、何度試しても理由がわからない。`throw new ValidationError(...)` にするべき。
2. **`setSaving(false)` が `try` の中にある。** エラーになるとこの行が飛ばされ、「保存中」のままボタンが押せなくなる。`finally` に移すべき。

tyoubo の `ProductForm.tsx` の `handleSave` は、`try` / `catch` / `finally` の形で、`finally` で `setSaving(false)` している。

</details>
