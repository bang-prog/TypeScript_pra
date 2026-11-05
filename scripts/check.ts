// 演習の採点。使い方:npm run check 03
// その回のテスト(vitest)と型チェック(tsc)を実行し、その回のファイルの結果だけを表示する。

import { spawnSync } from 'node:child_process'
import { readdirSync } from 'node:fs'

const no = (process.argv[2] ?? '').padStart(2, '0')
const lesson = readdirSync('lessons').find((name) => name.startsWith(`${no}-`))
if (!lesson) {
  console.log('回の番号を指定してください。例:npm run check 03')
  process.exit(1)
}

const run = (command: string) => spawnSync(command, { shell: true, encoding: 'utf8', stdio: 'pipe' })

console.log(`\n===== 第${Number(no)}回(${lesson})の採点 =====\n`)

console.log('■ テスト')
const test = run(`npx vitest run lessons/${lesson}`)
process.stdout.write(test.stdout + test.stderr)

console.log('■ 型チェック')
const tsc = run('npx tsc --noEmit --pretty false')
const errors = tsc.stdout.split('\n').filter((line) => line.replaceAll('\\', '/').includes(`lessons/${lesson}/`))
if (errors.length === 0) console.log('型エラーはありません')
else console.log(errors.join('\n'))

const passed = test.status === 0 && errors.length === 0
console.log(passed ? '\n🎉 合格!Claude に「第' + Number(no) + '回の答え合わせをして」と言ってみてください。' : '\n❌ まだ直すところがあります。')
process.exit(passed ? 0 : 1)
