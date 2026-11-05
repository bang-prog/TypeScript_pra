// 第1回 演習
// 「ここを書き換える」の部分を直して、テストを通してください。
// 採点:npm run check 01
//
// 迷ったら README.md を見直す。それでもわからなければ Claude に「ヒントちょうだい」と聞く。

// 問1:軽減税率 8% を表す定数 REDUCED_TAX_RATE を作る。
//      (値を 8 にするだけ。const になっていることも確認)
export const REDUCED_TAX_RATE = 8 // ← ここを書き換える

// 問2:1万円札の上限枚数 99,999 枚を、_ で区切って書く。
export const MAX_BILLS = 99_999 // ← ここを書き換える(_ を使うこと)

// 問3:商品名を表す定数 PRODUCT_NAME を作る。値は 'デニムパンツ'。
export const PRODUCT_NAME = 'デニムパンツ' // ← ここを書き換える

// 問4:「在庫がマイナスになっている」を表す boolean の定数。値は true。
export const HAS_NEGATIVE = true // ← ここを書き換える

// 問5:6,980円の商品を3点買ったときの合計を計算する式を書く。
//      (数字を直接 20940 と書くのではなく、掛け算で書く)
const unitPrice = 6980
const qty = 3
export const total = unitPrice * qty // ← ここを書き換える(unitPrice と qty を使う)

// 問6:11,270円(税込)に含まれる消費税を、1円未満切り捨てで計算する。
//      式:税込 × 10 ÷ 110 を切り捨て。答えは 1024 になるはず。
const totalIncl = 11270
export const tax = (Math.floor(totalIncl * 10 / 110)) // ← ここを書き換える(Math.floor を使う)
