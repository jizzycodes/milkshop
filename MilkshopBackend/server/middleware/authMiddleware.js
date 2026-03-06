const { verifyAccessToken } = require('../utils/jwt')

function authenticateAdmin(req, res, next) {
  const header = req.headers.authorization || ''
  const [, token] = header.split(' ')

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authorization token missing',
    })
  }

  try {
    const decoded = verifyAccessToken(token)
    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
      })
    }
    req.user = decoded
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

