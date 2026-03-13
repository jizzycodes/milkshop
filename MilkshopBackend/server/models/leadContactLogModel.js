const { query, getClient } = require('../config/db')

async function listByLeadId(leadId) {
  const result = await query(
    `SELECT id, lead_id, contact_type, notes, outcome, next_followup_at, created_by, created_at
     FROM lead_contact_logs
     WHERE lead_id = $1
     ORDER BY created_at DESC`,
    [leadId],
  )
  return result.rows
}

/**
 * Create contact log and apply Rule 2: update lead last_contacted_at, followup_count, next_followup_at.
 * @param {string} leadId - UUID
 * @param {object} payload - { contactType, notes, outcome?, nextFollowupAt? }
 * @param {string} [createdBy] - optional admin user id
 */
async function createContactLog(leadId, payload, createdBy = null) {
  const client = await getClient()
  try {
    const { contactType, notes, outcome, nextFollowupAt } = payload

    const insertResult = await client.query(
      `INSERT INTO lead_contact_logs (lead_id, contact_type, notes, outcome, next_followup_at, created_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, lead_id, contact_type, notes, outcome, next_followup_at, created_by, created_at`,
      [leadId, contactType, notes || '', outcome || null, nextFollowupAt || null, createdBy || null],
    )
    const log = insertResult.rows[0]

    await client.query(
      `UPDATE franchise_leads
       SET last_contacted_at = now(), followup_count = followup_count + 1,
           next_followup_at = $1, updated_at = now()
       WHERE id = $2`,
      [nextFollowupAt || null, leadId],
    )

    return log
  } finally {
    client.release()
  }
}

module.exports = {
  listByLeadId,
  createContactLog,
}
