// 第8回 演習の採点用テスト。このファイルは書き換えなくてよい
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import * as ex from './exercise.ts'

const source = readFileSync(new URL('./exercise.ts', import.meta.url), 'utf8')
const exports = ex as Record<string, unknown>

describe('第8回 演習', () => {
  it('問1:totalLabel(名前付き import)', () => {
    expect(ex.totalLabel(6980)).toBe('¥6,980')
    expect(ex.totalLabel(0)).toBe('¥0')
    expect(source).toMatch(/import\s*\{[^}]*\bformatYen\b[^}]*\}\s*from\s*['"]\.\/money(\.ts)?['"]/)
  })

  it('問2:TAX_RATE を export する', () => {
    expect(exports.TAX_RATE).toBe(10)
  })

  it('問3:productLabel(import type)', () => {
    expect(ex.productLabel({ id: 'p1', name: 'シャツ', priceIncl: 6980 })).toBe('シャツ ¥6,980')
    expect(source).toMatch(/import\s+type\s*\{[^}]*\bProduct\b[^}]*\}\s*from\s*['"]\.\/types(\.ts)?['"]/)
    expect(source).toMatch(/productLabel\s*\(\s*p\s*:\s*Product\s*\)/)
  })

  it('問4:variantText(default import)', () => {
    expect(ex.variantText('白', 'F')).toBe('白 / フリー')
    expect(ex.variantText('黒', 'M')).toBe('黒 / M')
    expect(source).toMatch(/import\s+\w+\s+from\s*['"]\.\/labels(\.ts)?['"]/)
  })

  it('問5:予想する(パス)', () => {
    expect(ex.q5_1).toBe('src/lib/cashInput.ts')
    expect(ex.q5_2).toBe('src/db/settings.ts')
    expect(ex.q5_3).toBe('src/db/catalog.ts')
  })

  it('問6:エラーになる import', () => {
    expect([...ex.q6].sort()).toEqual(['B', 'C'])
  })
})
