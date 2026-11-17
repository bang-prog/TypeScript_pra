// 第10回 演習の採点用テスト。このファイルは書き換えなくてよい
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import * as ex from './exercise.ts'

const source = readFileSync(new URL('./exercise.ts', import.meta.url), 'utf8')

/** export function 名前(...) { ... } の中身を取り出す(次の export まで) */
const bodyOf = (name: string) => source.split(new RegExp(`export function\\s+${name}\\b`))[1]?.split(/\nexport /)[0] ?? ''

describe('第10回 演習', () => {
  it('問1:withQty(オブジェクトの ...)', () => {
    const line = { variantId: 'v1', qty: 2 }
    expect(ex.withQty(line, 5)).toEqual({ variantId: 'v1', qty: 5 })
    expect(line).toEqual({ variantId: 'v1', qty: 2 })
    expect(bodyOf('withQty')).toMatch(/\.\.\.\s*line/)
  })

  it('問2:addLine(配列の ...)', () => {
    const lines = [{ variantId: 'v1', qty: 1 }]
    expect(ex.addLine(lines, { variantId: 'v2', qty: 1 })).toEqual([
      { variantId: 'v1', qty: 1 },
      { variantId: 'v2', qty: 1 },
    ])
    expect(lines).toHaveLength(1)
    expect(bodyOf('addLine')).toMatch(/\.\.\.\s*lines/)
    expect(bodyOf('addLine')).not.toMatch(/\.push\s*\(/)
  })

  it('問3:countByColor(Map)', () => {
    expect([...ex.countByColor(['白', '黒', '白'])]).toEqual([
      ['白', 2],
      ['黒', 1],
    ])
    expect(ex.countByColor([]).size).toBe(0)
    const body = bodyOf('countByColor')
    expect(body).toMatch(/\.get\s*\(/)
    expect(body).toMatch(/\.set\s*\(/)
  })

  it('問4:uniqueSizes(Set)', () => {
    expect(ex.uniqueSizes(['S', 'M', 'S', 'L', 'M'])).toEqual(['S', 'M', 'L'])
    expect(ex.uniqueSizes([])).toEqual([])
    expect(bodyOf('uniqueSizes')).toMatch(/new\s+Set\b/)
  })

  it('問5:予想する', () => {
    expect(ex.q5_1).toBe(3)
    expect(ex.q5_2).toBe('11')
    expect(ex.q5_3).toBe(0)
    expect(ex.q5_4).toBe(2)
  })

  it('問6:increment(レビュー目線:元のカートを変えない)', () => {
    const lines = [
      { variantId: 'v1', qty: 1 },
      { variantId: 'v2', qty: 3 },
    ]
    expect(ex.increment(lines, 'v2')).toEqual([
      { variantId: 'v1', qty: 1 },
      { variantId: 'v2', qty: 4 },
    ])
    expect(lines).toEqual([
      { variantId: 'v1', qty: 1 },
      { variantId: 'v2', qty: 3 },
    ])
  })
})
