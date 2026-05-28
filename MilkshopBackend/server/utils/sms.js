const SEMAPHORE_API_KEY = process.env.SEMAPHORE_API_KEY
const SEMAPHORE_SENDER_NAME = process.env.SEMAPHORE_SENDER_NAME
const SEMAPHORE_API_URL = 'https://api.semaphore.co/api/v4/messages'

const DEFAULT_FRANCHISE_SMS = `Hi (name)! Thank you for your Milkshop franchise inquiry. Our team will reach out within 3-5 business days. - Milkshop`

/** Normalize PH mobile to Semaphore format (e.g. 639171234567). */
function normalizePhilippineMobile(raw) {
  const digits = String(raw || '').replace(/\D/g, '')
  if (!digits) return null
  if (digits.startsWith('63') && digits.length >= 12) return digits
  if (digits.startsWith('0') && digits.length === 11) return `63${digits.slice(1)}`
  if (digits.startsWith('9') && digits.length === 10) return `63${digits}`
  return null
}

function buildFranchiseSmsBody(name) {
  const template = process.env.SEMAPHORE_FRANCHISE_MESSAGE || DEFAULT_FRANCHISE_SMS
  const displayName = name || 'there'
  return String(template).replace(/\(name\)/gi, displayName)
}

/**
 * Send franchise inquiry confirmation SMS via Semaphore.
 * Non-blocking for the API — caller should log failures, not fail the form.
 */
async function sendFranchiseConfirmationSms(contactNumber, name) {
  if (!SEMAPHORE_API_KEY) {
    return { sent: false, error: 'Semaphore not configured (SEMAPHORE_API_KEY)' }
  }

  const number = normalizePhilippineMobile(contactNumber)
  if (!number) {
    return { sent: false, error: 'Invalid Philippine mobile number' }
  }

  const params = new URLSearchParams({
    apikey: SEMAPHORE_API_KEY,
    number,
    message: buildFranchiseSmsBody(name),
  })

  if (SEMAPHORE_SENDER_NAME) {
    params.set('sendername', SEMAPHORE_SENDER_NAME)
  }

  try {
    const res = await fetch(SEMAPHORE_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      const errMsg =
        (Array.isArray(data) && data[0]?.message) ||
        data.message ||
        data.error ||
        `Semaphore HTTP ${res.status}`
      return { sent: false, error: errMsg, data }
    }

    return { sent: true, data }
  } catch (err) {
    return { sent: false, error: err.message }
  }
}

module.exports = {
  normalizePhilippineMobile,
  sendFranchiseConfirmationSms,
}
