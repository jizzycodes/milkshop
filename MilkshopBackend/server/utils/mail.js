const nodemailer = require('nodemailer')
const { getSetting, KEYS } = require('../models/appSettingsModel')

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

/** Fallback if DB has no template yet — use literal (name) in the body. */
const DEFAULT_FRANCHISE_TEMPLATE = `Good day, (name)!

Thank you for signing up with Milkshop Franchise! 🎉

We're excited to help you explore this amazing opportunity.

What to expect:

Our team will review your application
We'll reach out to schedule an initial call within 3–5 business days
If you're ready, we'd love to connect sooner to discuss our franchise process, current promos, and answer any questions you may have. Just reply to this email or message us directly!

Looking forward to chatting with you soon!

Warm regards,
Milkshop Team`

function applyNamePlaceholders(template, displayName) {
  const safe = displayName || 'there'
  return String(template).replace(/\(name\)/gi, safe)
}

/**
 * Send franchise inquiry confirmation to the submitter.
 * Body text comes from app_settings (admin Qr & Email); use (name) for the recipient.
 */
async function sendFranchiseConfirmation(toEmail, name) {
  const transport = getTransporter()
  if (!transport) {
    return { sent: false, error: 'Gmail not configured (GMAIL_USER / GMAIL_APP_PASSWORD)' }
  }

  const displayName = name || 'there'
  const subject = 'Welcome to Milkshop! Your Franchise Journey Starts Here'

  let template = await getSetting(KEYS.EMAIL_TEMPLATE)
  if (!template || !String(template).trim()) {
    template = DEFAULT_FRANCHISE_TEMPLATE
  }

  const textBody = applyNamePlaceholders(template, displayName)

  const logoUrl =
    process.env.FRONTEND_PUBLIC_LOGO_URL ||
    'https://milkshop.ph/logo-landscape.png'

  const htmlBody = escapeHtml(textBody).replace(/\r\n/g, '\n').replace(/\n/g, '<br/>')

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #1e1e1e;">
      <div style="text-align: center; margin-bottom: 24px;">
        <img src="${logoUrl}" alt="Milkshop" style="max-width: 180px; height: auto;" />
      </div>
      <div style="line-height: 1.6;">${htmlBody}</div>
    </div>
  `

  try {
    await transport.sendMail({
      from: `"Milkshop Franchise" <${GMAIL_USER}>`,
      to: toEmail,
      subject,
      text: textBody,
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
