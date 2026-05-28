const { Pool } = require('pg')

const {
  DATABASE_URL,
  DB_HOST = 'localhost',
  DB_PORT = 5432,
  DB_USER = 'postgres',
  DB_PASSWORD = 'joca1228',
  DB_NAME = 'milkshop_backend',
  DB_SSL,
} = process.env

const isProd = process.env.NODE_ENV === 'production'
const url = DATABASE_URL || ''
const wantsSsl =
  String(DB_SSL || '').toLowerCase() === 'true' ||
  url.includes('neon.tech') ||
  url.includes('sslmode=require') ||
  DB_HOST.includes('neon.tech')
const sslConfig = wantsSsl ? { rejectUnauthorized: false } : undefined
console.log('SSL enabled:', wantsSsl, '| sslConfig:', sslConfig)
const pool = new Pool(
  DATABASE_URL
    ? {
        connectionString: DATABASE_URL,
        ssl: sslConfig,
      }
    : {
        host: DB_HOST,
        port: Number(DB_PORT),
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
        ssl: sslConfig,
      },
)

pool.on('error', (err) => {
  // Central place to log unexpected idle client errors
  console.error('Unexpected error on idle PostgreSQL client', err)
})

const query = (text, params) => pool.query(text, params)

const getClient = () => pool.connect()

module.exports = {
  pool,
  query,
  getClient,
}

