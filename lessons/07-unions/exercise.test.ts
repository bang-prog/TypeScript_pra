// 第7回 演習の採点用テスト。このファイルは書き換えなくてよい
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import * as ex from './exercise.ts'

const source = readFileSync(new URL('./exercise.ts', import.meta.url), 'utf8')

/** export function 名前(...) { ... } の中身を取り出す(次の export まで) */
const bodyOf = (name: string) => source.split(new RegExp(`export function\\s+${name}\\b`))[1]?.split(/\nexport /)[0] ?? ''

describe('第7回 演習', () => {
  it("問1:Size('S' | 'M' | 'L')", () => {
    const line = source.match(/export type Size\s*=([^\n]*)/)?.[1] ?? ''
    for (const s of ['S', 'M', 'L']) expect(line).toMatch(new RegExp(`['"]${s}['"]`))
    expect(line.match(/\|/g)?.length).toBe(2)
    expect(line).not.toMatch(/string/)
  })

  it('問2:priceText(null を先に追い出す)', () => {
    expect(ex.priceText(null)).toBe('未入力')
    expect(ex.priceText(6980)).toBe('6980円')
    expect(ex.priceText(0)).toBe('0円')
  })

  it('問3:changeMessage(ok で見分ける)', () => {
    expect(ex.changeMessage({ ok: true, change: 3020 })).toBe('お釣り 3020円')
    expect(ex.changeMessage({ ok: true, change: 0 })).toBe('お釣り 0円')
    expect(ex.changeMessage({ ok: false, shortage: 1980 })).toBe('1980円 足りません')
  })

  it('問4:countReducer(switch)', () => {
    expect(ex.countReducer(2, { type: 'add' })).toBe(3)
    expect(ex.countReducer(2, { type: 'decrement' })).toBe(1)
    expect(ex.countReducer(0, { type: 'decrement' })).toBe(0)
    expect(ex.countReducer(5, { type: 'clear' })).toBe(0)
    expect(bodyOf('countReducer')).toMatch(/switch\s*\(/)
  })

  it('問5:予想する', () => {
    expect([...ex.q5].sort()).toEqual(['B', 'D'])
  })

  it('問6:isSize(レビュー目線:型ガードの中身)', () => {
    expect(ex.isSize('S')).toBe(true)
    expect(ex.isSize('M')).toBe(true)
    expect(ex.isSize('L')).toBe(true)
    expect(ex.isSize('XL')).toBe(false)
    expect(ex.isSize('s')).toBe(false)
  })
})
