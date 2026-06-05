const fs = require('fs')
const path = require('path')
const sgMail = require('@sendgrid/mail')
const { getSetting, KEYS } = require('../models/appSettingsModel')

const LOGO_PATH = path.join(__dirname, '../assets/LOGOLAND.png')

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL

function isSendGridConfigured() {
  return !!(SENDGRID_API_KEY && SENDGRID_FROM_EMAIL)
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
  return String(template)
    .replace(/\(name\)/gi, safe)
    .replace(/\[client name\]/gi, safe)
}

const LEAD_OUTCOME_EMAILS = {
  DROP: {
    subject: 'Milkshop Franchise - Application Update',
    template: `Hello (name),

Thank you for your interest in franchising with Milkshop. We understand that you're unable to proceed with your franchise application at this time. Should your plans change in the future, we'd be happy to discuss opportunities with you. We look forward to welcoming you to the Milkshop family.`,
  },
  ARCHIVE: {
    subject: 'Milkshop Franchise - Staying in Touch',
    template: `Hello (name),

Thank you for your interest in Milkshop Franchising. We've attempted to reach you regarding your franchise inquiry but have been unable to connect. To keep you informed about franchise opportunities, promotions, and business updates, we may keep your contact information on file. Feel free to reach out anytime if you'd like to continue the discussion.`,
  },
  CONFIRMED_SCHEDULE: {
    subject: 'Milkshop Franchise - Schedule Confirmed',
    template: `Hello (name),

Thank you for choosing Milkshop. We are pleased to confirm that your franchise application has been received and successfully scheduled for the next stage of evaluation. Our team will contact you with further details, requirements, and instructions. We look forward to exploring this opportunity with you.`,
  },
  PAID_RESERVATION: {
    subject: 'Milkshop Franchise - Reservation Payment Received',
    template: `Hello (name),

Thank you for securing your Milkshop franchise reservation. We have successfully received your reservation payment and your preferred location is now being reserved for the evaluation process. Our franchising team will contact you shortly regarding the next requirements and steps toward franchise approval.`,
  },
  PAID: {
    subject: 'Milkshop Franchise - Franchise Fee Payment Received',
    template: `Hello (name),

Congratulations! We have successfully received your Milkshop Franchise Fee payment. You are now officially moving forward as a Milkshop Franchise Partner. Our team will coordinate with you regarding onboarding, store development, training, and the succeeding phases of your franchise journey. We look forward to building a successful business together.`,
  },
  CANCEL: {
    subject: 'Milkshop Franchise - Schedule Cancelled',
    template: `Hello (name),

Thank you for your interest in Milkshop Franchising. We understand that you need to cancel or postpone your scheduled franchise meeting. No worries—our team will be happy to assist you in arranging a new schedule at your convenience. Simply contact us when you're ready to continue your franchise journey with Milkshop. We look forward to speaking with you soon.`,
  },
}

async function sendTemplatedEmail(toEmail, name, subject, template) {
  if (!isSendGridConfigured()) {
    return {
      sent: false,
      error: 'SendGrid not configured (SENDGRID_API_KEY / SENDGRID_FROM_EMAIL)',
    }
  }

  sgMail.setApiKey(SENDGRID_API_KEY)

  const textBody = applyNamePlaceholders(template, name)
  const logoSrc = getLogoSrc()
  const htmlBody = escapeHtml(textBody).replace(/\r\n/g, '\n').replace(/\n/g, '<br/>')

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #1e1e1e;">
      <div style="text-align: center; margin-bottom: 24px;">
        <img src="${logoSrc}" alt="Milkshop" style="max-width: 180px; height: auto;" />
      </div>
      <div style="line-height: 1.6;">${htmlBody}</div>
    </div>
  `

  try {
    await sgMail.send({
      to: toEmail,
      from: {
        email: SENDGRID_FROM_EMAIL,
        name: 'Milkshop Franchise',
      },
      subject,
      text: textBody,
      html,
    })
    return { sent: true }
  } catch (err) {
    const message =
      err?.response?.body?.errors?.[0]?.message || err.message || 'SendGrid send failed'
    return { sent: false, error: message }
  }
}

function getLogoSrc() {
  if (fs.existsSync(LOGO_PATH)) {
    const base64 = fs.readFileSync(LOGO_PATH).toString('base64')
    return `data:image/png;base64,${base64}`
  }

  return (
    process.env.FRONTEND_PUBLIC_LOGO_URL ||
    'https://milkshop.ph/logo-landscape.png'
  )
}

/**
 * Send franchise inquiry confirmation to the submitter.
 * Body text comes from app_settings (admin Qr & Email); use (name) for the recipient.
 */
async function sendFranchiseConfirmation(toEmail, name) {
  const subject = 'Welcome to Milkshop! Your Franchise Journey Starts Here'

  let template = await getSetting(KEYS.EMAIL_TEMPLATE)
  if (!template || !String(template).trim()) {
    template = DEFAULT_FRANCHISE_TEMPLATE
  }

  return sendTemplatedEmail(toEmail, name, subject, template)
}

async function sendLeadOutcomeEmail(outcome, toEmail, name) {
  const config = LEAD_OUTCOME_EMAILS[outcome]
  if (!config) {
    return { sent: false, error: `No email template for outcome: ${outcome}` }
  }
  if (!toEmail || !String(toEmail).trim()) {
    return { sent: false, error: 'Lead has no email address' }
  }

  return sendTemplatedEmail(toEmail, name, config.subject, config.template)
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
  sendLeadOutcomeEmail,
}
