-- Extra fields for contact history UI
ALTER TABLE lead_contact_logs
  ADD COLUMN IF NOT EXISTS next_followup_at timestamptz,
  ADD COLUMN IF NOT EXISTS created_by varchar(255);

