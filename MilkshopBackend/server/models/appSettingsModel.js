const { query } = require('../config/db')
const { mergeOutcomeEmails } = require('../constants/leadEmailTemplates')
const { sanitizeEmailTemplate, sanitizeOutcomeEmails } = require('../utils/emailSanitize')

const KEYS = {
  QR_URL: 'franchise_qr_url',
  EMAIL_TEMPLATE: 'franchise_confirmation_email_template',
  OUTCOME_EMAIL_TEMPLATES: 'lead_outcome_email_templates',
}

async function getSetting(key) {
  const { rows } = await query('SELECT value FROM app_settings WHERE key = $1', [key])
  return rows[0]?.value ?? null
}

async function setSetting(key, value) {
  await query(
    `INSERT INTO app_settings (key, value, updated_at)
     VALUES ($1, $2, now())
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
    [key, value],
  )
}

function parseOutcomeEmailsJson(raw) {
  if (!raw || !String(raw).trim()) return null
  try {
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

async function getQrEmailSettings() {
  const [qrUrl, emailTemplate, outcomeEmailsRaw] = await Promise.all([
    getSetting(KEYS.QR_URL),
    getSetting(KEYS.EMAIL_TEMPLATE),
    getSetting(KEYS.OUTCOME_EMAIL_TEMPLATES),
  ])
  return {
    qrUrl: qrUrl || '',
    emailTemplate: emailTemplate || '',
    outcomeEmails: mergeOutcomeEmails(parseOutcomeEmailsJson(outcomeEmailsRaw)),
  }
}

async function updateQrEmailSettings({ qrUrl, emailTemplate, outcomeEmails }) {
  if (qrUrl !== undefined) await setSetting(KEYS.QR_URL, String(qrUrl))
  if (emailTemplate !== undefined) {
    await setSetting(KEYS.EMAIL_TEMPLATE, sanitizeEmailTemplate(emailTemplate))
  }
  if (outcomeEmails !== undefined) {
    await setSetting(
      KEYS.OUTCOME_EMAIL_TEMPLATES,
      JSON.stringify(sanitizeOutcomeEmails(outcomeEmails)),
    )
  }
  return getQrEmailSettings()
}

module.exports = {
  KEYS,
  getSetting,
  setSetting,
  getQrEmailSettings,
  updateQrEmailSettings,
}
