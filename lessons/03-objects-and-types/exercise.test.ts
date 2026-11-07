// 第3回 演習の採点用テスト。このファイルは書き換えなくてよい
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { label, splitTax, tops, whiteM, whiteMView, withoutNote } from './exercise.ts'

const source = readFileSync(new URL('./exercise.ts', import.meta.url), 'utf8')

describe('第3回 演習', () => {
  it('問1:Category に id / name / sortOrder がある', () => {
    const body = source.match(/type Category = \{([^}]*)\}/)?.[1] ?? ''
    // : の前後のスペースはあってもなくてもよい
    expect(body).toMatch(/\bid\s*:\s*string/)
    expect(body).toMatch(/\bname\s*:\s*string/)
    expect(body).toMatch(/\bsortOrder\s*:\s*number/)
    expect(tops.name).toBe('トップス')
  })

  it('問2:白 / M の Variant', () => {
    expect(whiteM).toEqual({ id: 'v1', productId: 'p1', size: 'M', color: '白', stock: 3 })
  })

  it('問3:note は省略できる(?: を使う)', () => {
    expect(source).toMatch(/note\s*\?\s*:\s*string/)
    expect(withoutNote.title).toBe('会計履歴')
  })

  it('問4:VariantView は & で作る', () => {
    expect(source).toMatch(/type VariantView\s*=\s*Variant\s*&/)
    expect(whiteMView).toMatchObject({ size: 'M', color: '白', productName: 'シャツ' })
  })

  it('問5:splitTax', () => {
    expect(splitTax(11270)).toEqual({ incl: 11270, tax: 1024, excl: 10246 })
    expect(splitTax(110)).toEqual({ incl: 110, tax: 10, excl: 100 })
  })

  it('問6:label', () => {
    expect(label({ name: 'シャツ', priceIncl: 6980 })).toBe('シャツ:¥6,980')
    expect(source).toMatch(/function label\s*\(\s*\{\s*name\s*,\s*priceIncl\s*\}/)
  })
})
