const fs = require('fs')
const path = require('path')
const nodemailer = require('nodemailer')
const { getSetting, KEYS } = require('../models/appSettingsModel')
const {
  DEFAULT_FRANCHISE_CONFIRMATION_TEMPLATE,
  DEFAULT_LEAD_OUTCOME_EMAILS,
  mergeOutcomeEmails,
} = require('../constants/leadEmailTemplates')

const LOGO_PATH = path.join(__dirname, '../assets/LOGOLAND.png')

function getSmtpConfig() {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT) || 465
  const secure = process.env.SMTP_SECURE !== 'false'
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASSWORD
  const from = process.env.SMTP_FROM
  return { host, port, secure, user, pass, from }
}

function isSmtpConfigured() {
  const { host, user, pass, from } = getSmtpConfig()
  return !!(host && user && pass && from)
}

function isEmailConfigured() {
  return isSmtpConfigured()
}

/** Safe summary for logs — never prints password. */
function getSmtpStatusSummary() {
  const { host, port, secure, user, from } = getSmtpConfig()
  if (!isSmtpConfigured()) {
    const missing = []
    if (!host) missing.push('SMTP_HOST')
    if (!user) missing.push('SMTP_USER')
    if (!process.env.SMTP_PASSWORD) missing.push('SMTP_PASSWORD')
    if (!from) missing.push('SMTP_FROM')
    return { configured: false, missing }
  }
  return {
    configured: true,
    host,
    port,
    secure,
    user,
    from,
  }
}

let smtpTransporter = null
let smtpTransporterKey = ''

function getSmtpTransporter() {
  const { host, port, secure, user, pass } = getSmtpConfig()
  const key = `${host}|${port}|${secure}|${user}|${pass}`
  if (!smtpTransporter || smtpTransporterKey !== key) {
    smtpTransporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 20000,
      tls: {
        minVersion: 'TLSv1.2',
        servername: host,
      },
    })
    smtpTransporterKey = key
  }
  return smtpTransporter
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

function buildEmailContent(name, subject, template) {
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

  return { textBody, html, subject }
}

async function sendViaSmtp(toEmail, subject, textBody, html) {
  const { from } = getSmtpConfig()
  const transporter = getSmtpTransporter()
  await transporter.sendMail({
    from: `"Milkshop Franchise" <${from}>`,
    to: toEmail,
    subject,
    text: textBody,
    html,
  })
}

async function sendTemplatedEmail(toEmail, name, subject, template) {
  if (!isEmailConfigured()) {
    return {
      sent: false,
      error: 'Email not configured (SMTP_* env vars)',
    }
  }

  const { textBody, html } = buildEmailContent(name, subject, template)

  try {
    await sendViaSmtp(toEmail, subject, textBody, html)
    return { sent: true }
  } catch (err) {
    const code = err.code ? ` [${err.code}]` : ''
    const message = `${err.message || 'Email send failed'}${code}`
    // eslint-disable-next-line no-console
    console.error('[SMTP] Send failed:', message)
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

async function verifySmtpConnection() {
  if (!isSmtpConfigured()) {
    return { ok: false, error: 'SMTP not configured', status: getSmtpStatusSummary() }
  }
  try {
    await getSmtpTransporter().verify()
    return { ok: true, status: getSmtpStatusSummary() }
  } catch (err) {
    const code = err.code ? ` [${err.code}]` : ''
    return {
      ok: false,
      error: `${err.message || 'SMTP verify failed'}${code}`,
      status: getSmtpStatusSummary(),
    }
  }
}

module.exports = {
  sendFranchiseConfirmation,
  sendLeadOutcomeEmail,
  getSmtpStatusSummary,
  verifySmtpConnection,
}
