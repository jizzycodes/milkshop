-- Allow all CONTACT_OUTCOME values from leadCrm.js
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