-- Add FINISHED outcome and onboarding_step subtabs for ONBOARDING stage.
ALTER TABLE lead_contact_logs
  DROP CONSTRAINT IF EXISTS lead_contact_logs_outcome_check;

ALTER TABLE lead_contact_logs
  ADD CONSTRAINT lead_contact_logs_outcome_check CHECK (outcome IS NULL OR outcome IN (
    'NO_ANSWER',
    'INTERESTED',
    'NOT_INTERESTED',
    'PAID',
    'PAID_RESERVATION',
    'PRESENT',
    'ABSENT',
    'FINISHED',
    'CALLBACK',
    'CONFIRMED_SCHEDULE',
    'ARCHIVE',
    'DROP',
    'CANCEL',
    'REMIND_SUCCESS'
  ));

ALTER TABLE franchise_leads
  ADD COLUMN IF NOT EXISTS onboarding_step varchar(40) NOT NULL DEFAULT 'MANAGEMENT_TRAINING';

UPDATE franchise_leads
SET onboarding_step = 'MANAGEMENT_TRAINING'
WHERE onboarding_step IS NULL;

ALTER TABLE franchise_leads
  DROP CONSTRAINT IF EXISTS franchise_leads_onboarding_step_check;

ALTER TABLE franchise_leads
  ADD CONSTRAINT franchise_leads_onboarding_step_check CHECK (onboarding_step IN (
    'MANAGEMENT_TRAINING',
    'BARISTA_TRAINING',
    'GRAND_OPENING'
  ));
