// 第9回 演習。採点:npm run check 09
// 関数やクラスの中身(TODO の部分)を書いて、テストを通してください。

// 問1:ValidationError クラスを完成させる。
//      ・Error を元にする(extends を使う)
//      ・name という項目に 'ValidationError' を入れる
//      (tyoubo の db/errors.ts と同じものです)
export class ValidationError extends Error {
  name = 'ValidationError'// TODO
}

// 問2:数量が正しくなければ、ValidationError を投げる。正しければ何もしない。
//      「正しくない」= 整数ではない(Number.isSafeInteger が false)または 1 より小さい
//      エラーの文は '数量が正しくありません'
export function checkQty(qty: number): void {
  if (!Number.isSafeInteger(qty) || qty < 1) {
   throw new ValidationError('数量が正しくありません')
  }// TODO
}

// 問3:画面に出すエラーの文を返す。
//      ・error が ValidationError なら、そのエラーの文(message)
//      ・それ以外なら '保存できませんでした。もう一度お試しください。'
//      (instanceof を使う)
export function userMessage(error: unknown): string {
  if (error instanceof ValidationError) return error.message
  console.error(error)
  return '保存できませんでした。もう一度お試しください。' // TODO
}

// 問4:文字列を数値にする。ただし、数量として正しくなければ null を返す。
//      問2の checkQty を try の中で呼び、エラーになったら catch で null を返すこと。
//      例:'3' → 3   '0' → null   '1.5' → null
export function toQtyOrNull(text: string): number | null {
   const qty = Number(text)
  try {
    checkQty(qty)
    return qty
  } catch {
    return null
  }// TODO
}

// 問5:予想する問題。次の関数 run を呼んだとき、log に入る文字を順番に、配列で書いてください。
//      例:'A' と 'C' なら ['A', 'C']
//
//      function run(ok: boolean): string[] {
//        const log: string[] = []
//        try {
//          log.push('A')
//          if (!ok) throw new Error('失敗')
//          log.push('B')
//        } catch {
//          log.push('C')
//        } finally {
//          log.push('D')
//        }
//        log.push('E')
//        return log
//      }

// (1) run(true) のとき
export const q5_1: string[] = ['A', 'B', 'D', 'E'] // TODO

// (2) run(false) のとき
export const q5_2: string[] = ['A', 'C', 'D', 'E'] // TODO

// 問6(レビュー目線):次の関数にはバグがあります。見つけて直してください。
//      仕様:「保存を始めたら saving を true にする。保存が終わったら、成功しても失敗しても saving を false に戻す。
//             失敗したときは、error に画面に出す文を入れる」
export type SaveState = { saving: boolean; error: string | null }

export function runSave(state: SaveState, save: () => void): void {
  state.saving = true
  state.error = null
  try {
    save()
    state.saving = false
  } catch (e) {
    state.error = userMessage(e)
  } finally {
    state.saving = false 
  }
}
