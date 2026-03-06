const { Pool } = require('pg')

const {
  DB_HOST = 'localhost',
  DB_PORT = 5432,
  DB_USER = 'postgres',
  DB_PASSWORD = 'joca1228',
  DB_NAME = 'milkshop_backend',
} = process.env

const pool = new Pool({
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
})

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

