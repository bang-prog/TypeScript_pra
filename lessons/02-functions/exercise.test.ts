// 第2回 演習の採点用テスト。このファイルは書き換えなくてよい
import { describe, expect, it } from 'vitest'
import { applyTwice, formatYen, isEnough, lineTotal, pad3, taxOf } from './exercise.ts'

describe('第2回 演習', () => {
  it('問1:lineTotal', () => {
    expect(lineTotal(6980, 3)).toBe(20940)
    expect(lineTotal(990, 1)).toBe(990)
  })

  it('問2:taxOf(税率を省略すると 10%)', () => {
    // ratePercent にデフォルト値を付けるまでは、次の行に赤線(引数が足りないという型エラー)が出る
    expect(taxOf(11270)).toBe(1024)
    expect(taxOf(1080, 8)).toBe(80)
    expect(taxOf(109, 10)).toBe(9)
  })

  it('問3:pad3', () => {
    expect(pad3(7)).toBe('007')
    expect(pad3(42)).toBe('042')
    expect(pad3(123)).toBe('123')
  })

  it('問4:formatYen', () => {
    expect(formatYen(0)).toBe('¥0')
    expect(formatYen(980)).toBe('¥980')
    expect(formatYen(1234567)).toBe('¥1,234,567')
  })

  it('問5:isEnough', () => {
    expect(isEnough(10000, 6980)).toBe(true)
    expect(isEnough(6980, 6980)).toBe(true)
    expect(isEnough(5000, 6980)).toBe(false)
  })

  it('問6:applyTwice', () => {
    expect(applyTwice(3, (x) => x + 10)).toBe(23)
    expect(applyTwice(5, (x) => x * 2)).toBe(20)
  })
})
