/** Single source of truth for franchise_leads / lead_contact_logs (matches DB CHECK constraints). */

const LEAD_STAGE = Object.freeze({
  REGISTERED: 'REGISTERED',
  ORIENTATION: 'ORIENTATION',
  RESERVATION: 'RESERVATION',
  ONBOARDING: 'ONBOARDING',
  STORE_OPEN: 'STORE_OPEN',
  CLOSED: 'CLOSED',
})

const LEAD_STATUS = Object.freeze({
  NEW: 'NEW',
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  FOR_FOLLOWUP: 'FOR_FOLLOWUP',
  DROPPED: 'DROPPED',
  ARCHIVED: 'ARCHIVED',
  APPROVED: 'APPROVED',
})

const CONTACT_OUTCOME = Object.freeze({
  NO_ANSWER: 'NO_ANSWER',
  INTERESTED: 'INTERESTED',
  NOT_INTERESTED: 'NOT_INTERESTED',
  PAID: 'PAID',
  PAID_RESERVATION: 'PAID_RESERVATION',
  PRESENT: 'PRESENT',
  ABSENT: 'ABSENT',
  CALLBACK: 'CALLBACK',
  CONFIRMED_SCHEDULE: 'CONFIRMED_SCHEDULE',
  FINISHED: 'FINISHED',
  ARCHIVE: 'ARCHIVE',
  DROP: 'DROP',
  CANCEL: 'CANCEL',
  REMIND_SUCCESS: 'REMIND_SUCCESS',
  STORE_OPENING: 'STORE_OPENING',
})

const CONTACT_TYPE = Object.freeze({
  CALL: 'CALL',
  SMS: 'SMS',
  EMAIL: 'EMAIL',
})

const LEAD_STAGE_LIST = Object.values(LEAD_STAGE)
const LEAD_STATUS_LIST = Object.values(LEAD_STATUS)
const CONTACT_OUTCOME_LIST = Object.values(CONTACT_OUTCOME)
const CONTACT_TYPE_LIST = Object.values(CONTACT_TYPE)

function isValidStage(v) {
  return v != null && LEAD_STAGE_LIST.includes(String(v))
}

function isValidStatus(v) {
  return v != null && LEAD_STATUS_LIST.includes(String(v))
}

function isValidContactOutcome(v) {
  return v == null || v === '' || CONTACT_OUTCOME_LIST.includes(String(v))
}

function isValidContactType(v) {
  return v != null && CONTACT_TYPE_LIST.includes(String(v))
}

/** Statuses that are excluded from past-due auto-update (Rule 1). */
const STATUS_EXCLUDED_FROM_PAST_DUE = [
  LEAD_STATUS.DROPPED,
  LEAD_STATUS.ARCHIVED,
  LEAD_STATUS.APPROVED,
]

/** Phase 3: Dashboard tabs – each tab = simple filter + optional order. No separate tables. */
const LEADS_TABS = Object.freeze({
  ALL: 'all',
  NEW: 'new',
  ACTIVE: 'active',
  FOR_FOLLOW_UP: 'for_follow_up',
  ORIENTATION: 'orientation',
  RESERVATION: 'reservation',
  ONBOARDING: 'onboarding',
  STORE_OPEN: 'store_open',
  DROPPED: 'dropped',
  ARCHIVED: 'archived',
})

const LEADS_TAB_CONFIG = {
  [LEADS_TABS.ALL]: {},
  // \"New\" tab = first pipeline stage: REGISTERED leads, ordered by best_contact_at.
  [LEADS_TABS.NEW]: {
    stage: LEAD_STAGE.REGISTERED,
    orderBy: 'best_contact_at',
    orderDir: 'ASC',
  },
  [LEADS_TABS.ACTIVE]: { status: LEAD_STATUS.ACTIVE },
  [LEADS_TABS.FOR_FOLLOW_UP]: {
    status: LEAD_STATUS.FOR_FOLLOWUP,
    orderBy: 'best_contact_at',
    orderDir: 'ASC',
  },
  [LEADS_TABS.ORIENTATION]: { stage: LEAD_STAGE.ORIENTATION },
  [LEADS_TABS.RESERVATION]: { stage: LEAD_STAGE.RESERVATION },
  [LEADS_TABS.ONBOARDING]: { stage: LEAD_STAGE.ONBOARDING },
  [LEADS_TABS.STORE_OPEN]: { stage: LEAD_STAGE.STORE_OPEN },
  [LEADS_TABS.DROPPED]: { status: LEAD_STATUS.DROPPED },
  [LEADS_TABS.ARCHIVED]: { status: LEAD_STATUS.ARCHIVED },
}

function getTabConfig(tab) {
  return tab && LEADS_TAB_CONFIG[tab] ? LEADS_TAB_CONFIG[tab] : {}
}

module.exports = {
  LEAD_STAGE,
  LEAD_STATUS,
  CONTACT_OUTCOME,
  CONTACT_TYPE,
  LEAD_STAGE_LIST,
  LEAD_STATUS_LIST,
  CONTACT_OUTCOME_LIST,
  CONTACT_TYPE_LIST,
  isValidStage,
  isValidStatus,
  isValidContactOutcome,
  isValidContactType,
  STATUS_EXCLUDED_FROM_PAST_DUE,
  LEADS_TABS,
  LEADS_TAB_CONFIG,
  getTabConfig,
}
