const { query, getClient } = require('../config/db')
const {
  LEAD_STATUS,
  STATUS_EXCLUDED_FROM_PAST_DUE,
  getTabConfig,
} = require('../constants/leadCrm')

/** Create a lead row from the public franchise inquiry payload. */
async function createLeadFromFranchisePayload(payload) {
  const {
    name,
    email,
    contactNumber,
    bestContactTime,
    estimatedAnnualIncome,
    proposedLocation,
    preferredPackage,
    remarks,
    referral,
  } = payload

  let annualIncome = null
  if (estimatedAnnualIncome) {
    const cleaned = String(estimatedAnnualIncome).replace(/[^0-9.]/g, '')
    if (cleaned) {
      const parsed = Number(cleaned)
      if (!Number.isNaN(parsed)) {
        annualIncome = parsed
      }
    }
  }

  let bestContactAt = null
  if (bestContactTime) {
    const parsedDate = new Date(bestContactTime)
    if (!Number.isNaN(parsedDate.getTime())) {
      bestContactAt = parsedDate.toISOString()
    }
  }

  const result = await query(
    `
      INSERT INTO franchise_leads
        (
          full_name,
          email,
          contact_number,
          best_contact_time,
          best_contact_at,
          annual_income,
          proposed_location,
          package_type,
          remarks,
          referral,
          stage,
          status
        )
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'REGISTERED', $11)
      RETURNING *
    `,
    [
      name,
      email,
      contactNumber,
      bestContactTime,
      bestContactAt,
      annualIncome,
      proposedLocation,
      preferredPackage,
      remarks || '',
      referral || '',
      LEAD_STATUS.NEW,
    ],
  )

  return result.rows[0]
}

/** Rule 1 (Register): auto move NEW -> FOR_FOLLOWUP when best_contact_at is past due. */
async function runPastDueDetection() {
  const result = await query(
    `
    UPDATE franchise_leads
    SET status = $1, updated_at = now()
    WHERE best_contact_at IS NOT NULL
      AND best_contact_at <= now()
      AND status = $2
    RETURNING id
    `,
    [LEAD_STATUS.FOR_FOLLOWUP, LEAD_STATUS.NEW],
  )
  return result.rowCount
}

async function getLeadById(id) {
  const result = await query(
    `SELECT id, full_name, email, contact_number, best_contact_time, annual_income,
     proposed_location, package_type, remarks, remarks_admin, referral, stage, status, contact_outcome,
     followup_count, next_followup_at, last_contacted_at, assigned_to, created_at, updated_at,
     best_contact_at
     FROM franchise_leads WHERE id = $1`,
    [id],
  )
  return result.rows[0] || null
}

