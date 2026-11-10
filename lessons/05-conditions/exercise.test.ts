// 第5回 演習の採点用テスト。このファイルは書き換えなくてよい
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import * as ex from './exercise.ts'

const source = readFileSync(new URL('./exercise.ts', import.meta.url), 'utf8')

/** export function 名前(...) { ... } の中身を取り出す(次の export まで) */
const bodyOf = (name: string) => source.split(new RegExp(`export function\\s+${name}\\b`))[1]?.split(/\nexport /)[0] ?? ''

describe('第5回 演習', () => {
  it('問1:stockStatus(if / else if / else)', () => {
    expect(ex.stockStatus(-1)).toBe('マイナス')
    expect(ex.stockStatus(0)).toBe('在庫なし')
    expect(ex.stockStatus(1)).toBe('在庫あり')
    expect(ex.stockStatus(50)).toBe('在庫あり')
    expect(bodyOf('stockStatus')).toMatch(/else\s+if/)
  })

  it('問2:sizeLabel(三項演算子)', () => {
    expect(ex.sizeLabel('F')).toBe('フリー')
    expect(ex.sizeLabel('M')).toBe('M')
    expect(bodyOf('sizeLabel')).toMatch(/\?[^:]*:/)
    expect(bodyOf('sizeLabel')).not.toMatch(/\bif\s*\(/)
  })

  it('問3:canSell(&&)', () => {
    expect(ex.canSell({ isActive: true, stock: 3 })).toBe(true)
    expect(ex.canSell({ isActive: true, stock: 1 })).toBe(true)
    expect(ex.canSell({ isActive: true, stock: 0 })).toBe(false)
    expect(ex.canSell({ isActive: false, stock: 3 })).toBe(false)
    expect(bodyOf('canSell')).toMatch(/&&/)
    expect(bodyOf('canSell')).not.toMatch(/\bif\s*\(/)
  })

  it('問4:categoryNameOf(find と ?. と ??)', () => {
    const cs = [{ id: 'c1', name: 'トップス' }, { id: 'c2', name: 'ボトムス' }]
    expect(ex.categoryNameOf(cs, 'c2')).toBe('ボトムス')
    expect(ex.categoryNameOf(cs, 'zzz')).toBe('')
    expect(ex.categoryNameOf([], 'c1')).toBe('')
    const body = bodyOf('categoryNameOf')
    expect(body).toMatch(/\.find\s*\(/)
    expect(body).toMatch(/\?\./)
    expect(body).toMatch(/\?\?/)
  })

  it('問5:予想する', () => {
    expect(ex.q5_1).toBe(100)
    expect(ex.q5_2).toBe(0)
    expect(ex.q5_3).toBe('未設定')
    expect(ex.q5_4).toBe('ある')
  })

  it('問6:openingFloatOf(レビュー目線:0 円のとき)', () => {
    expect(ex.openingFloatOf({})).toBe(30000)
    expect(ex.openingFloatOf({ openingFloat: 50000 })).toBe(50000)
    expect(ex.openingFloatOf({ openingFloat: 0 })).toBe(0)
  })
})
