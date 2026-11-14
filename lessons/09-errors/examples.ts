// 第9回のサンプル。実行:node lessons/09-errors/examples.ts

// ---------- クラスの基本 ----------

class Counter {
  count = 0

  add(): void {
    this.count += 1
  }
}

const c = new Counter()
c.add()
c.add()
console.log('Counter:', c.count)

// ---------- 自分用のエラー ----------

class ValidationError extends Error {
  name = 'ValidationError'
}

function userMessage(error: unknown): string {
  if (error instanceof ValidationError) return error.message
  console.error('  (開発者向けの記録)', String(error))
  return '保存できませんでした。もう一度お試しください。'
}

// ---------- throw ----------

type Line = { variantId: string; qty: number }

function createSale(lines: Line[]): string {
  if (lines.length === 0) throw new ValidationError('カートに商品がありません')
  for (const line of lines) {
    if (!Number.isSafeInteger(line.qty) || line.qty < 1) throw new ValidationError('数量が正しくありません')
  }
  if (lines.some((l) => l.variantId === 'bug')) throw new Error('Cannot read properties of undefined') // バグのつもり
  return '20261114-001'
}

// ---------- try / catch / finally ----------

function confirmSale(lines: Line[]): void {
  let saving = true
  let cart = lines
  console.log(`\n▶ 会計:${JSON.stringify(lines)}`)
  try {
    const saleNo = createSale(lines)
    cart = [] // カートを空にする(エラーのときはここまで来ない)
    console.log('  保存できました:', saleNo)
  } catch (e) {
    console.log('  画面に出す文:', userMessage(e))
  } finally {
    saving = false
    console.log(`  finally:saving=${saving}、カートの行数=${cart.length}`)
  }
}

confirmSale([{ variantId: 'v1', qty: 2 }]) // 成功
confirmSale([]) // ValidationError
confirmSale([{ variantId: 'v1', qty: 0 }]) // ValidationError
confirmSale([{ variantId: 'bug', qty: 1 }]) // 想定外のエラー

// ---------- instanceof ----------

const e1 = new ValidationError('数量が正しくありません')
const e2 = new RangeError('金額は0以上の整数(円)で指定してください')
console.log('\nValidationError か:', e1 instanceof ValidationError, e2 instanceof ValidationError)
console.log('Error か:', e1 instanceof Error, e2 instanceof Error)
console.log('name と message:', e1.name, '/', e1.message)
