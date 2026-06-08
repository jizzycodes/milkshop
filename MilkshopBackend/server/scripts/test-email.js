/**
 * Diagnose and test email (SendGrid or SMTP).
 * Usage:
 *   cd MilkshopBackend
 *   node server/scripts/test-email.js
 *   node server/scripts/test-email.js --send-test you@example.com
 */
const path = require('path')
const net = require('net')
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') })

const {
  getEmailStatusSummary,
  getEmailProvider,
  verifyEmailConnection,
  sendFranchiseConfirmation,
} = require('../utils/mail')

function checkTcpPort(host, port, timeoutMs = 8000) {
  return new Promise((resolve) => {
    const socket = new net.Socket()
    let settled = false

    const finish = (open) => {
      if (settled) return
      settled = true
      socket.destroy()
      resolve(open)
    }

    socket.setTimeout(timeoutMs)
    socket.once('connect', () => finish(true))
    socket.once('timeout', () => finish(false))
    socket.once('error', () => finish(false))
    socket.connect(port, host)
  })
}

async function main() {
  const envPath = path.join(__dirname, '..', '..', '.env')
  const sendTestArg = process.argv.indexOf('--send-test')
  const to = sendTestArg >= 0 ? process.argv[sendTestArg + 1] : null

  console.log('Loading .env from:', envPath)
  console.log('')

  const status = getEmailStatusSummary()
  const provider = getEmailProvider()
  console.log('Email provider mode:', status.mode)
  console.log('Active provider:', provider || 'NONE')
  console.log('SendGrid:', status.sendgrid)
  console.log('SMTP:', status.smtp)
  console.log('')

  if (status.smtp.configured) {
    const host = status.smtp.host
    const open465 = await checkTcpPort(host, 465)
    const open587 = await checkTcpPort(host, 587)
    console.log(`SMTP port check (${host}):`)
    console.log(`  465: ${open465 ? 'OPEN' : 'BLOCKED'}`)
    console.log(`  587: ${open587 ? 'OPEN' : 'BLOCKED'}`)
    if (!open465 && !open587 && provider === 'smtp') {
      console.log('  Tip: Linode blocks SMTP — set EMAIL_PROVIDER=sendgrid and SENDGRID_API_KEY')
    }
    console.log('')
  }

  const verify = await verifyEmailConnection()
  if (!verify.ok) {
    console.error('Email verify FAILED:', verify.error)
    process.exit(1)
  }

  console.log(`Email verify OK (${verify.provider})`)

  if (to) {
    console.log('Sending franchise test email to:', to)
    const result = await sendFranchiseConfirmation(to, 'Email Test')
    if (!result.sent) {
      console.error('Send FAILED:', result.error)
      process.exit(1)
    }
    console.log(`Test email sent via ${result.provider}`)
  } else {
    console.log('Skip send (use: node server/scripts/test-email.js --send-test you@example.com)')
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
