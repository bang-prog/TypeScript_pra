// 第1回 演習の採点用テスト。このファイルは書き換えなくてよい(第13回で読み方をやります)
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { HAS_NEGATIVE, MAX_BILLS, PRODUCT_NAME, REDUCED_TAX_RATE, tax, total } from './exercise.ts'

const source = readFileSync(new URL('./exercise.ts', import.meta.url), 'utf8')

describe('第1回 演習', () => {
  it('問1:REDUCED_TAX_RATE は 8', () => {
    expect(REDUCED_TAX_RATE).toBe(8)
  })

  it('問2:MAX_BILLS は 99_999(_ で区切って書く)', () => {
    expect(MAX_BILLS).toBe(99999)
    expect(source).toContain('99_999')
  })

  it("問3:PRODUCT_NAME は 'デニムパンツ'", () => {
    expect(PRODUCT_NAME).toBe('デニムパンツ')
  })

  it('問4:HAS_NEGATIVE は true', () => {
    expect(HAS_NEGATIVE).toBe(true)
  })

  it('問5:total は unitPrice × qty', () => {
    expect(total).toBe(20940)
    expect(source).toMatch(/total\s*=\s*(unitPrice\s*\*\s*qty|qty\s*\*\s*unitPrice)/)
  })

  it('問6:tax は Math.floor で切り捨てた 1024', () => {
    expect(tax).toBe(1024)
    expect(source).toContain('Math.floor')
  })
})
