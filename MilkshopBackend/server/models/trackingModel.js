const { query } = require('../config/db')

const ALLOWED_EVENT_TYPES = new Set(['section_view_end', 'section_view_heartbeat', 'nav_click'])
const MIN_SECTION_DURATION_MS = 4000
const MAX_STORED_DURATION_MS = 7 * 60 * 1000

async function insertTrackingEvents(events) {
  if (!Array.isArray(events) || events.length === 0) return 0
  const capped = events.slice(0, 200)
  let inserted = 0

  for (const e of capped) {
    const eventType = String(e.eventType || '').trim()
    if (!eventType || !ALLOWED_EVENT_TYPES.has(eventType)) continue

    const sectionKey = String(e.sectionKey || '').trim() || null
    const path = String(e.path || '').trim() || null
    const durationMs = Number(e.durationMs || 0)
    const occurredAt = e.occurredAt ? new Date(e.occurredAt) : new Date()

    if (Number.isNaN(occurredAt.getTime())) continue

    let normalizedDurationMs = Number.isFinite(durationMs) ? Math.max(0, Math.round(durationMs)) : 0
    // Enforce "start counting after 4s" at DB level too.
    // If client already sent post-threshold duration (<4s), keep it as-is.
    if (eventType === 'section_view_end' && normalizedDurationMs >= MIN_SECTION_DURATION_MS) {
      normalizedDurationMs -= MIN_SECTION_DURATION_MS
    }
    normalizedDurationMs = Math.min(MAX_STORED_DURATION_MS, normalizedDurationMs)

    await query(
      `INSERT INTO website_tracking_events
       (event_type, section_key, path, duration_ms, session_id, user_agent, ip_address, occurred_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        eventType,
        sectionKey,
        path,
        normalizedDurationMs,
        e.sessionId ? String(e.sessionId) : null,
        e.userAgent ? String(e.userAgent) : null,
        e.ipAddress ? String(e.ipAddress) : null,
        occurredAt.toISOString(),
      ],
    )
    inserted += 1
  }

  return inserted
}

function buildTrackingWhere({ days = 14, from, to, sectionSearch }) {
  const clauses = []
  const params = []
  let idx = 1

  const hasFrom = from && /^\d{4}-\d{2}-\d{2}$/.test(String(from))
  const hasTo = to && /^\d{4}-\d{2}-\d{2}$/.test(String(to))

  if (hasFrom) {
    clauses.push(`occurred_at >= $${idx++}::date`)
    params.push(String(from))
  }
  if (hasTo) {
    clauses.push(`occurred_at < ($${idx++}::date + interval '1 day')`)
    params.push(String(to))
  }
  if (!hasFrom && !hasTo) {
    const safeDays = Math.min(90, Math.max(1, Number(days) || 14))
    clauses.push(`occurred_at >= now() - ($${idx++}::text || ' days')::interval`)
    params.push(String(safeDays))
  }
  if (sectionSearch && String(sectionSearch).trim()) {
    clauses.push(`COALESCE(section_key, '') ILIKE $${idx++}`)
    params.push(`%${String(sectionSearch).trim()}%`)
  }

  return {
    whereSql: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '',
    params,
  }
}

/** Deletes all website tracking rows and resets the id sequence. Admin-only use. */
async function deleteAllTrackingEvents() {
  await query('TRUNCATE website_tracking_events RESTART IDENTITY')
  return true
}

async function getTrackingSummary({ days = 14, from, to, sectionSearch } = {}) {
  const { whereSql, params } = buildTrackingWhere({ days, from, to, sectionSearch })
  const totalRes = await query(
    `SELECT
      COUNT(*)::int AS total_events,
      COUNT(DISTINCT session_id)::int AS total_sessions,
      COALESCE(SUM(CASE
        WHEN event_type = 'section_view_end' THEN duration_ms
        ELSE 0
      END), 0)::bigint AS total_duration_ms
     FROM website_tracking_events
     ${whereSql}`,
    params,
  )

  const topSectionsRes = await query(
    `SELECT
      COALESCE(section_key, '(unknown)') AS section_key,
      COUNT(*)::int AS events,
      COUNT(DISTINCT session_id)::int AS sessions,
      COALESCE(SUM(duration_ms), 0)::bigint AS duration_ms,
      ROUND(COALESCE(AVG(NULLIF(duration_ms, 0)), 0)::numeric, 2) AS avg_duration_ms
     FROM website_tracking_events
     ${whereSql ? `${whereSql} AND` : 'WHERE'}
       event_type = 'section_view_end'
     GROUP BY section_key
     ORDER BY duration_ms DESC
     LIMIT 20`,
    params,
  )

  const byDayRes = await query(
    `SELECT
      to_char(date_trunc('day', occurred_at), 'YYYY-MM-DD') AS day,
      COUNT(*)::int AS events,
      COALESCE(SUM(CASE
        WHEN event_type = 'section_view_end' THEN duration_ms
        ELSE 0
      END), 0)::bigint AS duration_ms
     FROM website_tracking_events
     ${whereSql}
     GROUP BY 1
     ORDER BY 1 ASC`,
    params,
  )

  const menuClicksRes = await query(
    `SELECT
      COALESCE(section_key, '(unknown)') AS menu_label,
      COUNT(*)::int AS clicks
     FROM website_tracking_events
     ${whereSql ? `${whereSql} AND` : 'WHERE'}
       event_type = 'nav_click'
     GROUP BY 1
     ORDER BY clicks DESC
     LIMIT 10`,
    params,
  )

  return {
    totals: totalRes.rows[0],
    topSections: topSectionsRes.rows,
    byDay: byDayRes.rows,
    menuClicks: menuClicksRes.rows,
  }
}

module.exports = {
  insertTrackingEvents,
  deleteAllTrackingEvents,
  getTrackingSummary,
}
