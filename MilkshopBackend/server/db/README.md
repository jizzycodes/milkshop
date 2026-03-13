# Database migrations

- `run-migration.js` runs 001 (franchise_leads + lead_contact_logs) plus 003 (next_followup_at, created_by on lead_contact_logs) and 004 (outcome check).
- **Run**: From **MilkshopBackend** folder: `node server/db/run-migration.js`. Uses `.env` in backend root; ensure `DB_PASSWORD` is set.
- Or run each SQL in `migrations/` via pgAdmin/psql against `milkshop_backend`.
