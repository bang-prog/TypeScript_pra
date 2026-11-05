# 第2回 関数

**この回のゴール:** `lib/time.ts` と、`lib/money.ts` の `taxOf` の1行目(関数の「顔」)を読んで、何を受け取り何を返すかがわかる。

```ts
export function taxOf(totalIncl: number, ratePercent = DEFAULT_TAX_RATE): number {
```

---

## 1. 関数の書き方

```ts
function lineTotal(unitPrice: number, qty: number): number {
  return unitPrice * qty
}
```

Python で書くとこうです:

```python
def line_total(unit_price: int, qty: int) -> int:
    return unit_price * qty
```

| 部分 | TypeScript | Python |
|---|---|---|
| 宣言 | `function` | `def` |
| 引数の型 | `qty: number` | `qty: int` |
| 戻り値の型 | `): number {` | `) -> int:` |
| 中身の範囲 | `{ }` で囲む | インデント |

- **インデントに意味はありません。** `{ }` が範囲を決めます(インデントは読みやすさのため)。
- **引数の型は必ず書きます**(書かないと strict モードでエラー)。
- **戻り値の型は省略できます**(推論される)。tyoubo では `export` する関数には書く、という方針のようです。

> **読むときのコツ:** 関数は1行目(シグネチャ)だけ読めば「何を受け取って何を返すか」がわかる。中身を読む前に、まず1行目と直前の `/** */` コメントを読む。

## 2. `void`:何も返さない

```ts
/** 0以上の整数(円)でなければエラーにする。 */
export function assertYen(value: number, label = '金額'): void {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new RangeError(`${label}は0以上の整数(円)で指定してください: ${value}`)
  }
}
```

`void` は「戻り値なし」。Python の `-> None` にあたります。この関数はチェックするだけで、ダメなら `throw`(Python の `raise`)でエラーを投げます。エラー処理は第9回で詳しくやります。

## 3. デフォルト引数

```ts
export function assertYen(value: number, label = '金額'): void
```

`label = '金額'` は「省略されたら `'金額'` を使う」。Python と同じです。デフォルト値から型が推論されるので、`label: string = '金額'` と書かなくても `string` になります。

```ts
assertYen(100)             // label は '金額'
assertYen(100, '単価')      // label は '単価'
```

`taxOf` の `ratePercent = DEFAULT_TAX_RATE` も同じで、税率を省略すると 10% になります。

## 4. アロー関数 `=>`

関数にはもう1つ書き方があります。**tyoubo で非常によく出てきます。**

```ts
// function で書く
function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

// アロー関数で書く(同じ意味)
const pad2 = (n: number): string => {
  return String(n).padStart(2, '0')
}

// 中身が1つの式なら { } と return を省略できる(同じ意味)
const pad2 = (n: number) => String(n).padStart(2, '0')
```

最後の形が `lib/time.ts` の1行目そのものです。Python の `lambda n: str(n).zfill(2)` に近いですが、アロー関数は `{ }` を使えば何行でも書けます。

**読み方:** `(引数) => 結果`。「引数を受け取って、結果を返す」。

```ts
() => setToast(null)        // 引数なし
(e) => setName(e.target.value)   // 引数1つ
(a, b) => a.sortOrder - b.sortOrder   // 引数2つ
```

> **注意:** `=>` の右が `{` で始まると「関数の中身」と解釈されます。オブジェクトを返したいときは `() => ({ ok: true })` と `( )` で囲みます。tyoubo の `CartProvider` に `useMemo(() => ({ lines, dispatch }), [lines])` という形で出てきます。

## 5. 関数を値として渡す

JavaScript では関数も値なので、変数に入れたり、他の関数の引数に渡したりできます(Python と同じ)。

```ts
setTimeout(() => console.log('1秒たった'), 1000)
```

`setTimeout` に「1秒後に実行してほしい関数」を渡しています。このように**渡される関数をコールバック**と呼びます。第4回の `map` や `filter` で大量に出てきます。

## 6. 関数の型

関数を引数で受け取るとき、その引数の型は「関数の型」になります。

```ts
onSaved: (id: string) => void
```

「`string` を1つ受け取って、何も返さない関数」という**型**です。値のアロー関数とそっくりですが、`=>` の右が型(`void`)になっています。tyoubo の画面のコードでは `onCancel: () => void`、`onPick: (product: ProductView) => void` のような形で大量に出てきます(第15回)。

---

## やってみる

```bash
node lessons/02-functions/examples.ts
```

→ [quiz.md](quiz.md) → [exercise.ts](exercise.ts)(採点:`npm run check 02`)

## tyoubo を読む

[../../../tyoubo/src/lib/time.ts](../../../tyoubo/src/lib/time.ts) と [../../../tyoubo/src/lib/labels.ts](../../../tyoubo/src/lib/labels.ts) を開いて答えてください。

1. `pad2` は何を受け取って何を返しますか?`pad2(5)` の結果は?
2. `pad2` は `export` されていません。なぜだと思いますか?
3. `businessDateOf(date = new Date())` の `= new Date()` は何を意味しますか?
4. `businessDateOf()` を引数なしで呼ぶと何が返りますか?引数で日付を渡せるようにしてあるのは何のためだと思いますか?(ヒント:`time.test.ts` を見てみる)
5. `sizeLabel('F')` と `sizeLabel('M')` の結果は?

<details>
<summary>答え</summary>

1. 数値を受け取り、2桁になるよう先頭を `'0'` で埋めた文字列を返す。`pad2(5)` は `'05'`。
2. このファイルの中で日時を組み立てるためだけの部品だから。外に見せないことで「使っている場所はこのファイルの中だけ」とわかり、変更しやすくなる。
3. 引数を省略したら「今の日時」を使う。
4. 今日の日付が `'2026-11-04'` のような形で返る。日付を渡せるのは**テストのため**。「今日」はテストを実行する日によって変わってしまうので、テストでは決まった日付を渡して結果を確かめている。
5. `'フリー'` と `'M'`。

</details>
