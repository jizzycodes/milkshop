const nodemailer = require('nodemailer')
const { getSetting, KEYS } = require('../models/appSettingsModel')
const {
  DEFAULT_FRANCHISE_CONFIRMATION_TEMPLATE,
  DEFAULT_LEAD_OUTCOME_EMAILS,
  mergeOutcomeEmails,
} = require('../constants/leadEmailTemplates')

const SENDGRID_API_URL = 'https://api.sendgrid.com/v3/mail/send'

function getSmtpConfig() {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT) || 465
  const secure = process.env.SMTP_SECURE !== 'false'
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASSWORD
  const from = process.env.SMTP_FROM
  return { host, port, secure, user, pass, from }
}

function getSendGridConfig() {
  return {
    apiKey: process.env.SENDGRID_API_KEY,
    fromEmail: process.env.SENDGRID_FROM_EMAIL,
    fromName: process.env.SENDGRID_FROM_NAME || 'Milkshop Franchise',
  }
}

function isSmtpConfigured() {
  const { host, user, pass, from } = getSmtpConfig()
  return !!(host && user && pass && from)
}

function isSendGridConfigured() {
  const { apiKey, fromEmail } = getSendGridConfig()
  return !!(apiKey && fromEmail)
}

/**
 * auto: SendGrid if SENDGRID_API_KEY is set, else SMTP.
 * sendgrid | smtp: force a provider.
 */
function getEmailProvider() {
  const mode = String(process.env.EMAIL_PROVIDER || 'auto').trim().toLowerCase()
  if (mode === 'sendgrid') {
    return isSendGridConfigured() ? 'sendgrid' : null
  }
  if (mode === 'smtp') {
    return isSmtpConfigured() ? 'smtp' : null
  }
  if (isSendGridConfigured()) return 'sendgrid'
  if (isSmtpConfigured()) return 'smtp'
  return null
}

function isEmailConfigured() {
  return getEmailProvider() != null
}

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

function getSendGridStatusSummary() {
  const { fromEmail, fromName } = getSendGridConfig()
  if (!isSendGridConfigured()) {
    const missing = []
    if (!process.env.SENDGRID_API_KEY) missing.push('SENDGRID_API_KEY')
    if (!fromEmail) missing.push('SENDGRID_FROM_EMAIL')
    return { configured: false, missing }
  }
  return {
    configured: true,
    fromEmail,
    fromName,
    apiKeyPrefix: `${String(process.env.SENDGRID_API_KEY).slice(0, 6)}...`,
  }
}

function getEmailStatusSummary() {
  const provider = getEmailProvider()
  return {
    provider: provider || 'none',
    mode: process.env.EMAIL_PROVIDER || 'auto',
    sendgrid: getSendGridStatusSummary(),
    smtp: getSmtpStatusSummary(),
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

async function sendViaSendGrid(toEmail, subject, textBody, html) {
  const { apiKey, fromEmail, fromName } = getSendGridConfig()
  const response = await fetch(SENDGRID_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: toEmail }] }],
      from: { email: fromEmail, name: fromName },
      subject,
      content: [
        { type: 'text/plain', value: textBody },
        { type: 'text/html', value: html },
      ],
    }),
  })

  if (!response.ok) {
    let detail = response.statusText || 'Send failed'
    try {
      const body = await response.json()
      if (Array.isArray(body.errors) && body.errors.length > 0) {
        detail = body.errors.map((e) => e.message).join('; ')
      } else if (body.message) {
        detail = body.message
      }
    } catch {
      // ignore JSON parse errors
    }
    const err = new Error(`SendGrid HTTP ${response.status}: ${detail}`)
    err.status = response.status
    throw err
  }
}

async function sendEmail(toEmail, subject, textBody, html) {
  const provider = getEmailProvider()
  if (provider === 'sendgrid') {
    await sendViaSendGrid(toEmail, subject, textBody, html)
    return
  }
  if (provider === 'smtp') {
    await sendViaSmtp(toEmail, subject, textBody, html)
    return
  }
  throw new Error('Email not configured (set SendGrid or SMTP env vars)')
}

async function sendTemplatedEmail(toEmail, name, subject, template) {
  if (!isEmailConfigured()) {
    const status = getEmailStatusSummary()
    return {
      sent: false,
      error: `Email not configured (provider=${status.provider})`,
    }
  }

  const { textBody, html } = buildEmailContent(name, subject, template)
  const provider = getEmailProvider()

  try {
    await sendEmail(toEmail, subject, textBody, html)
    return { sent: true, provider }
  } catch (err) {
    const code = err.code ? ` [${err.code}]` : ''
    const message = `${err.message || 'Email send failed'}${code}`
    // eslint-disable-next-line no-console
    console.error(`[${provider === 'sendgrid' ? 'SendGrid' : 'SMTP'}] Send failed:`, message)
    return { sent: false, error: message, provider }
  }
}

function getLogoSrc() {
  // Never inline the local PNG as base64 — LOGOLAND.png is ~800KB+ and Gmail clips HTML over ~102KB.
  const envUrl =
    process.env.EMAIL_LOGO_URL ||
    process.env.FRONTEND_PUBLIC_LOGO_URL ||
    ''
  if (String(envUrl).trim()) {
    return String(envUrl).trim()
  }
  return 'https://milk-shop.ph/mlogo.webp'
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

async function verifySendGridConnection() {
  if (!isSendGridConfigured()) {
    return { ok: false, error: 'SendGrid not configured', status: getSendGridStatusSummary() }
  }
  try {
    const response = await fetch('https://api.sendgrid.com/v3/scopes', {
      headers: {
        Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
      },
    })
    if (!response.ok) {
      let detail = response.statusText
      try {
        const body = await response.json()
        detail = body.errors?.map((e) => e.message).join('; ') || body.message || detail
      } catch {
        // ignore
      }
      return {
        ok: false,
        error: `SendGrid HTTP ${response.status}: ${detail}`,
        status: getSendGridStatusSummary(),
      }
    }
    return { ok: true, status: getSendGridStatusSummary() }
  } catch (err) {
    return {
      ok: false,
      error: err.message || 'SendGrid verify failed',
      status: getSendGridStatusSummary(),
    }
  }
}

async function verifyEmailConnection() {
  const provider = getEmailProvider()
  if (!provider) {
    return {
      ok: false,
      error: 'No email provider configured',
      provider: null,
      status: getEmailStatusSummary(),
    }
  }
  if (provider === 'sendgrid') {
    const result = await verifySendGridConnection()
    return { ...result, provider }
  }
  const result = await verifySmtpConnection()
  return { ...result, provider }
}

module.exports = {
  sendFranchiseConfirmation,
  sendLeadOutcomeEmail,
  getEmailProvider,
  getEmailStatusSummary,
  getSmtpStatusSummary,
  getSendGridStatusSummary,
  verifyEmailConnection,
  verifySmtpConnection,
  verifySendGridConnection,
}
