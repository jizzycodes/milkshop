/**
 * Test SMTP from the same environment as the running API.
 * Usage (on Linode or local):
 *   cd /var/www/milkshop/MilkshopBackend
 *   node server/scripts/test-smtp.js
 * Optional: pass a recipient email as first argument.
 */
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') })

const { getSmtpStatusSummary, verifySmtpConnection, sendFranchiseConfirmation } = require('../utils/mail')

async function main() {
  const envPath = path.join(__dirname, '..', '..', '.env')
  console.log('Loading .env from:', envPath)
  console.log('SMTP status:', getSmtpStatusSummary())

  const verify = await verifySmtpConnection()
  if (!verify.ok) {
    console.error('SMTP verify FAILED:', verify.error)
    console.error('')
    console.error('Common Linode fixes:')
    console.error('  1. .env must be at MilkshopBackend/.env (not /var/www/milkshop/.env)')
    console.error('  2. Quote password if it has ! or # : SMTP_PASSWORD="your-password"')
    console.error('  3. pm2 restart all --update-env')
    console.error('  4. Linode may block outbound port 465 — open ticket to unblock SMTP')
    console.error('  5. Test port: nc -zv mail.spacemail.com 465')
    process.exit(1)
  }

  console.log('SMTP verify OK')

  const to = process.argv[2]
  if (to) {
    console.log('Sending test franchise email to:', to)
    const result = await sendFranchiseConfirmation(to, 'SMTP Test')
    if (!result.sent) {
      console.error('Send FAILED:', result.error)
      process.exit(1)
    }
    console.log('Test email sent successfully')
  } else {
    console.log('Skip send test (pass an email as argument to send a real message)')
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
