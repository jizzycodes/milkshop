/**
 * Migration runner — file-based with tracking.
 * Usage: from server folder, run: node db/run-migration.js
 * Loads .env from backend root so DB_PASSWORD is set.
 */
const path = require('path')
const fs = require('fs')
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') })
const { Pool } = require('pg')

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD != null ? String(process.env.DB_PASSWORD) : undefined,
  database: process.env.DB_NAME || 'milkshop_backend',
})

const MIGRATIONS_DIR = path.join(__dirname, 'migrations')

async function run() {
  const client = await pool.connect()

  try {
    // Step 1: Create tracking table if it does not exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id serial PRIMARY KEY,
        filename varchar(255) NOT NULL UNIQUE,
        applied_at timestamptz NOT NULL DEFAULT now()
      )
    `)
    console.log('✔ schema_migrations table ready.')

    // Step 2: Get already applied migrations
    const { rows: applied } = await client.query('SELECT filename FROM schema_migrations')
    const appliedFiles = new Set(applied.map(r => r.filename))

    // Step 3: Read all migration files sorted by name
    const files = fs.readdirSync(MIGRATIONS_DIR)
      .filter(f => f.endsWith('.sql'))
      .sort()

    if (files.length === 0) {
      console.log('No migration files found in', MIGRATIONS_DIR)
      return
    }

    let ranCount = 0

    for (const file of files) {
      if (appliedFiles.has(file)) {
        console.log(`⏭  Skipping (already applied): ${file}`)
        continue
      }

      const filePath = path.join(MIGRATIONS_DIR, file)
      const sql = fs.readFileSync(filePath, 'utf8')

      try {
        await client.query('BEGIN')
        await client.query(sql)
        await client.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [file])
        await client.query('COMMIT')
        console.log(`✔ Applied: ${file}`)
        ranCount++
      } catch (err) {
        await client.query('ROLLBACK')
        console.error(`✘ Failed: ${file}`)
        console.error(`  Error: ${err.message}`)
        throw err
      }
    }

    if (ranCount === 0) {
      console.log('✔ All migrations already applied. Nothing to run.')
    } else {
      console.log(`✔ Migrations completed. ${ranCount} file(s) applied.`)
    }

  } finally {
    client.release()
  }
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Migration runner failed:', err.message)
    process.exit(1)
  })
  .finally(() => pool.end())