async function listLeads(options = {}) {
  const {
    page = 1,
    pageSize = 10,
    from,
    to,
    search,
    stage,
    status,
    tab,
  } = options

  const tabCfg = getTabConfig(tab)
  const effectiveStatus = tabCfg.status ?? status
  const effectiveStage = tabCfg.stage ?? stage
  const orderBy = tabCfg.orderBy || 'updated_at'
  const orderDir = (tabCfg.orderDir || 'DESC').toUpperCase()

  const limit = Math.min(Math.max(Number(pageSize) || 10, 1), 100)
  const offset = (Math.max(Number(page) || 1, 1) - 1) * limit

  const conditions = []
  const params = []

  if (from) {
    params.push(from)
    conditions.push(`created_at >= $${params.length}`)
  }
  if (to) {
    params.push(to)
    conditions.push(`created_at <= $${params.length}`)
  }
  if (search) {
    params.push(`%${String(search).toLowerCase()}%`)
    conditions.push(
      `(LOWER(full_name) LIKE $${params.length} OR LOWER(email) LIKE $${params.length})`,
    )
  }
  if (effectiveStage) {
    params.push(effectiveStage)
    conditions.push(`stage = $${params.length}`)
  }
  if (effectiveStatus) {
    params.push(effectiveStatus)
    conditions.push(`status = $${params.length}`)
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
  let safeOrderCol = 'updated_at'
  if (orderBy === 'next_followup_at') {
    safeOrderCol = 'next_followup_at'
  } else if (orderBy === 'best_contact_at') {
    safeOrderCol = 'best_contact_at'
  }
  const safeDir = orderDir === 'ASC' ? 'ASC' : 'DESC'

  const countResult = await query(
    `SELECT COUNT(*)::int AS total FROM franchise_leads ${whereClause}`,
    params,
  )
  const total = countResult.rows[0].total

  params.push(limit, offset)

  const listResult = await query(
    `
    SELECT id, full_name, email, contact_number, best_contact_time, annual_income,
           proposed_location, package_type, remarks, remarks_admin, referral, stage, status, contact_outcome,
           followup_count, next_followup_at, last_contacted_at, assigned_to, created_at, updated_at,
           best_contact_at
    FROM franchise_leads
    ${whereClause}
    ORDER BY ${safeOrderCol} ${safeDir} NULLS LAST, created_at DESC
    LIMIT $${params.length - 1} OFFSET $${params.length}
    `,
    params,
  )

  return {
    total,
    items: listResult.rows,
    page: Math.max(Number(page) || 1, 1),
    pageSize: limit,
  }
}

async function getLeadFocusStats() {
  const result = await query(
    `
    SELECT
      COUNT(*) FILTER (
        WHERE status = 'NEW'
          AND best_contact_at IS NOT NULL
          AND best_contact_at < now()
      )::int
      +
      COUNT(*) FILTER (
        WHERE status = 'FOR_FOLLOWUP'
          AND next_followup_at IS NOT NULL
          AND next_followup_at < now()
      )::int AS overdue,

      COUNT(*) FILTER (
        WHERE status = 'NEW'
          AND best_contact_at IS NOT NULL
          AND best_contact_at::date = CURRENT_DATE
      )::int
      +
      COUNT(*) FILTER (
        WHERE status = 'FOR_FOLLOWUP'
          AND next_followup_at IS NOT NULL
          AND next_followup_at::date = CURRENT_DATE
      )::int AS due_today,

      COUNT(*) FILTER (WHERE created_at::date = CURRENT_DATE)::int AS new_today,
      COUNT(*) FILTER (WHERE status = 'FOR_FOLLOWUP')::int AS for_followup
    FROM franchise_leads
    WHERE status NOT IN ('DROPPED', 'ARCHIVED')
    `,
  )

  return result.rows[0] || {
    overdue: 0,
    due_today: 0,
    new_today: 0,
    for_followup: 0,
  }
}

async function updateLeadStatus(id, status) {
  const result = await query(
    `UPDATE franchise_leads SET status = $1, updated_at = now() WHERE id = $2 RETURNING id, status`,
    [status, id],
  )
  return result.rows[0] || null
}

async function updateLeadStage(id, stage) {
  const result = await query(
    `UPDATE franchise_leads SET stage = $1, updated_at = now() WHERE id = $2 RETURNING id, stage`,
    [stage, id],
  )
  return result.rows[0] || null
}

async function updateLeadFields(id, fields) {
  const allowed = [
    'status',
    'stage',
    'contact_outcome',
    'next_followup_at',
    'assigned_to',
    'remarks_admin',
  ]
  const setClauses = []
  const values = []
  let idx = 1
  for (const [key, value] of Object.entries(fields)) {
    if (!allowed.includes(key)) continue
    if (key === 'next_followup_at' && value === null) {
      setClauses.push(`next_followup_at = NULL`)
    } else {
      setClauses.push(`${key} = $${idx}`)
      values.push(value)
      idx += 1
    }
  }
  if (setClauses.length === 0) return getLeadById(id)
  setClauses.push(`updated_at = now()`)
  values.push(id)

  const result = await query(
    `UPDATE franchise_leads SET ${setClauses.join(', ')} WHERE id = $${idx} RETURNING *`,
    values,
  )
  return result.rows[0] || null
}

/** Update last_contacted_at, increment followup_count, set next_followup_at (Rule 2). */
async function updateLeadAfterContact(leadId, nextFollowupAt) {
  const result = await query(
    `UPDATE franchise_leads
     SET last_contacted_at = now(), followup_count = followup_count + 1,
         next_followup_at = $1, updated_at = now()
     WHERE id = $2
     RETURNING id, followup_count, last_contacted_at, next_followup_at`,
    [nextFollowupAt || null, leadId],
  )
  return result.rows[0] || null
}

module.exports = {
  createLeadFromFranchisePayload,
  runPastDueDetection,
  getLeadById,
  listLeads,
  getLeadFocusStats,
  updateLeadStatus,
  updateLeadStage,
  updateLeadFields,
  updateLeadAfterContact,
}
