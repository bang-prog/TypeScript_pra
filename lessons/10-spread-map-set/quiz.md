# 第10回 クイズ

## 問1 表示されるものは?

```ts
const sizes = ['S', 'M']
const a = [...sizes, 'L']
sizes.push('XL')
console.log(a)
console.log(sizes)
```

<details><summary>答え</summary>

```
[ 'S', 'M', 'L' ]
[ 'S', 'M', 'XL' ]
```

`[...sizes, 'L']` は新しい配列を作るので、`sizes` は変わらない。`push` は元の `sizes` に足すので、`sizes` が変わる。`a` はその前に作ったコピーなので、`XL` は入らない。

</details>

## 問2 `next` の中身は?

```ts
const line = { variantId: 'v1', qty: 2, price: 980 }
const next = { ...line, qty: line.qty + 1 }
```

<details><summary>答え</summary>

`{ variantId: 'v1', qty: 3, price: 980 }`。

全部の項目を写して、`qty` だけ後ろの値(`2 + 1`)で上書きしている。`line` は変わらない。

</details>

## 問3 表示されるものは?

```ts
const stock = new Map<string, number>()
stock.set('M', 3)
stock.set('M', 5)
console.log(stock.get('M'), stock.get('L'), stock.get('L') ?? 0, stock.size)
```

<details><summary>答え</summary>

`5 undefined 0 1`。

同じキーで `set` すると上書きになる(Python の dict と同じ)。ないキーを `get` すると `undefined`(エラーにはならない)。キーは `'M'` の1つだけなので `size` は 1。

</details>

## 問4 `colors` の中身は?

```ts
const variants = [
  { size: 'S', color: '白' },
  { size: 'M', color: '白' },
  { size: 'S', color: '黒' },
]
const colors = [...new Set(variants.map((v) => v.color))]
```

<details><summary>答え</summary>

`['白', '黒']`。

`map` で `['白', '白', '黒']`、`new Set` で重複が消え、`[... ]` で配列に戻る。順番は最初に出てきた順。

</details>

## 問5 tyoubo の `lib/time.ts` の `parseBusinessDate` です。`'2026-03-05'` を渡すと、`y`・`m`・`d` には何が入りますか?

```ts
function parseBusinessDate(businessDate: string): Date {
  const [y, m, d] = businessDate.split('-').map(Number)
  return new Date(y, m - 1, d)
}
```

<details><summary>答え</summary>

`y = 2026`、`m = 3`、`d = 5`(どれも数値)。

`split('-')` で `['2026', '03', '05']`、`map(Number)` で `[2026, 3, 5]`、配列の分割代入で順番に取り出す。`map(Number)` は `map((s) => Number(s))` と同じ意味。

`new Date(y, m - 1, d)` で `- 1` しているのは、JavaScript の月が 0 から数えるから(第6回)。

</details>

## 問6(レビュー目線)カートの数量を1つ増やす関数です。テストは通っていますが、気になる点は?

```ts
/** 同じ商品の数量を1増やした、新しいカートを返す */
export function increment(lines: CartLine[], variantId: string): CartLine[] {
  return lines.map((l) => {
    if (l.variantId === variantId) l.qty += 1
    return l
  })
}
```

<details><summary>答え</summary>

**元のカートの行(`l`)を、直接書き換えている。** `map` で新しい配列は作っているが、中の行は元と同じもの。`l.qty += 1` で、**元のカートの数量まで変わってしまう**。

コメントには「新しいカートを返す」とあるので、`{ ...l, qty: l.qty + 1 }` で新しい行を作るべき。

React では、元の状態を書き換えると画面が正しく更新されないことがある。テストで「結果」だけを見ていると気づかないので、**元のものが変わっていないか**もレビューで見る。

</details>
