/**
 * Run all SQL migrations (single runner).
 * Usage: from server folder, run: node db/run-migration.js
 * Loads .env from backend root so DB_PASSWORD is set.
 */
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') })
const { Pool } = require('pg')

const url = process.env.DATABASE_URL || ''
const wantsSsl =
  String(process.env.DB_SSL || '').toLowerCase() === 'true' ||
  url.includes('neon.tech') ||
  url.includes('sslmode=require') ||
  String(process.env.DB_HOST || '').includes('neon.tech')
const sslConfig = wantsSsl ? { rejectUnauthorized: false } : undefined

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: sslConfig,
      }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER || 'postgres',
        password:
          process.env.DB_PASSWORD != null ? String(process.env.DB_PASSWORD) : '',
        database: process.env.DB_NAME || 'milkshop_backend',
        ssl: sslConfig,
      },
)

const statements = [
  'CREATE EXTENSION IF NOT EXISTS "pgcrypto"',
  // Public franchise form + admin dashboard stats (franchise_requests list)
  `CREATE TABLE IF NOT EXISTS franchise_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  contact_number varchar(100) NOT NULL,
  best_contact_time varchar(100),
  estimated_annual_income varchar(255),
  proposed_location varchar(255),
  preferred_package varchar(100),
  remarks text,
  referral varchar(255),
  created_at timestamptz NOT NULL DEFAULT now()
)`,
  'CREATE INDEX IF NOT EXISTS idx_franchise_requests_created_at ON franchise_requests(created_at)',
  'CREATE INDEX IF NOT EXISTS idx_franchise_requests_email ON franchise_requests(lower(email))',
  `CREATE TABLE IF NOT EXISTS franchise_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  contact_number varchar(100) NOT NULL,
  best_contact_time varchar(100),
  annual_income numeric,
  proposed_location varchar(255),
  package_type varchar(100),
  remarks text,
  remarks_admin text,
  referral varchar(255),
  stage varchar(50) NOT NULL DEFAULT 'REGISTERED',
  status varchar(50) NOT NULL DEFAULT 'NEW',
  contact_outcome varchar(50),
  followup_count int NOT NULL DEFAULT 0,
  next_followup_at timestamptz,
  last_contacted_at timestamptz,
  assigned_to varchar(255),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT franchise_leads_stage_check CHECK (stage IN (
    'REGISTERED','ORIENTATION','RESERVATION','ONBOARDING','CLOSED'
  )),
  CONSTRAINT franchise_leads_status_check CHECK (status IN (
    'NEW','ACTIVE','INACTIVE','FOR_FOLLOWUP','DROPPED','ARCHIVED','APPROVED'
  )),
  CONSTRAINT franchise_leads_contact_outcome_check CHECK (contact_outcome IS NULL OR contact_outcome IN (
    'NO_ANSWER','INTERESTED','NOT_INTERESTED','PAID','PRESENT','ABSENT'
  ))
)`,
  `CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql`,
  'DROP TRIGGER IF EXISTS franchise_leads_updated_at ON franchise_leads',
  `CREATE TRIGGER franchise_leads_updated_at
  BEFORE UPDATE ON franchise_leads
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at()`,
  `CREATE TABLE IF NOT EXISTS lead_contact_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES franchise_leads(id) ON DELETE CASCADE,
  contact_type varchar(20) NOT NULL,
  notes text NOT NULL DEFAULT '',
  outcome varchar(50),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT lead_contact_logs_contact_type_check CHECK (contact_type IN ('CALL','SMS','EMAIL')),
  CONSTRAINT lead_contact_logs_outcome_check CHECK (outcome IS NULL OR outcome IN (
    'NO_ANSWER','INTERESTED','NOT_INTERESTED','PAID','PAID_RESERVATION','PRESENT','ABSENT','FINISHED'
  ))
)`,
  'CREATE INDEX IF NOT EXISTS idx_lead_contact_logs_lead_id ON lead_contact_logs(lead_id)',
  'CREATE INDEX IF NOT EXISTS idx_lead_contact_logs_created_at ON lead_contact_logs(created_at)',
  // 003: contact log metadata for history table
  `ALTER TABLE lead_contact_logs
   ADD COLUMN IF NOT EXISTS next_followup_at timestamptz,
   ADD COLUMN IF NOT EXISTS created_by varchar(255)`,
  // 004: allow all outcome values
  'ALTER TABLE lead_contact_logs DROP CONSTRAINT IF EXISTS lead_contact_logs_outcome_check',
  `ALTER TABLE lead_contact_logs
   ADD CONSTRAINT lead_contact_logs_outcome_check CHECK (outcome IS NULL OR outcome IN (
     'NO_ANSWER','INTERESTED','NOT_INTERESTED','PAID','PAID_RESERVATION','PRESENT','ABSENT','FINISHED',
     'CALLBACK','CONFIRMED_SCHEDULE','ARCHIVE','DROP','CANCEL','REMIND_SUCCESS'
   ))`,
  // 009: reservation stage + paid reservation outcome
  'ALTER TABLE franchise_leads DROP CONSTRAINT IF EXISTS franchise_leads_stage_check',
  `ALTER TABLE franchise_leads
   ADD CONSTRAINT franchise_leads_stage_check CHECK (stage IN (
     'REGISTERED','ORIENTATION','RESERVATION','ONBOARDING','CLOSED'
   ))`,
  'ALTER TABLE lead_contact_logs DROP CONSTRAINT IF EXISTS lead_contact_logs_outcome_check',
  `ALTER TABLE lead_contact_logs
   ADD CONSTRAINT lead_contact_logs_outcome_check CHECK (outcome IS NULL OR outcome IN (
     'NO_ANSWER','INTERESTED','NOT_INTERESTED','PAID','PAID_RESERVATION','PRESENT','ABSENT','FINISHED',
     'CALLBACK','CONFIRMED_SCHEDULE','ARCHIVE','DROP','CANCEL','REMIND_SUCCESS'
   ))`,
  // 010: onboarding subtab storage
  `ALTER TABLE franchise_leads
   ADD COLUMN IF NOT EXISTS onboarding_step varchar(40) NOT NULL DEFAULT 'MANAGEMENT_TRAINING'`,
  `UPDATE franchise_leads
   SET onboarding_step = 'MANAGEMENT_TRAINING'
   WHERE onboarding_step IS NULL`,
  'ALTER TABLE franchise_leads DROP CONSTRAINT IF EXISTS franchise_leads_onboarding_step_check',
  `ALTER TABLE franchise_leads
   ADD CONSTRAINT franchise_leads_onboarding_step_check CHECK (onboarding_step IN (
     'MANAGEMENT_TRAINING','BARISTA_TRAINING','GRAND_OPENING'
   ))`,
  // 005: admin remarks on franchise_leads (for existing tables)
  'ALTER TABLE franchise_leads ADD COLUMN IF NOT EXISTS remarks_admin text',
  // 006: app_settings (QR URL + franchise confirmation email template)
  `CREATE TABLE IF NOT EXISTS app_settings (
    key varchar(100) PRIMARY KEY,
    value text NOT NULL,
    updated_at timestamptz NOT NULL DEFAULT now()
  )`,
  `INSERT INTO app_settings (key, value) VALUES
    ('franchise_qr_url', 'http://172.16.1.119:5173/franchise#inquiry')
  ON CONFLICT (key) DO NOTHING`,
  // 007: user_accounts (admin + user login/account settings)
  `CREATE TABLE IF NOT EXISTS user_accounts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email varchar(255) NOT NULL UNIQUE,
    username varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    role varchar(20) NOT NULL DEFAULT 'user',
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT user_accounts_role_check CHECK (role IN ('admin','user'))
  )`,
  'DROP TRIGGER IF EXISTS user_accounts_updated_at ON user_accounts',
  `CREATE TRIGGER user_accounts_updated_at
  BEFORE UPDATE ON user_accounts
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at()`,
  `DO $$
   BEGIN
     IF to_regclass('public.admin_users') IS NOT NULL THEN
       INSERT INTO user_accounts (email, username, password, role, is_active)
       SELECT a.email,
              split_part(a.email, '@', 1) AS username,
              a.password,
              'admin' AS role,
              true AS is_active
       FROM admin_users a
       ON CONFLICT (email) DO NOTHING;
     END IF;
   END $$`,
  // 008: optional schedule datetime on contact logs (e.g. onboarding Confirmed Schedule)
  'ALTER TABLE lead_contact_logs ADD COLUMN IF NOT EXISTS schedule_date_time timestamptz',
  // 011: Store Open pipeline stage + Store Opening contact outcome
  // Clear invalid legacy outcome values before applying the expanded CHECK constraint.
  `UPDATE lead_contact_logs
   SET outcome = NULL
   WHERE outcome IS NOT NULL
   AND (
     TRIM(outcome) = ''
     OR outcome NOT IN (
       'NO_ANSWER','INTERESTED','NOT_INTERESTED','PAID','PAID_RESERVATION','PRESENT','ABSENT','FINISHED',
       'CALLBACK','CONFIRMED_SCHEDULE','ARCHIVE','DROP','CANCEL','REMIND_SUCCESS','STORE_OPENING'
     )
   )`,
  'ALTER TABLE franchise_leads DROP CONSTRAINT IF EXISTS franchise_leads_stage_check',
  `ALTER TABLE franchise_leads
   ADD CONSTRAINT franchise_leads_stage_check CHECK (stage IN (
     'REGISTERED','ORIENTATION','RESERVATION','ONBOARDING','STORE_OPEN','CLOSED'
   ))`,
  'ALTER TABLE lead_contact_logs DROP CONSTRAINT IF EXISTS lead_contact_logs_outcome_check',
  `ALTER TABLE lead_contact_logs
   ADD CONSTRAINT lead_contact_logs_outcome_check CHECK (outcome IS NULL OR outcome IN (
     'NO_ANSWER','INTERESTED','NOT_INTERESTED','PAID','PAID_RESERVATION','PRESENT','ABSENT','FINISHED',
     'CALLBACK','CONFIRMED_SCHEDULE','ARCHIVE','DROP','CANCEL','REMIND_SUCCESS','STORE_OPENING'
   ))`,
]

async function run() {
  for (let i = 0; i < statements.length; i++) {
    await pool.query(statements[i])
  }
  console.log('Migrations completed (franchise_requests, CRM tables, settings, accounts).')
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Migration failed:', err.message)
    process.exit(1)
  })
  .finally(() => pool.end())
