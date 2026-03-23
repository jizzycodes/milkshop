const { query } = require('../config/db')

function mapPublic(row) {
  if (!row) return null
  return {
    id: row.id,
    email: row.email,
    username: row.username,
    role: row.role,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

async function findAccountByEmail(email) {
  const result = await query(
    `SELECT id, email, username, password, role, is_active, created_at, updated_at
     FROM user_accounts WHERE lower(email) = lower($1) LIMIT 1`,
    [email],
  )
  return result.rows[0] || null
}

async function findAccountById(id) {
  const result = await query(
    `SELECT id, email, username, password, role, is_active, created_at, updated_at
     FROM user_accounts WHERE id = $1 LIMIT 1`,
    [id],
  )
  return result.rows[0] || null
}

async function listAccounts() {
  const result = await query(
    `SELECT id, email, username, role, is_active, created_at, updated_at
     FROM user_accounts
     ORDER BY role ASC, created_at DESC`,
  )
  return result.rows.map(mapPublic)
}

async function createAccount({ email, username, passwordHash, role }) {
  const result = await query(
    `INSERT INTO user_accounts (email, username, password, role, is_active)
     VALUES ($1, $2, $3, $4, true)
     RETURNING id, email, username, role, is_active, created_at, updated_at`,
    [email, username, passwordHash, role],
  )
  return mapPublic(result.rows[0])
}

async function updateAccount(id, fields) {
  const sets = []
  const params = []
  let idx = 1

  if (fields.username !== undefined) {
    sets.push(`username = $${idx++}`)
    params.push(fields.username)
  }
  if (fields.email !== undefined) {
    sets.push(`email = $${idx++}`)
    params.push(fields.email)
  }
  if (fields.passwordHash !== undefined) {
    sets.push(`password = $${idx++}`)
    params.push(fields.passwordHash)
  }
  if (fields.role !== undefined) {
    sets.push(`role = $${idx++}`)
    params.push(fields.role)
  }
  if (fields.isActive !== undefined) {
    sets.push(`is_active = $${idx++}`)
    params.push(Boolean(fields.isActive))
  }

  if (sets.length === 0) {
    const current = await findAccountById(id)
    return mapPublic(current)
  }

  params.push(id)
  const result = await query(
    `UPDATE user_accounts
     SET ${sets.join(', ')}, updated_at = now()
     WHERE id = $${idx}
     RETURNING id, email, username, role, is_active, created_at, updated_at`,
    params,
  )
  return mapPublic(result.rows[0] || null)
}

module.exports = {
  mapPublic,
  findAccountByEmail,
  findAccountById,
  listAccounts,
  createAccount,
  updateAccount,
}
