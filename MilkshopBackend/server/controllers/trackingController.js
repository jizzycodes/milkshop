const { insertTrackingEvents, deleteAllTrackingEvents, getTrackingSummary } = require('../models/trackingModel')

async function postTrackingEvents(req, res, next) {
  try {
    const events = Array.isArray(req.body?.events) ? req.body.events : []
    const mapped = events.map((e) => ({
      eventType: e.eventType,
      sectionKey: e.sectionKey,
      path: e.path,
      durationMs: e.durationMs,
      sessionId: e.sessionId,
      userAgent: req.headers['user-agent'] || null,
      ipAddress: req.ip || null,
      occurredAt: e.occurredAt,
    }))
    const inserted = await insertTrackingEvents(mapped)
    res.status(202).json({ success: true, inserted })
  } catch (err) {
    next(err)
  }
}

async function deleteMonitorMetrics(req, res, next) {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Forbidden' })
    }
    await deleteAllTrackingEvents()
    res.json({ success: true, message: 'Tracking metrics cleared' })
  } catch (err) {
    next(err)
  }
}

async function getMonitorSummary(req, res, next) {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Forbidden' })
    }
    const days = req.query?.days || 14
    const from = req.query?.from || null
    const to = req.query?.to || null
    const sectionSearch = req.query?.sectionSearch || null
    const data = await getTrackingSummary({ days, from, to, sectionSearch })
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  postTrackingEvents,
  deleteMonitorMetrics,
  getMonitorSummary,
}
