const jwt = require('jsonwebtoken')
const { requireEnv } = require('./env')

function signAccessToken(payload) {
  const secret = requireEnv('JWT_SECRET')
  const expiresIn = process.env.JWT_EXPIRES_IN || '1h'

  return jwt.sign(payload, secret, { expiresIn })
}

function verifyAccessToken(token) {
  const secret = requireEnv('JWT_SECRET')
  return jwt.verify(token, secret)
}

module.exports = {
  signAccessToken,
  verifyAccessToken,
}

