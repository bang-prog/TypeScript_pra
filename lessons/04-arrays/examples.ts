// 第4回のサンプル。実行:node lessons/04-arrays/examples.ts

type Variant = { 
  id: string; 
  size: string; 
  color: string; 
  stock: number; 
  sizeOrder: number 
}

const variants: Variant[] = [
  { id: 'v1', size: 'L', color: '白', stock: 2, sizeOrder: 2 },
  { id: 'v2', size: 'S', color: '白', stock: 0, sizeOrder: 0 },
  { id: 'v3', size: 'M', color: '白', stock: -1, sizeOrder: 1 },
]

// ---------- 配列の基本 ----------

const sizes = ['S', 'M', 'L']
console.log(sizes[0], sizes.length, sizes.includes('M'), sizes.join(', '))
sizes.push('XL')
console.log('push 後:', sizes)

// ---------- for ... of ----------

for (const v of variants) {
  if (v.stock <= 0) continue // 在庫がないものは飛ばす
  console.log('在庫あり:', v.size, v.stock)
}

// ---------- map:全部を変換 ----------

console.log('map:', variants.map((v) => v.size))

// ---------- filter:条件に合うものだけ ----------

console.log(
  'filter:',
  variants.filter((v) => v.stock > 0).map((v) => v.size),
)

// ---------- find / findIndex ----------

console.log('find:', variants.find((v) => v.size === 'M'))
console.log('find(ない):', variants.find((v) => v.size === 'XL')) // undefined
console.log('findIndex:', variants.findIndex((v) => v.size === 'M'))

// ---------- some / every ----------

console.log('some(マイナスがある?):', variants.some((v) => v.stock < 0))
console.log('every(全部 白?):', variants.every((v) => v.color === '白'))

// ---------- reduce:まとめて1つに ----------

const totalStock = variants.reduce((sum, v) => sum + v.stock, 0)
console.log('reduce(在庫の合計):', totalStock)

// 途中経過を見てみる
;[980, 6980, 1500].reduce((sum, p) => {
  console.log(`  sum=${sum}, p=${p} → ${sum + p}`)
  return sum + p
}, 0)

// ---------- sort:元の配列を書き換える ----------

const copy = [...variants].sort((a, b) => a.sizeOrder - b.sizeOrder)
console.log('コピーを並べ替え:', copy.map((v) => v.size), '/ 元:', variants.map((v) => v.size))

variants.sort((a, b) => a.sizeOrder - b.sizeOrder)
console.log('元を直接並べ替え:', variants.map((v) => v.size), '← 元の順番が変わった')

// 大きい順
console.log('在庫の多い順:', [...variants].sort((a, b) => b.stock - a.stock).map((v) => `${v.size}:${v.stock}`))

// 文字列の並べ替え
console.log(['シャツ', 'インナー', 'デニム'].sort((a, b) => a.localeCompare(b, 'ja')))

// ---------- つなげて書く ----------

const result = variants
  .filter((v) => v.stock > 0)
  .map((v) => `${v.color} / ${v.size}`)
console.log('チェーン:', result)
