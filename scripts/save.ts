// 今日の学習をコミットする。使い方:npm run save  または  npm run save -- "第2回 関数"
// GitHub につないであれば、そのまま push もする。

import { spawnSync } from 'node:child_process'

const run = (args: string[]) => spawnSync('git', args, { encoding: 'utf8', stdio: 'pipe' })

const pad2 = (n: number) => String(n).padStart(2, '0')
const now = new Date()
const today = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`
const note = process.argv.slice(2).join(' ')
const message = note ? `学習記録 ${today}:${note}` : `学習記録 ${today}`

run(['add', '-A'])
if (run(['diff', '--cached', '--quiet']).status === 0) {
  console.log('変更がないので、コミットしませんでした。')
  process.exit(0)
}

const commit = run(['commit', '-m', message])
if (commit.status !== 0) {
  console.log(commit.stdout + commit.stderr)
  process.exit(1)
}
console.log(`コミットしました:${message}`)

if (run(['remote']).stdout.trim() === '') {
  console.log('(GitHub にはつないでいないので、push はしていません)')
  process.exit(0)
}
const push = run(['push'])
console.log(push.status === 0 ? 'GitHub に送りました。' : 'GitHub に送れませんでした:\n' + push.stderr)
process.exit(push.status === 0 ? 0 : 1)
