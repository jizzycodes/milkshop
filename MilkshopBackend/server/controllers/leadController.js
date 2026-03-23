const {
  runPastDueDetection,
  getLeadById,
  listLeads,
  getLeadFocusStats,
  updateLeadStatus,
  updateLeadStage,
  updateLeadFields,
} = require('../models/franchiseLeadModel')
const { listByLeadId, createContactLog } = require('../models/leadContactLogModel')
const {
  isValidStage,
  isValidStatus,
  isValidContactOutcome,
  isValidContactType,
} = require('../constants/leadCrm')

function notFound(message = 'Lead not found') {
  const err = new Error(message)
  err.status = 404
  return err
}

/** Rule 1: run past-due detection before listing, then return list. Phase 3: tab filter. */
async function getLeads(req, res, next) {
  try {
    await runPastDueDetection()

    const { page, pageSize, from, to, search, stage, status, tab } = req.query
    const result = await listLeads({
      page,
      pageSize,
      from,
      to,
      search,
      stage,
      status,
      tab,
    })

    const totalPages = Math.max(
      Math.ceil(result.total / result.pageSize) || 1,
      1,
    )

    res.json({
      success: true,
      pagination: {
        page: result.page,
        pageSize: result.pageSize,
        total: result.total,
        totalPages,
      },
      data: result.items,
    })
  } catch (err) {
    next(err)
  }
}

async function getLeadsFocusStats(req, res, next) {
  try {
    await runPastDueDetection()
    const data = await getLeadFocusStats()
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

async function getLead(req, res, next) {
  try {
    const lead = await getLeadById(req.params.id)
    if (!lead) throw notFound()
    res.json({ success: true, data: lead })
  } catch (err) {
    next(err)
  }
}

async function patchLeadStatus(req, res, next) {
  try {
    const { status } = req.body
    if (!isValidStatus(status)) {
      const err = new Error('Invalid status')
      err.status = 400
      throw err
    }
    const updated = await updateLeadStatus(req.params.id, status)
    if (!updated) throw notFound()
    res.json({ success: true, data: updated })
  } catch (err) {
    next(err)
  }
}

async function patchLeadStage(req, res, next) {
  try {
    const { stage } = req.body
    if (!isValidStage(stage)) {
      const err = new Error('Invalid stage')
      err.status = 400
      throw err
    }
    const updated = await updateLeadStage(req.params.id, stage)
    if (!updated) throw notFound()
    res.json({ success: true, data: updated })
  } catch (err) {
    next(err)
  }
}

async function patchLead(req, res, next) {
  try {
    const { status, stage, contact_outcome, next_followup_at, assigned_to } =
      req.body
    const fields = {}
    if (status != null && isValidStatus(status)) fields.status = status
    if (stage != null && isValidStage(stage)) fields.stage = stage
    if (contact_outcome !== undefined && isValidContactOutcome(contact_outcome)) {
      fields.contact_outcome = contact_outcome || null
    }
    if (next_followup_at !== undefined) {
      fields.next_followup_at =
        next_followup_at === null || next_followup_at === ''
          ? null
          : next_followup_at
    }
    if (assigned_to !== undefined) fields.assigned_to = assigned_to || null

    const updated = await updateLeadFields(req.params.id, fields)
    if (!updated) throw notFound()
    res.json({ success: true, data: updated })
  } catch (err) {
    next(err)
  }
}

/** Rule 2: create contact log + update lead (last_contacted_at, followup_count, next_followup_at). */
async function postContactLog(req, res, next) {
  try {
    const leadId = req.params.id
    const lead = await getLeadById(leadId)
    if (!lead) throw notFound()

    const { contactType, notes, outcome, nextFollowupAt } = req.body
    if (!isValidContactType(contactType)) {
      const err = new Error('Invalid contactType (use CALL, SMS, EMAIL)')
      err.status = 400
      throw err
    }
    if (!isValidContactOutcome(outcome)) {
      const err = new Error('Invalid outcome')
      err.status = 400
      throw err
    }

    const log = await createContactLog(
      leadId,
      {
        contactType,
        notes: notes != null ? String(notes) : '',
        outcome: outcome || null,
        nextFollowupAt: nextFollowupAt || null,
      },
      req.user?.email || req.user?.sub || null,
    )

    res.status(201).json({ success: true, data: log })
  } catch (err) {
    next(err)
  }
}

async function getContactLogs(req, res, next) {
  try {
    const lead = await getLeadById(req.params.id)
    if (!lead) throw notFound()
    const logs = await listByLeadId(req.params.id)
    res.json({ success: true, data: logs })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getLeads,
  getLeadsFocusStats,
  getLead,
  patchLeadStatus,
  patchLeadStage,
  patchLead,
  postContactLog,
  getContactLogs,
}
