// 第4回 演習の採点用テスト。このファイルは書き換えなくてよい
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { activeOnly, findById, hasNegative, names, sortByPrice, totalStock, type Product } from './exercise.ts'

const source = readFileSync(new URL('./exercise.ts', import.meta.url), 'utf8')

/** export function 名前(...) { ... } の中身を取り出す(次の export まで) */
const bodyOf = (name: string) => source.split(new RegExp(`export function\\s+${name}\\b`))[1]?.split(/\nexport /)[0] ?? ''

const products = (): Product[] => [
  { id: 'p1', name: 'シャツ', priceIncl: 6980, stock: 3, isActive: true },
  { id: 'p2', name: 'デニム', priceIncl: 9800, stock: -1, isActive: true },
  { id: 'p3', name: 'インナー', priceIncl: 990, stock: 5, isActive: false },
]

describe('第4回 演習', () => {
  it('問1:names(map を使う)', () => {
    expect(names(products())).toEqual(['シャツ', 'デニム', 'インナー'])
    expect(names([])).toEqual([])
    expect(bodyOf('names')).toMatch(/\.map\s*\(/)
  })

  it('問2:activeOnly(filter を使う)', () => {
    expect(activeOnly(products()).map((p) => p.id)).toEqual(['p1', 'p2'])
    expect(bodyOf('activeOnly')).toMatch(/\.filter\s*\(/)
  })

  it('問3:totalStock(reduce を使う)', () => {
    expect(totalStock(products())).toBe(7)
    expect(totalStock([])).toBe(0)
    expect(bodyOf('totalStock')).toMatch(/\.reduce\s*\(/)
  })

  it('問4:hasNegative(some を使う)', () => {
    expect(hasNegative(products())).toBe(true)
    expect(hasNegative(products().filter((p) => p.stock >= 0))).toBe(false)
    expect(bodyOf('hasNegative')).toMatch(/\.some\s*\(/)
  })

  it('問5:findById(find を使い、戻り値の型を書く)', () => {
    expect(findById(products(), 'p2')?.name).toBe('デニム')
    expect(findById(products(), 'zzz')).toBeUndefined()
    expect(bodyOf('findById')).toMatch(/\.find\s*\(/)
    // 戻り値の型:Product | undefined(順番は逆でもよい)
    expect(source).toMatch(/findById\s*\([^)]*\)\s*:\s*(Product\s*\|\s*undefined|undefined\s*\|\s*Product)/)
  })

  it('問6:sortByPrice(安い順。元の配列は変えない)', () => {
    const list = products()
    expect(sortByPrice(list).map((p) => p.id)).toEqual(['p3', 'p1', 'p2'])
    expect(list.map((p) => p.id)).toEqual(['p1', 'p2', 'p3'])
  })
})
