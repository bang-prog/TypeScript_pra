# 教材のひな形(Claude が新しい回を作るとき用)

フォルダ:`lessons/NN-英語の短い名前/`(例:`04-arrays`)

## README.md(解説)

```
# 第N回 テーマ

**この回のゴール:** tyoubo の ○○ を読んで、△△ がわかる。

(ゴールになる tyoubo の実際のコードを数行引用)

---

## 1. 〜 / ## 2. 〜 …
  - 1節に1つの考え方。短いコード例 → 説明
  - Python と比べられるところは表か並べたコードで比べる
  - tyoubo での実例を、ファイル名と関数名で示す
  - 「> **読むときのコツ:**」「> **レビューで効くポイント:**」を適宜

---

## やってみる
  node lessons/NN-…/examples.ts
  → quiz.md → exercise.ts(採点:npm run check NN)

## tyoubo を読む
  ../../../tyoubo/src/... へのリンクと、3〜5問の読解問題
  <details><summary>答え</summary> … </details>
```

## examples.ts

- 先頭に `// 第N回のサンプル。実行:node lessons/NN-…/examples.ts`
- `// ---------- 見出し ----------` で区切り、`console.log` で結果を見せる
- `node` で実行できる書き方だけ(`enum` や `namespace` は使わない)

## quiz.md

- 6問前後。答えは `<details><summary>答え</summary>` に入れる
- 種類を混ぜる:「表示されるものは?」「エラーになるのはどれ?」「日本語で説明して」「tyoubo のこのコードの意味は?」
- **最後の問題は必ず「(レビュー目線)」**:もっともらしいが間違っている(仕様違い・境界値・型の穴など)コードを見せて、気になる点を問う

## exercise.ts / exercise.test.ts

- 6問前後。`// TODO` の部分を書く形。未回答でも `node` で読み込めるように仮の値を返しておく
- テストは vitest。書き方を指定したいときは `readFileSync` でソースを読んで `toMatch` で確かめる(第01回参照)
- 作ったら、未回答で落ちること・正解で `npm run check NN` が合格することを確かめる
