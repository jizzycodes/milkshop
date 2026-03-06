const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

async function handleResponse(response) {
  let body
  try {
    body = await response.json()
  } catch {
    body = null
  }

  if (!response.ok) {
    const message = body?.error || body?.message || 'Something went wrong'
    const error = new Error(message)
    error.status = response.status
    error.data = body
    throw error
  }

  return body
}

export async function createFranchiseRequest(payload) {
  const response = await fetch(`${API_BASE_URL}/api/franchise`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: payload.name,
      email: payload.email,
      contactNumber: payload.contactNumber,
      bestContactTime: payload.bestContactTime,
      estimatedAnnualIncome: payload.estimatedAnnualIncome,
      proposedLocation: payload.proposedLocation,
      preferredPackage: payload.preferredPackage,
      remarks: payload.remarks || '',
      referral: payload.referral || '',
    }),
  })

  return handleResponse(response)
}

