# カリキュラム

ゴール:**帳簿アプリ(`../tyoubo`)のコードを読んで、Claude Code が書いた変更をレビューできるようになる。**

- 書けるようになることより「読めるようになること」を優先する
- 毎回、tyoubo の本物のコードを読む課題がある
- 構文の名前は覚えなくてよい。「見たときに意味がわかる」が合格ライン

各回の「tyoubo で出てくる場所」は、教材を作るときに実際のコードを見て確かめる(コードは開発中なので変わることがある)。

---

## 第1部 TypeScript の基礎構文(01〜13)

`src/lib/` と `src/db/` の大部分が読めるようになる。

| 回 | テーマ | 学ぶこと | tyoubo で出てくる場所 |
|---|---|---|---|
| 01 | 変数と基本の型 | TypeScript とは何か / `const` と `let` / `number` `string` `boolean` / 型注釈と型推論 / `9_999_999` / コメントと `/** */` | `lib/money.ts` の定数 |
| 02 | 関数 | `function` / 引数と戻り値の型 / `void` / デフォルト引数 / アロー関数 `=>` / `export` / `throw` の入口 | `lib/time.ts`・`lib/labels.ts`・`money.ts` の `taxOf` |
| 03 | オブジェクトと `type` | オブジェクトの書き方 / `type` で形に名前を付ける / `?:`(省略できる項目)/ `&` で型を合成 / 省略記法 `{ tax }` / 分割代入の基本 | `db/types.ts` 全体・`splitTax` |
| 04 | 配列と配列メソッド | `string[]` / `map` `filter` `reduce` `some` `find` `findIndex` `sort` / コールバック関数 | `cartTotal`・`loadCatalog` |
| 05 | 条件分岐と演算子 | `if` / 三項演算子 `? :` / `===` / truthy と falsy / `&&` `\|\|` / `??` / `?.` / `!` | `catalog.ts`・`sales.ts` のあちこち |
| 06 | 文字列 | テンプレート文字列 `` `${}` `` / `padStart` `trim` `split` `replaceAll` / 正規表現をちょっとだけ | `lib/time.ts`・`nextSaleNo`・`ProductForm` の `splitList` |
| 07 | ユニオン型と型の絞り込み | `\|` / リテラル型 `'add'` / 判別可能なユニオン / `switch` での絞り込み / 型ガード `x is T` / `string \| null` | `CartAction`・`ChangeResult`・`CashAction` |
| 08 | モジュール | `import` / `export` / `export default` / `import type` / 相対パス `../` | 全ファイルの先頭 |
| 09 | エラー処理とクラス | `throw` / `try` `catch` `finally` / `class ... extends Error` / `instanceof` / `unknown` | `db/errors.ts`・`RegisterPage` の `confirmSale` |
| 10 | スプレッド・分割代入・Map・Set | `...`(配列とオブジェクト)/ 分割代入 / `Map` / `Set` / `as const` / `as`(型アサーション) | `cartReducer`・`buildCartView`・`saveProduct` |
| 11 | 非同期処理 | `Promise` / `async` / `await` / `Promise.all` / トランザクションの考え方 | `db/catalog.ts`・`db/sales.ts` |
| 12 | ジェネリクスと型の道具 | `<T>` / `Promise<string>` `Map<K, V>` / `extends` による制約 / `keyof` / `T[K]` / `Partial` `Record` `Readonly` / マップ型 | `db/settings.ts`・`db/db.ts`・`DenominationCounts` |
| 13 | テストを読む | `describe` `it` `expect` / テストは「仕様の例」として読む | `lib/*.test.ts`・`db/*.test.ts` |

## 第2部 React と TSX(14〜17)

`src/components/` と `src/pages/` が読めるようになる。

| 回 | テーマ | 学ぶこと | tyoubo で出てくる場所 |
|---|---|---|---|
| 14 | コンポーネントと JSX | `.tsx` / JSX の書き方 / `{}` で式を埋め込む / props とその型 `Props` / `children` / `&&` と三項演算子での出し分け / `map` で一覧表示と `key` | `PagePlaceholder`・`Clock`・`CartPanel` |
| 15 | 状態とイベント | `useState` / イベント `onClick` `onChange` / 親から子へ関数を渡す(`onPick` など) | `ProductForm`・`RegisterPage` |
| 16 | 副作用と参照・reducer | `useEffect`(後片付け)/ `useRef` / `useReducer` と `dispatch` / `useMemo` | `Clock`・`Modal`・`PayDialog` |
| 17 | Context とライブラリのフック | `createContext` / `useContext` / 自作フック `useCart` / `useLiveQuery`(Dexie)/ ルーティング(react-router) | `state/`・`App.tsx`・`main.tsx` |

## 第3部 tyoubo を読む(18〜21)

ここまでの知識で、本物のコードを最初から最後まで読む。

| 回 | テーマ | 内容 |
|---|---|---|
| 18 | プロジェクトの全体像 | `package.json`・`tsconfig`・フォルダ構成・`docs/architecture.md`・`main.tsx` → `App.tsx` の流れ |
| 19 | 計算の層 `src/lib` | `money.ts`・`cart.ts`・`cashInput.ts`・`time.ts` をテストと一緒に精読 |
| 20 | データの層 `src/db` | `types.ts`・`db.ts`・`catalog.ts`・`sales.ts`。「会計を確定したとき何が起きるか」を追う |
| 21 | 画面の層 | 「商品を選ぶ → カート → 電卓 → 確定」を `RegisterPage` から順にたどる |

## 第4部 レビューの練習(22〜)

| 回 | テーマ | 内容 |
|---|---|---|
| 22 | 差分(diff)の読み方とレビューの観点 | `git diff` の読み方 / 見るべき観点(仕様どおりか・型・エラー時・境界値・テストがあるか・名前)/ tyoubo の過去のコミットで練習 |
| 23〜 | 実戦 | tyoubo の新しいコミット(Claude Code が書いたもの)を1つずつレビューする。指摘を書き、Claude と答え合わせする |

---

## 1回の流れ(目安 30〜60分)

1. `README.md`(解説)を読む。Python との違いに注目
2. `examples.ts` を実行して、動きを確かめる
3. `quiz.md` の「結果を予想する問題」を解く(答えは折りたたみの中)
4. `exercise.ts` を書き換えて、テストを通す
5. 解説の最後の「tyoubo を読む」課題をやる
6. Claude に「答え合わせして」「わからなかったところを聞きたい」と言う
