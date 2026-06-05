const fs = require('fs')
const path = require('path')
const sgMail = require('@sendgrid/mail')
const { getSetting, KEYS } = require('../models/appSettingsModel')
const {
  DEFAULT_FRANCHISE_CONFIRMATION_TEMPLATE,
  DEFAULT_LEAD_OUTCOME_EMAILS,
  mergeOutcomeEmails,
} = require('../constants/leadEmailTemplates')

const LOGO_PATH = path.join(__dirname, '../assets/LOGOLAND.png')

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL

function isSendGridConfigured() {
  return !!(SENDGRID_API_KEY && SENDGRID_FROM_EMAIL)
}

function applyNamePlaceholders(template, displayName) {
  const safe = displayName || 'there'
  return String(template)
    .replace(/\(name\)/gi, safe)
    .replace(/\[client name\]/gi, safe)
}

async function getOutcomeEmailConfig(outcome) {
  const defaults = DEFAULT_LEAD_OUTCOME_EMAILS[outcome]
  if (!defaults) return null

  const raw = await getSetting(KEYS.OUTCOME_EMAIL_TEMPLATES)
  let stored = null
  if (raw && String(raw).trim()) {
    try {
      stored = JSON.parse(raw)
    } catch {
      stored = null
    }
  }

  const merged = mergeOutcomeEmails(stored)
  return merged[outcome] || defaults
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
    template = DEFAULT_FRANCHISE_CONFIRMATION_TEMPLATE
  }

  return sendTemplatedEmail(toEmail, name, subject, template)
}

async function sendLeadOutcomeEmail(outcome, toEmail, name) {
  const config = await getOutcomeEmailConfig(outcome)
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
