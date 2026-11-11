# 第6回 文字列

**この回のゴール:** `db/sales.ts` の `nextSaleNo`(会計番号を作る関数)と、`components/products/ProductForm.tsx` の `splitList`(「S, M, L」のような入力を配列にする関数)を読んで、何をしているかがわかる。

```ts
/** 会計番号 YYYYMMDD-NNN の NNN を、その営業日の最大 + 1 にする */
async function nextSaleNo(db: AppDB, businessDate: string): Promise<string> {
  const prefix = businessDate.replaceAll('-', '')
  const sales = await db.sales.where('businessDate').equals(businessDate).toArray()
  const max = sales.reduce((m, s) => Math.max(m, Number(s.saleNo.split('-')[1]) || 0), 0)
  return `${prefix}-${String(max + 1).padStart(3, '0')}`
}
```

`await` や `db.sales.where(...)` は第11回・第20回でやります。今回は**文字列を加工している部分**(`replaceAll`・`split`・`padStart`・`` `${}` ``)を読めるようにします。

---

## 1. テンプレート文字列 `` `${}` ``

```ts
const color = '白'
const size = 'M'
console.log(`${color} / ${size}`)   // 白 / M
```

**バッククォート `` ` ``** で囲むと、`${ }` の中に変数や式を埋め込めます。Python の f文字列 `f"{color} / {size}"` と同じです。

```ts
// catalog.ts の cleanName:エラーメッセージに項目名を埋め込む
throw new ValidationError(`${label}を入力してください`)   // 「商品名を入力してください」など
```

`${ }` の中には計算も書けます。

```ts
// lib/time.ts の formatBusinessDate:月は 0 から数えるので + 1 する
`${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
```

| 記号 | 名前 | `${}` が使えるか |
|---|---|---|
| `'...'` | シングルクォート | 使えない(そのまま `${` と表示される) |
| `"..."` | ダブルクォート | 使えない |
| `` `...` `` | バッククォート | **使える** |

