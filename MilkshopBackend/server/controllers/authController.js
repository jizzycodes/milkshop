const bcrypt = require('bcrypt')
const { findAdminByEmail } = require('../models/adminUserModel')
const { findAccountByEmail } = require('../models/userAccountModel')
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

    const account = await findAccountByEmail(email)
    const legacyAdmin = account ? null : await findAdminByEmail(email)
    const subject = account || legacyAdmin

    if (!subject) {
      const error = new Error('Invalid credentials')
      error.status = 401
      throw error
    }

    const passwordMatches = await bcrypt.compare(password, subject.password)

    if (!passwordMatches) {
      const error = new Error('Invalid credentials')
      error.status = 401
      throw error
    }

    const token = signAccessToken({
      sub: subject.id,
      email: subject.email,
      username: subject.username || subject.email,
      role: subject.role || 'admin',
    })

    res.json({
      success: true,
      token,
      data: {
        id: subject.id,
        email: subject.email,
        username: subject.username || subject.email,
        role: subject.role || 'admin',
      },
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  login,
}

