const { query } = require('../config/db')

async function createFranchiseRequest(payload) {
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

  const result = await query(
    `
      INSERT INTO franchise_requests
        (
          full_name,
          email,
          contact_number,
          best_contact_time,
          estimated_annual_income,
          proposed_location,
          preferred_package,
          remarks,
          referral
        )
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `,
    [
      name,
      email,
      contactNumber,
      bestContactTime,
      estimatedAnnualIncome,
      proposedLocation,
      preferredPackage,
      remarks || '',
      referral || '',
    ],
  )

  return result.rows[0]
}

async function getFranchiseDashboardStats() {
  const result = await query(
    `
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (
          WHERE (created_at AT TIME ZONE 'Asia/Manila')::date
            = (now() AT TIME ZONE 'Asia/Manila')::date
        )::int AS today,
        COUNT(*) FILTER (
          WHERE date_trunc(
            'month',
            created_at AT TIME ZONE 'Asia/Manila'
          ) = date_trunc('month', now() AT TIME ZONE 'Asia/Manila')
        )::int AS this_month
      FROM franchise_requests
    `,
  )

  return result.rows[0]
}

async function listFranchiseRequests(options) {
  const {
    page = 1,
    pageSize = 10,
    from,
    to,
    search,
  } = options

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
    params.push(`%${search.toLowerCase()}%`)
    conditions.push(
      `(LOWER(full_name) LIKE $${params.length} OR LOWER(email) LIKE $${params.length})`,
    )
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

  const countResult = await query(
    `
      SELECT COUNT(*)::int AS total
      FROM franchise_requests
      ${whereClause}
    `,
    params,
  )

  const total = countResult.rows[0].total

  params.push(limit)
  params.push(offset)

  const listResult = await query(
    `
      SELECT
        id,
        full_name,
        email,
        contact_number,
        best_contact_time,
        estimated_annual_income,
        proposed_location,
        preferred_package,
        remarks,
        referral,
        created_at
      FROM franchise_requests
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${params.length - 1}
      OFFSET $${params.length}
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

module.exports = {
  createFranchiseRequest,
  getFranchiseDashboardStats,
  listFranchiseRequests,
}

