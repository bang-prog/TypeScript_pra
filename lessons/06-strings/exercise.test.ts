// 第6回 演習の採点用テスト。このファイルは書き換えなくてよい
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import * as ex from './exercise.ts'

const source = readFileSync(new URL('./exercise.ts', import.meta.url), 'utf8')

/** export function 名前(...) { ... } の中身を取り出す(次の export まで) */
const bodyOf = (name: string) => source.split(new RegExp(`export function\\s+${name}\\b`))[1]?.split(/\nexport /)[0] ?? ''

describe('第6回 演習', () => {
  it('問1:variantLabel(テンプレート文字列)', () => {
    expect(ex.variantLabel('白', 'M')).toBe('白 / M')
    expect(ex.variantLabel('ネイビー', 'XL')).toBe('ネイビー / XL')
    expect(bodyOf('variantLabel')).toMatch(/`[^`]*\$\{/)
  })

  it('問2:seqText(padStart)', () => {
    expect(ex.seqText(7)).toBe('007')
    expect(ex.seqText(42)).toBe('042')
    expect(ex.seqText(123)).toBe('123')
    expect(bodyOf('seqText')).toMatch(/\.padStart\s*\(/)
  })

  it('問3:splitSizes(split・map・filter)', () => {
    expect(ex.splitSizes('S, M,, L ')).toEqual(['S', 'M', 'L'])
    expect(ex.splitSizes('F')).toEqual(['F'])
    expect(ex.splitSizes('')).toEqual([])
    const body = bodyOf('splitSizes')
    expect(body).toMatch(/\.split\s*\(/)
    expect(body).toMatch(/\.map\s*\(/)
    expect(body).toMatch(/\.filter\s*\(/)
  })

  it('問4:dateOf(slice)', () => {
    expect(ex.dateOf('2026-11-06T14:05:09+09:00')).toBe('2026-11-06')
    expect(ex.dateOf('2027-01-31T09:00:00+09:00')).toBe('2027-01-31')
    expect(bodyOf('dateOf')).toMatch(/\.slice\s*\(/)
  })

  it('問5:予想する', () => {
    expect(ex.q5_1).toBe('05')
    expect(ex.q5_2).toBe('012')
    expect(ex.q5_3).toBe('SM-L')
    expect(ex.q5_4).toBe('3点')
  })

  it('問6:datePrefix(レビュー目線:- が2つある)', () => {
    expect(ex.datePrefix('2026-11-08')).toBe('20261108')
    expect(ex.datePrefix('2027-01-31')).toBe('20270131')
  })
})
