// 第9回 演習の採点用テスト。このファイルは書き換えなくてよい
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import * as ex from './exercise.ts'

const source = readFileSync(new URL('./exercise.ts', import.meta.url), 'utf8')

/** export function 名前(...) { ... } の中身を取り出す(次の export まで) */
const bodyOf = (name: string) => source.split(new RegExp(`export function\\s+${name}\\b`))[1]?.split(/\nexport /)[0] ?? ''

// 問1が未完成でも他の問題を採点できるように、引数付きで作る
const makeValidationError = (message: string): unknown =>
  new (ex.ValidationError as unknown as new (m: string) => unknown)(message)

/** 関数を呼んで、投げられたものを返す(投げなければ undefined) */
const thrownBy = (fn: () => void): unknown => {
  try {
    fn()
  } catch (e) {
    return e
  }
  return undefined
}

describe('第9回 演習', () => {
  it('問1:ValidationError(extends Error)', () => {
    const e = makeValidationError('在庫が足りません')
    expect(e).toBeInstanceOf(Error)
    expect(e).toBeInstanceOf(ex.ValidationError)
    expect((e as Error).message).toBe('在庫が足りません')
    expect((e as Error).name).toBe('ValidationError')
  })

  it('問2:checkQty(throw)', () => {
    for (const bad of [0, -1, 1.5]) {
      const e = thrownBy(() => ex.checkQty(bad))
      expect(e, `checkQty(${bad}) はエラーを投げるはず`).toBeInstanceOf(ex.ValidationError)
      expect((e as Error).message).toBe('数量が正しくありません')
    }
    expect(thrownBy(() => ex.checkQty(1))).toBeUndefined()
    expect(thrownBy(() => ex.checkQty(5))).toBeUndefined()
  })

  it('問3:userMessage(instanceof)', () => {
    expect(ex.userMessage(makeValidationError('在庫が足りません'))).toBe('在庫が足りません')
    expect(ex.userMessage(new Error('在庫が足りません'))).toBe('保存できませんでした。もう一度お試しください。')
    expect(ex.userMessage('abc')).toBe('保存できませんでした。もう一度お試しください。')
    expect(bodyOf('userMessage')).toMatch(/instanceof\s+ValidationError/)
  })

  it('問4:toQtyOrNull(try / catch)', () => {
    expect(ex.toQtyOrNull('3')).toBe(3)
    expect(ex.toQtyOrNull('1')).toBe(1)
    expect(ex.toQtyOrNull('0')).toBeNull()
    expect(ex.toQtyOrNull('1.5')).toBeNull()
    expect(ex.toQtyOrNull('abc')).toBeNull()
    const body = bodyOf('toQtyOrNull')
    expect(body).toMatch(/\btry\s*\{/)
    expect(body).toMatch(/\bcatch\b/)
    expect(body).toMatch(/checkQty\s*\(/)
  })

  it('問5:予想する', () => {
    expect(ex.q5_1).toEqual(['A', 'B', 'D', 'E'])
    expect(ex.q5_2).toEqual(['A', 'C', 'D', 'E'])
  })

  it('問6:runSave(レビュー目線:失敗したときの saving)', () => {
    const ok: ex.SaveState = { saving: false, error: null }
    ex.runSave(ok, () => {})
    expect(ok).toEqual({ saving: false, error: null })

    const ng: ex.SaveState = { saving: false, error: null }
    let savingDuringSave = false
    ex.runSave(ng, () => {
      savingDuringSave = ng.saving
      throw new Error('保存に失敗')
    })
    expect(savingDuringSave).toBe(true)
    expect(ng.saving).toBe(false)
    expect(ng.error).not.toBeNull()
  })
})
