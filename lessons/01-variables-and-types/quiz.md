# 第1回 クイズ

紙やメモに答えを書いてから、折りたたみを開いてください。

## 問1 表示されるものは?

```ts
let total = 100
total = total + 50
const tax = 10
console.log(total, tax)
```

<details><summary>答え</summary>

`150 10`

</details>

## 問2 エラーになるのはどれ?(複数可)

```ts
const a = 1
a = 2           // (ア)

let b = 'S'
b = 'M'         // (イ)

let c = 'S'
c = 5           // (ウ)
```

<details><summary>答え</summary>

**(ア)と(ウ)。**

- (ア):`const` は再代入できない。
- (イ):OK。`let` なので再代入できる。
- (ウ):`c` は `'S'` から `string` と推論されているので、数値は入れられない。**型推論でも型は決まる**のがポイント。Python なら動いてしまうところ。

</details>

## 問3 表示されるものは?

```ts
console.log(7 / 2)
console.log(Math.floor(7 / 2))
```

<details><summary>答え</summary>

`3.5` と `3`。

`number` は整数と小数の区別がないので、`7 / 2` は `3.5`。Python の `7 // 2` にあたるのが `Math.floor(7 / 2)`。tyoubo の `taxOf` も `Math.floor` で消費税の1円未満を切り捨てている。

</details>

## 問4 次の変数の型は?(VS Code でマウスを乗せたつもりで)

```ts
let price = 980
let label = '金額'
let ok = false
```

<details><summary>答え</summary>

`number`、`string`、`boolean`。

</details>

## 問5 tyoubo の `db/settings.ts` に次のような型があります。`lastBackupAt` には何が入りますか?

```ts
/** 最後にバックアップした日時 */
lastBackupAt: string | null
```

<details><summary>答え</summary>

日時を表す**文字列**か、**`null`**。`null` は「まだ一度もバックアップしていない」を表していると読める。`|` は「または」(第7回で詳しく)。

</details>

## 問6(レビュー目線)Claude Code が次のコードを書きました。気になる点は?

```ts
let MAX_RECEIVED = 9_999_999
```

<details><summary>答え</summary>

上限値なのに `let` になっていて、どこかで書き換えられるおそれがある。`const` にすべき。

「書き換えるつもりのない値が `let` になっている」は、レビューでよく指摘するポイント(ESLint の `prefer-const` というルールでも検出できる)。

</details>