> **読むときのコツ:** `` ` `` で始まる文字列を見たら、`${ }` の中だけを拾って読む。そこが「変わる部分」です。

バッククォートは、日本語キーボードでは `Shift + @` で打てます。

## 2. 文字列と数値の変換:`String()` と `Number()`

```ts
String(7)        // '7'
Number('7')      // 7
Number('12a')    // NaN(数字として読めない)
Number('')       // 0  ← 注意
```

Python の `str(7)`・`int('7')` に当たります。Python と違い、`Number('12a')` はエラーにならず **`NaN`**(Not a Number:数ではない)という値になります。`NaN` は falsy でした(第5回)。

```ts
// nextSaleNo:'20261108-007' の '007' を数字にする。読めなければ 0
Number(s.saleNo.split('-')[1]) || 0
```

`|| 0` は「`NaN` なら 0」のために付いています(ここでは `0` が `0` になっても困らないので `||` で問題ありません)。

## 3. `padStart`:前を埋めて桁をそろえる

```ts
String(7).padStart(3, '0')     // '007'
String(123).padStart(3, '0')   // '123'(もう3文字あるので何もしない)
```

「**全体が3文字になるまで、前に `'0'` を足す**」です。Python の `'7'.zfill(3)` や `'7'.rjust(3, '0')` です。

```ts
// lib/time.ts:月や日を2桁にする。3 → '03'
const pad2 = (n: number) => String(n).padStart(2, '0')
```

`padStart` は文字列のメソッドなので、数値は先に `String()` で文字列にしています。

## 4. `trim`:前後の空白を取る

```ts
'  シャツ  '.trim()   // 'シャツ'
```

Python の `strip()` です。**真ん中の空白は消えません**(`'白 T'` は `'白 T'` のまま)。

```ts
// catalog.ts の cleanName:前後の空白を取って、空なら「入力してください」
const name = value.trim()
if (!name) throw new ValidationError(`${label}を入力してください`)
```

`'   '`(空白だけ)を入力されると、`trim` で `''` になり、`!name` が `true` になります。**空白だけの名前を登録できないようにする**ためのチェックです。

## 5. `split` と `join`:分ける・つなげる

```ts
'2026-11-08'.split('-')         // ['2026', '11', '08']
['2026', '11', '08'].join('/')  // '2026/11/08'
```

Python の `split` と同じです。`join` は Python と向きが逆(Python は `'/'.join(list)`、TypeScript は `list.join('/')`)なので注意してください(第4回でも出ました)。

```ts
// nextSaleNo:'20261108-007' を '-' で分けて、2つ目(番号 1)を取り出す → '007'
s.saleNo.split('-')[1]
```

## 6. `replaceAll`:全部置き換える

```ts
'2026-11-08'.replaceAll('-', '')   // '20261108'
'2026-11-08'.replace('-', '')      // '202611-08'  ← 最初の1つだけ!
```

**ここは Python と違うので要注意です。** Python の `replace` は全部置き換えますが、JavaScript の `replace` は**最初の1つだけ**です。全部置き換えたいときは `replaceAll` を使います。

> **レビューで効くポイント:** 差分に `.replace(` が出てきたら、「置き換えたいものが2つ以上あることはないか」を確認します。`replace` と `replaceAll` を取り違えても型は合っているので、TypeScript は何も言いません。テストに「2つ以上ある場合」があるかも見ます。

## 7. `slice`:一部を切り出す

```ts
const iso = '2026-11-06T14:05:09+09:00'
iso.slice(0, 10)    // '2026-11-06'
iso.slice(11, 16)   // '14:05'
```

Python の `iso[11:16]` と同じです。**始まりは含み、終わりは含まない**のも同じです。

```ts
// lib/time.ts の timeOf:日時から時刻だけを取り出す
return iso.slice(11, 16)
```

`slice` は配列にも使えます(`[1, 2, 3].slice(0, 2)` → `[1, 2]`)。

## 8. 正規表現をちょっとだけ

`/ /` で囲まれたものは**正規表現**(文字のパターン)です。Python の `re` モジュールと同じものです。tyoubo では、出てくる数は多くありません。**書けなくてよいので、よく出る記号の意味だけ**覚えてください。

| 記号 | 意味 |
|---|---|
| `^` / `$` | 先頭 / 末尾 |
| `\d` | 数字1文字 |
| `{4}` | 直前のものがちょうど4回 |
| `+` | 直前のものが1回以上 |
| `?` | 直前のものがあってもなくてもよい |
| `[,、]` | `[ ]` の中のどれか1文字(ここでは半角カンマか読点) |

```ts
// lib/time.ts の isBusinessDate:'2026-11-08' の形か
/^\d{4}-\d{2}-\d{2}$/.test(value)
// 先頭から「数字4つ - 数字2つ - 数字2つ」で終わり

// ProductForm.tsx の toInt:整数の形か(マイナスがあってもよい)
/^-?\d+$/.test(text)
// 先頭に - があってもなくてもよく、そのあと数字が1つ以上で終わり
```

`正規表現.test(文字列)` は、当てはまれば `true` を返します。

> **読むときのコツ:** 正規表現は、たいてい**関数名やコメントに意味が書いてあります**。まずそちらを読んで、「本当にそうなっているか」を記号の表で確かめます。

## 9. まとめて読む:`splitList`

```ts
function splitList(text: string): string[] {
  return [...new Set(text.split(/[,、]/).map((s) => s.trim()).filter(Boolean))]
}
```

`'S, M、 L,,'` を入れたつもりで、内側から順に読みます。

1. `text.split(/[,、]/)` … カンマか読点で分ける → `['S', ' M', ' L', '', '']`
2. `.map((s) => s.trim())` … それぞれの前後の空白を取る → `['S', 'M', 'L', '', '']`
3. `.filter(Boolean)` … truthy なものだけ残す。`''` は falsy なので消える → `['S', 'M', 'L']`
4. `[...new Set(...)]` … 重複を消す(第10回でやります)

`filter(Boolean)` は「**空文字などの falsy を取り除く**」決まり文句です。`filter((s) => Boolean(s))` と同じ意味です。

---

## やってみる

```bash
node lessons/06-strings/examples.ts
```

→ [quiz.md](quiz.md) → [exercise.ts](exercise.ts)(採点:`npm run check 06`)

## tyoubo を読む

[../../../tyoubo/src/db/sales.ts](../../../tyoubo/src/db/sales.ts) の `nextSaleNo` を開いて答えてください。

1. `businessDate` が `'2026-11-08'` のとき、`prefix` は何になりますか?
2. その日の会計が `'20261108-001'` と `'20261108-002'` の2件あるとき、`max` は何になりますか?
3. 2のとき、この関数が返す会計番号は何ですか?その日の最初の会計(まだ1件もない)ならどうなりますか?

[../../../tyoubo/src/lib/time.ts](../../../tyoubo/src/lib/time.ts) を開いてください。

4. `formatDateTime('2026-11-08T21:05:09+09:00')` は、`iso.slice(0, 10)` と `timeOf(iso)` で何を取り出していますか?
5. `isBusinessDate('2026-1-8')` は `true` と `false` のどちらですか?正規表現の部分だけで考えてください。

<details>
<summary>答え</summary>

1. `'20261108'`(`-` を全部取り除く)。
2. `2`。それぞれ `split('-')[1]` で `'001'` と `'002'` を取り出し、`Number` で `1` と `2` にして、大きいほうを残していく(`Math.max` は大きいほうを返す関数)。
3. `'20261108-003'`。`max + 1` は `3`、`padStart(3, '0')` で `'003'`、テンプレート文字列で `prefix` とつなげる。1件もないときは `reduce` の最初の値 `0` がそのまま `max` になるので、`'20261108-001'`。
4. `slice(0, 10)` で日付の `'2026-11-08'`、`timeOf` の中の `slice(11, 16)` で時刻の `'21:05'`。結果は `'2026年11月8日(日) 21:05'`。
5. `false`。`\d{2}` は「数字ちょうど2つ」なので、`1` や `8` の1桁では当てはまらない。tyoubo の営業日は必ず `'2026-01-08'` のように2桁で保存している(`pad2` を使っているのはそのため)。

</details>
