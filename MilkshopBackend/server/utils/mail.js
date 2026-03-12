const nodemailer = require('nodemailer')

const GMAIL_USER = process.env.GMAIL_USER
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD

let transporter = null

function getTransporter() {
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) return null
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
      },
    })
  }
  return transporter
}

/**
 * Send franchise inquiry confirmation to the submitter.
 * @param {string} toEmail - Recipient email
 * @param {string} name - Recipient name (e.g. "Juan")
 * @returns {Promise<{ sent: boolean, error?: string }>}
 */
async function sendFranchiseConfirmation(toEmail, name) {
  const transport = getTransporter()
  if (!transport) {
    return { sent: false, error: 'Gmail not configured (GMAIL_USER / GMAIL_APP_PASSWORD)' }
  }

  const displayName = name || 'there'
  const subject = 'Welcome to Milkshop! Your Franchise Journey Starts Here'

  const logoUrl =
    process.env.FRONTEND_PUBLIC_LOGO_URL ||
    'https://milkshop.ph/logo-landscape.png'

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #1e1e1e;">
      <div style="text-align: center; margin-bottom: 24px;">
        <img src="${logoUrl}" alt="Milkshop" style="max-width: 180px; height: auto;" />
      </div>
      <p style="margin: 0 0 16px 0;">Good day, ${escapeHtml(displayName)}!</p>
      <p style="margin: 0 0 16px 0;">
        Thank you for signing up with Milkshop Franchise! 🎉
      </p>
      <p style="margin: 0 0 16px 0;">
        We’re excited to help you explore this amazing opportunity.
      </p>
      <p style="margin: 0 0 8px 0; font-weight: 600;">What to expect:</p>
      <ul style="margin: 0 0 16px 20px; padding: 0; color: #5a5a5a;">
        <li>Our team will review your application</li>
        <li>We’ll reach out to schedule an initial call within 3–5 business days</li>
      </ul>
      <p style="margin: 0 0 16px 0;">
        If you’re ready, we’d love to connect sooner to discuss our franchise process, current promos, and answer any questions you may have.
        Just reply to this email or message us directly!
      </p>
      <p style="margin: 0 0 24px 0;">
        Looking forward to chatting with you soon!
      </p>
      <p style="margin: 0;">
        Warm regards,<br/>
        <strong>Milkshop Team</strong>
      </p>
    </div>
  `

  const text = `Good day, ${displayName}!\n
Thank you for signing up with Milkshop Franchise!\n
We’re excited to help you explore this amazing opportunity.\n
What to expect:\n
- Our team will review your application\n
- We’ll reach out to schedule an initial call within 3–5 business days\n
If you’re ready, we’d love to connect sooner to discuss our franchise process, current promos, and answer any questions you may have. Just reply to this email or message us directly!\n
Looking forward to chatting with you soon!\n
Warm regards,\n
Milkshop Team`

  try {
    await transport.sendMail({
      from: `"Milkshop Franchise" <${GMAIL_USER}>`,
      to: toEmail,
      subject,
      text,
      html,
    })
    return { sent: true }
  } catch (err) {
    return { sent: false, error: err.message }
  }
}

function escapeHtml(s) {
  if (!s) return ''
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

module.exports = {
  sendFranchiseConfirmation,
}
