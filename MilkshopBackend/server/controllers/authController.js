const bcrypt = require('bcrypt')
const { findAdminByEmail } = require('../models/adminUserModel')
const { signAccessToken } = require('../utils/jwt')

function validateLoginPayload(body) {
  if (!body.email || !body.password) {
    const error = new Error('Email and password are required')
    error.status = 400
    throw error
  }
}

async function login(req, res, next) {
  try {
    validateLoginPayload(req.body)

    const email = String(req.body.email).trim()
    const password = String(req.body.password)

    const admin = await findAdminByEmail(email)

    if (!admin) {
      const error = new Error('Invalid credentials')
      error.status = 401
      throw error
    }

    const passwordMatches = await bcrypt.compare(password, admin.password)

    if (!passwordMatches) {
      const error = new Error('Invalid credentials')
      error.status = 401
      throw error
    }

    const token = signAccessToken({
      sub: admin.id,
      email: admin.email,
      role: 'admin',
    })

    res.json({
      success: true,
      token,
      data: {
        id: admin.id,
        email: admin.email,
      },
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  login,
}

