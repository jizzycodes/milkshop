const {
  getQrEmailSettings,
  updateQrEmailSettings,
} = require('../models/appSettingsModel')

async function getQrEmail(req, res, next) {
  try {
    const data = await getQrEmailSettings()
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

async function putQrEmail(req, res, next) {
  try {
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
