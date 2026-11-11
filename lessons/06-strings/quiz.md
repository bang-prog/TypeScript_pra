# 第6回 クイズ

## 問1 表示されるものは?

```ts
const name = 'シャツ'
const qty = 2
console.log(`${name} × ${qty}`)
console.log('${name} × ${qty}')
```

<details><summary>答え</summary>

```
シャツ × 2
${name} × ${qty}
```

`${}` が使えるのは**バッククォート `` ` ``** のときだけ。シングルクォートでは、そのままの文字として表示される。

</details>

## 問2 表示されるものは?

```ts
console.log(String(5).padStart(3, '0'))
console.log(String(1234).padStart(3, '0'))
```

<details><summary>答え</summary>

`005` と `1234`。

`padStart` は「足りなければ前を埋める」だけで、長すぎるものを切ったりはしない。tyoubo の会計番号は `NNN`(3桁)なので、1日に1000件を超えると `20261108-1000` のように4桁になる。

</details>

## 問3 Python との違い。表示されるものは?

```ts
console.log('S-M-L'.replace('-', '/'))
console.log('S-M-L'.replaceAll('-', '/'))
```

<details><summary>答え</summary>

`S/M-L` と `S/M/L`。

JavaScript の `replace` は**最初の1つだけ**。Python の `replace` は全部置き換えるので、Python に慣れていると間違えやすい。

</details>

## 問4 `colors` に入るものは?

```ts
const colors = '白, 黒,,  紺 '.split(',').map((s) => s.trim()).filter(Boolean)
```

<details><summary>答え</summary>

`['白', '黒', '紺']`。

`split(',')` で `['白', ' 黒', '', '  紺 ']`、`trim` で `['白', '黒', '', '紺']`、`filter(Boolean)` で空文字 `''`(falsy)が消える。

</details>

## 問5 tyoubo の `lib/time.ts` の `nowIso` の一部です。2026年3月5日 9時7分のとき、この部分は何になりますか?

```ts
`${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}` +
`T${pad2(date.getHours())}:${pad2(date.getMinutes())}`
```

(`getMonth()` は 3月なら `2` を返します。`pad2` は2桁にする関数です)

<details><summary>答え</summary>

`'2026-03-05T09:07'`。

`getMonth()` は 0 から数えるので `+ 1` して `3`、`pad2` で `'03'`。2つの文字列を `+` でつないでいる。長くなるので2行に分けて書いているだけ。

</details>

## 問6(レビュー目線)「商品名の前後の空白を取り除いてから保存する」という変更です。気になる点は?

```ts
/** 商品名をきれいにする。空なら保存しない */
function cleanProductName(value: string): string | null {
  if (value === '') return null
  return value.trim()
}
```

<details><summary>答え</summary>

**空白だけの入力(`'   '`)が、空として扱われない。** `'   '` は `''` ではないので `null` を返さず、`trim()` した結果の `''` が返る。つまり**名前が空の商品が保存されてしまう**。

先に `trim` してから空かどうかを調べるべき。

```ts
const name = value.trim()
if (name === '') return null
return name
```

tyoubo の `catalog.ts` の `cleanName` も、この順番(先に `trim`、そのあと `!name` を確かめる)になっている。**「空」を調べる前に `trim` しているか**は、入力チェックのレビューで見るポイント。

</details>
