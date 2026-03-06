# Database migrations

- `migrations/001_phase1_franchise_leads.sql` – creates `franchise_leads` and `lead_contact_logs`.
- `migrations/002_add_best_contact_at.sql` – adds `best_contact_at` (timestamptz) to `franchise_leads`.
- Run via Node (recommended): from repo root, `node server/db/run-migration.js` (uses `.env`).
- Or run each SQL file in pgAdmin/psql against `milkshop_backend`.
