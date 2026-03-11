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
  const subject = 'Milkshop Franchise – We received your inquiry'
  const html = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto;">
      <p>Hi ${escapeHtml(displayName)},</p>
      <p>Thank you for your interest in a Milkshop franchise. We've received your inquiry.</p>
      <p><strong>What happens next?</strong></p>
      <ul>
        <li>Our franchise team will review your application.</li>
        <li>We'll contact you within <strong>3–5 business days</strong> to schedule an initial call.</li>
      </ul>
      <p>If you have any urgent questions, reply to this email.</p>
      <p>Best regards,<br/>The Milkshop Franchise Team</p>
    </div>
  `
  const text = `Hi ${displayName},\n\nThank you for your interest in a Milkshop franchise. We've received your inquiry. Our team will contact you within 3–5 business days.\n\nBest regards,\nThe Milkshop Franchise Team`

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
