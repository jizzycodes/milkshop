const { query } = require('../config/db')

const KEYS = {
  QR_URL: 'franchise_qr_url',
  EMAIL_TEMPLATE: 'franchise_confirmation_email_template',
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

async function getQrEmailSettings() {
  const [qrUrl, emailTemplate] = await Promise.all([
    getSetting(KEYS.QR_URL),
    getSetting(KEYS.EMAIL_TEMPLATE),
  ])
  return {
    qrUrl: qrUrl || '',
    emailTemplate: emailTemplate || '',
  }
}

async function updateQrEmailSettings({ qrUrl, emailTemplate }) {
  if (qrUrl !== undefined) await setSetting(KEYS.QR_URL, String(qrUrl))
  if (emailTemplate !== undefined) await setSetting(KEYS.EMAIL_TEMPLATE, String(emailTemplate))
  return getQrEmailSettings()
}

module.exports = {
  KEYS,
  getSetting,
  setSetting,
  getQrEmailSettings,
  updateQrEmailSettings,
}
