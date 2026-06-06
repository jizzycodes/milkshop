const { createFranchiseRequest } = require('../models/franchiseRequestModel')
const { createLeadFromFranchisePayload } = require('../models/franchiseLeadModel')
const { sendFranchiseConfirmation } = require('../utils/mail')
const { sendFranchiseConfirmationSms } = require('../utils/sms')

async function verifyTurnstile(token) {
  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
      }),
    }
  );
  const data = await response.json();
  return data.success;
}

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
    // Verify Turnstile token first
    const turnstileValid = await verifyTurnstile(req.body.turnstileToken)
    if (!turnstileValid) {
      return res.status(400).json({
        success: false,
        message: 'Security check failed. Please try again.',
      })
    }

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
      // eslint-disable-next-line no-console
      console.error('Failed to create lead from franchise request', leadErr)
    }

    res.status(201).json({
      success: true,
      data: created,
    })

    // Email/SMS after response — SMTP on Linode can hang and cause 504 if awaited first.
    sendFranchiseConfirmation(payload.email, payload.name)
      .then((result) => {
        if (result.sent) {
          // eslint-disable-next-line no-console
          console.log('[Franchise] Confirmation email sent to', payload.email)
        } else {
          // eslint-disable-next-line no-console
          console.warn('[Franchise] Email NOT sent:', result.error || 'unknown')
        }
      })
      .catch((mailErr) => {
        // eslint-disable-next-line no-console
        console.warn('[Franchise] Email error:', mailErr.message)
      })

    sendFranchiseConfirmationSms(payload.contactNumber, payload.name)
      .then((smsResult) => {
        if (smsResult.sent) {
          // eslint-disable-next-line no-console
          console.log('[Franchise] Confirmation SMS sent to', payload.contactNumber)
        } else {
          // eslint-disable-next-line no-console
          console.warn('[Franchise] SMS NOT sent:', smsResult.error || 'unknown')
        }
      })
      .catch((smsErr) => {
        // eslint-disable-next-line no-console
        console.warn('[Franchise] SMS error:', smsErr.message)
      })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createFranchise,
}