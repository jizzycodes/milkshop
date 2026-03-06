const { query } = require('../config/db')

async function findAdminByEmail(email) {
  const result = await query('SELECT id, email, password, created_at FROM admin_users WHERE email = $1', [email])
  return result.rows[0] || null
}

async function getAdminCount() {
  const result = await query('SELECT COUNT(*)::int AS count FROM admin_users')
  return result.rows[0].count
}

module.exports = {
  findAdminByEmail,
  getAdminCount,
}

