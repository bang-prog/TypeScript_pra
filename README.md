# TypeScript 学習帳

**目標:帳簿アプリ([../tyoubo](../tyoubo))のコードを読んで、Claude Code が書いたコードをレビューできるようになる。**

基礎の構文 → React → tyoubo を読む → レビューの練習、の順に進みます。全体の流れは [curriculum.md](curriculum.md)。

## 始め方

このフォルダで Claude Code を開いて、こう言ってください:

> 次のレッスン

Claude が [progress.md](progress.md) を見て、続きから案内します。教材がまだない回は、その時点の tyoubo のコードを見ながら Claude が作ります。

### Claude への話しかけ方の例

| 言うこと | Claude がすること |
|---|---|
| 次のレッスン / 続きから | 次の回を案内する |
| 答え合わせして | 演習を採点して講評する。進捗を記録する |
| ヒント | 答えを言わずに段階的にヒントを出す |
| クイズ出して | 1問ずつ出題する |
| tyoubo の `src/lib/cart.ts` の `cartReducer` を解説して | 習った回と結び付けて説明する |
| 復習 | 苦手なところから出題する |
| レビュー練習 | tyoubo の実際のコミットでレビューの練習(第22回〜) |

## 1回の進め方(30〜60分)

1. `lessons/NN-…/README.md`(解説)を読む
2. サンプルを動かす:`node lessons/01-variables-and-types/examples.ts`
3. `quiz.md` を解く(答えは折りたたみの中)
4. `exercise.ts` を書き換えて採点:`npm run check 01`
5. 解説の最後の「tyoubo を読む」をやる
6. Claude に「答え合わせして」

## フォルダの中身

```
README.md          この説明
CLAUDE.md          Claude 向けの指示(家庭教師としての振る舞い)
curriculum.md      全22回+αの内容
progress.md        進み具合と苦手メモ
glossary.md        用語集
lessons/           各回の教材(今は第1〜3回。続きは進むたびに作る)
templates/         教材のひな形
scripts/check.ts   採点スクリプト
```

## コマンド

```bash
npm install          # 最初に1回(済み)
npm run check 01     # 第1回の演習を採点(テスト+型チェック)
npm test             # ファイルを保存するたびに全部のテストを実行し直す
npm run save         # 今日の学習をコミット(GitHub にも送る)
npm run save -- "第2回 関数"   # メモ付きでコミット
```

Claude に「今日の分をコミットして」と頼んでも同じことをします。

過去の学習を見返すとき:

```bash
git log --oneline               # いつ何をしたかの一覧
git show <コミットの番号>        # その日に変えた中身
```

## VS Code で読むときに便利な操作

| 操作 | キー |
|---|---|
| 型や説明を見る | 変数・関数にマウスを乗せる |
| 定義へ移動 | F12(または Ctrl+クリック) |
| 使っている場所を全部見る | Shift+Alt+F12 |
| 前の場所に戻る | Alt+← |
