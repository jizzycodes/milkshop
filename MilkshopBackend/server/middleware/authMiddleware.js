const { findOrCreateAccountFromFirebase } = require('../models/userAccountModel')
const {
  isFirebaseAdminConfigured,
  verifyFirebaseIdToken,
} = require('../utils/firebaseAdmin')

function readBearerToken(req) {
  const header = req.headers.authorization || ''
  const [, token] = header.split(' ')
  return token || null
}

function attachUserFromAccount(req, account) {
  req.user = {
    sub: String(account.id),
    email: account.email,
    username: account.username || account.email,
    role: account.role,
  }
}

async function authenticateAdmin(req, res, next) {
  const token = readBearerToken(req)

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authorization token missing',
    })
  }

  if (!isFirebaseAdminConfigured()) {
    return res.status(503).json({
      success: false,
      error: 'Firebase Admin is not configured on the server.',
    })
  }

  try {
    const decoded = await verifyFirebaseIdToken(token)
    const email = decoded.email

    if (!email) {
      return res.status(403).json({
        success: false,
        error: 'Firebase account has no email address.',
      })
    }

    const account = await findOrCreateAccountFromFirebase(email)

    if (!account) {
      return res.status(403).json({
        success: false,
        error: 'Unable to link Firebase account to admin database.',
      })
    }

    if (!account.is_active) {
      return res.status(403).json({
        success: false,
        error: 'This admin account is disabled.',
      })
    }

    attachUserFromAccount(req, account)
    return next()
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
    })
  }
}

module.exports = {
  authenticateAdmin,
}
