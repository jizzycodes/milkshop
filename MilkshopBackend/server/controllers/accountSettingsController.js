const bcrypt = require('bcrypt')
const {
  mapPublic,
  findAccountById,
  findAccountByEmail,
  listAccounts,
  createAccount,
  updateAccount,
} = require('../models/userAccountModel')

function ensureAdmin(req) {
  if (req.user?.role !== 'admin') {
    const err = new Error('Forbidden')
    err.status = 403
    throw err
  }
}

function requireNonEmpty(value, message) {
  if (!value || !String(value).trim()) {
    const err = new Error(message)
    err.status = 400
    throw err
  }
}

async function getMyAccount(req, res, next) {
  try {
    const row = await findAccountById(req.user.sub)
    if (!row) {
      const err = new Error('Account not found')
      err.status = 404
      throw err
    }
    res.json({ success: true, data: mapPublic(row) })
  } catch (err) {
    next(err)
  }
}

async function updateMyAccount(req, res, next) {
  try {
    const { username, password } = req.body || {}
    const patch = {}
    if (username !== undefined) {
      requireNonEmpty(username, 'Username is required')
      patch.username = String(username).trim()
    }
    if (password !== undefined) {
      requireNonEmpty(password, 'Password is required')
      patch.passwordHash = await bcrypt.hash(String(password), 10)
    }
    const updated = await updateAccount(req.user.sub, patch)
    if (!updated) {
      const err = new Error('Account not found')
      err.status = 404
      throw err
    }
    res.json({ success: true, data: updated })
  } catch (err) {
    next(err)
  }
}

async function getAccounts(req, res, next) {
  try {
    ensureAdmin(req)
    const data = await listAccounts()
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

async function postAccount(req, res, next) {
  try {
    ensureAdmin(req)
    const { email, username, password, role } = req.body || {}
    requireNonEmpty(email, 'Email is required')
    requireNonEmpty(username, 'Username is required')
    requireNonEmpty(password, 'Password is required')
    const safeRole = String(role || 'user').toLowerCase()
    if (!['admin', 'user'].includes(safeRole)) {
      const err = new Error('Role must be admin or user')
      err.status = 400
      throw err
    }
    const normalizedEmail = String(email).trim().toLowerCase()
    const existing = await findAccountByEmail(normalizedEmail)
    if (existing) {
      const err = new Error('Email already exists')
      err.status = 409
      throw err
    }
    const passwordHash = await bcrypt.hash(String(password), 10)
    const created = await createAccount({
      email: normalizedEmail,
      username: String(username).trim(),
      passwordHash,
      role: safeRole,
    })
    res.status(201).json({ success: true, data: created })
  } catch (err) {
    next(err)
  }
}

async function putAccount(req, res, next) {
  try {
    ensureAdmin(req)
    const accountId = req.params.id
    const { username, password, role } = req.body || {}
    const patch = {}
    if (username !== undefined) {
      requireNonEmpty(username, 'Username is required')
      patch.username = String(username).trim()
    }
    if (password !== undefined && String(password).trim() !== '') {
      patch.passwordHash = await bcrypt.hash(String(password), 10)
    }
    if (role !== undefined) {
      const safeRole = String(role).toLowerCase()
      if (!['admin', 'user'].includes(safeRole)) {
        const err = new Error('Role must be admin or user')
        err.status = 400
        throw err
      }
      patch.role = safeRole
    }
    const updated = await updateAccount(accountId, patch)
    if (!updated) {
      const err = new Error('Account not found')
      err.status = 404
      throw err
    }
    res.json({ success: true, data: updated })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getMyAccount,
  updateMyAccount,
  getAccounts,
  postAccount,
  putAccount,
}
