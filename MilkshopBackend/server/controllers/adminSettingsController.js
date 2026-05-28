const {
  getQrEmailSettings,
  updateQrEmailSettings,
} = require('../models/appSettingsModel')

function ensureAdmin(req) {
  if (req.user?.role !== 'admin') {
    const err = new Error('Forbidden')
    err.status = 403
    throw err
  }
}

async function getQrEmail(req, res, next) {
  try {
    ensureAdmin(req)
    const data = await getQrEmailSettings()
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

async function putQrEmail(req, res, next) {
  try {
    ensureAdmin(req)
    const { qrUrl, emailTemplate } = req.body || {}
    const data = await updateQrEmailSettings({
      qrUrl,
      emailTemplate,
    })
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getQrEmail,
  putQrEmail,
}
