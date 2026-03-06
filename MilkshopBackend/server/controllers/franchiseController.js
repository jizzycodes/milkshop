const { createFranchiseRequest } = require('../models/franchiseRequestModel')
const { createLeadFromFranchisePayload } = require('../models/franchiseLeadModel')

function validateFranchisePayload(body) {
  const requiredFields = [
    'name',
    'email',
    'contactNumber',
    'bestContactTime',
    'estimatedAnnualIncome',
    'proposedLocation',
    'preferredPackage',
    'remarks',
  ]

  const missing = requiredFields.filter((field) => !body[field] || String(body[field]).trim() === '')

  if (missing.length > 0) {
    const error = new Error(`Missing required fields: ${missing.join(', ')}`)
    error.status = 400
    throw error
  }

  const email = String(body.email).trim()
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(email)) {
    const error = new Error('Invalid email format')
    error.status = 400
    throw error
  }
}

async function createFranchise(req, res, next) {
  try {
    validateFranchisePayload(req.body)

    const payload = {
      name: String(req.body.name).trim(),
      email: String(req.body.email).trim(),
      contactNumber: String(req.body.contactNumber).trim(),
      bestContactTime: String(req.body.bestContactTime).trim(),
      estimatedAnnualIncome: String(req.body.estimatedAnnualIncome).trim(),
      proposedLocation: String(req.body.proposedLocation).trim(),
      preferredPackage: String(req.body.preferredPackage).trim(),
      remarks: req.body.remarks ? String(req.body.remarks).trim() : '',
      referral: req.body.referral ? String(req.body.referral).trim() : '',
    }

    const created = await createFranchiseRequest(payload)

    // Also create a lead entry so the inquiry appears under /admin/leads as NEW.
    try {
      await createLeadFromFranchisePayload(payload)
    } catch (leadErr) {
      // Do not block the public form on lead-creation issues, but log for investigation.
      // eslint-disable-next-line no-console
      console.error('Failed to create lead from franchise request', leadErr)
    }

    res.status(201).json({
      success: true,
      data: created,
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createFranchise,
}

