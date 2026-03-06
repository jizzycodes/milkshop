-- Add best_contact_at for Register phase (NEW / FOR_FOLLOWUP auto-move and franchise form).
ALTER TABLE franchise_leads
  ADD COLUMN IF NOT EXISTS best_contact_at timestamptz;
