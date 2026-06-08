/**
 * @deprecated Use test-email.js instead.
 */
const { spawnSync } = require('child_process')
const path = require('path')

console.warn('test-smtp.js is deprecated. Use: node server/scripts/test-email.js --send-test you@example.com')

const args = process.argv.slice(2)
const forwarded = args[0] && !args[0].startsWith('--') ? ['--send-test', ...args] : args

const result = spawnSync(process.execPath, [path.join(__dirname, 'test-email.js'), ...forwarded], {
  stdio: 'inherit',
})

process.exit(result.status ?? 1)
