-- Optional onboarding "confirmed schedule" datetime (per contact log row).
ALTER TABLE lead_contact_logs
  ADD COLUMN IF NOT EXISTS schedule_date_time timestamptz;
