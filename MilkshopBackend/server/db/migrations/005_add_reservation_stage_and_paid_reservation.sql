-- Add RESERVATION stage and PAID_RESERVATION contact outcome.
ALTER TABLE franchise_leads
  DROP CONSTRAINT IF EXISTS franchise_leads_stage_check;

ALTER TABLE franchise_leads
  ADD CONSTRAINT franchise_leads_stage_check CHECK (stage IN (
    'REGISTERED',
    'ORIENTATION',
    'RESERVATION',
    'ONBOARDING',
    'CLOSED'
  ));

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
    'CALLBACK',
    'CONFIRMED_SCHEDULE',
    'ARCHIVE',
    'DROP',
    'CANCEL',
    'REMIND_SUCCESS'
  ));
