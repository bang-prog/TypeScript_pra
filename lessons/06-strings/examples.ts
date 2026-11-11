// 第6回のサンプル。実行:node lessons/06-strings/examples.ts

// ---------- テンプレート文字列 ----------

const color = '白'
const size = 'M'
console.log(`${color} / ${size}`)
console.log('${color} / ${size}  ← シングルクォートだと埋め込まれない')

const label = '商品名'
console.log(`${label}を入力してください`)

const month = 10 // 11月(月は 0 から数える)
console.log(`${month + 1}月`)

// ---------- String() と Number() ----------

console.log(String(7), Number('7'), Number('12a'), Number(''))
console.log("Number('12a') || 0 →", Number('12a') || 0)

// ---------- padStart ----------

const pad2 = (n: number) => String(n).padStart(2, '0')
console.log(pad2(3), pad2(12))
console.log(String(7).padStart(3, '0'), String(123).padStart(3, '0'))

// ---------- trim ----------

console.log(`[${'  シャツ  '.trim()}]`)
console.log(`[${'  白 T  '.trim()}]  ← 真ん中の空白は残る`)
console.log(`[${'   '.trim()}]  ← 空白だけなら空文字になる`)

// ---------- split と join ----------

const parts = '2026-11-08'.split('-')
console.log(parts, parts.join('/'))
console.log("'20261108-007'.split('-')[1] →", '20261108-007'.split('-')[1])

// ---------- replace と replaceAll ----------

console.log("replaceAll →", '2026-11-08'.replaceAll('-', ''))
console.log("replace    →", '2026-11-08'.replace('-', ''), '← 最初の1つだけ')

// ---------- slice ----------

const iso = '2026-11-06T14:05:09+09:00'
console.log(iso.slice(0, 10), iso.slice(11, 16))

// ---------- 正規表現 ----------

const isDate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v)
console.log(isDate('2026-11-08'), isDate('2026-1-8'), isDate('2026/11/08'))

const isInt = (v: string) => /^-?\d+$/.test(v)
console.log(isInt('12'), isInt('-3'), isInt('1.5'), isInt(''), isInt('12a'))

// ---------- まとめて:splitList ----------

const text = 'S, M、 L,,'
const step1 = text.split(/[,、]/)
const step2 = step1.map((s) => s.trim())
const step3 = step2.filter(Boolean)
console.log('① split  :', step1)
console.log('② trim   :', step2)
console.log('③ filter :', step3)

// ---------- まとめて:会計番号 ----------

const businessDate = '2026-11-08'
const saleNos = ['20261108-001', '20261108-002']
const prefix = businessDate.replaceAll('-', '')
const max = saleNos.reduce((m, no) => Math.max(m, Number(no.split('-')[1]) || 0), 0)
console.log('次の会計番号:', `${prefix}-${String(max + 1).padStart(3, '0')}`)
