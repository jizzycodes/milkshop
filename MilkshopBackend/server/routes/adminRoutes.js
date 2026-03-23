const express = require('express')
const { authenticateAdmin } = require('../middleware/authMiddleware')
const { getAdminCount } = require('../models/adminUserModel')
const {
  getFranchiseDashboardStats,
  listFranchiseRequests,
} = require('../models/franchiseRequestModel')
const {
  getLeads,
  getLeadsFocusStats,
  getLead,
  patchLeadStatus,
  patchLeadStage,
  patchLead,
  postContactLog,
  getContactLogs,
} = require('../controllers/leadController')
const { getQrEmail, putQrEmail } = require('../controllers/adminSettingsController')
const { getMonitorSummary, deleteMonitorMetrics } = require('../controllers/trackingController')
const {
  getMyAccount,
  updateMyAccount,
  getAccounts,
  postAccount,
  putAccount,
} = require('../controllers/accountSettingsController')

const router = express.Router()

router.use(authenticateAdmin)

router.get('/me', async (req, res, next) => {
  try {
    const count = await getAdminCount()
    res.json({
      success: true,
      data: {
        id: req.user.sub,
        email: req.user.email,
        adminCount: count,
      },
    })
  } catch (err) {
    next(err)
  }
})

router.get('/dashboard', async (req, res, next) => {
  try {
    const stats = await getFranchiseDashboardStats()
    res.json({
      success: true,
      data: stats,
    })
  } catch (err) {
    next(err)
  }
})

router.get('/franchise-requests', async (req, res, next) => {
  try {
    const {
      page,
      pageSize,
      from,
      to,
      search,
    } = req.query

    const result = await listFranchiseRequests({
      page,
      pageSize,
      from,
      to,
      search,
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
})

// Phase 2: CRM leads (franchise_leads) + contact logs
router.get('/leads', getLeads)
router.get('/leads/focus-stats', getLeadsFocusStats)
router.get('/leads/:id', getLead)
router.patch('/leads/:id/status', patchLeadStatus)
router.patch('/leads/:id/stage', patchLeadStage)
router.patch('/leads/:id', patchLead)
router.post('/leads/:id/contact-logs', postContactLog)
router.get('/leads/:id/contact-logs', getContactLogs)

router.get('/settings/qr-email', getQrEmail)
router.put('/settings/qr-email', putQrEmail)
router.get('/settings/account/me', getMyAccount)
router.put('/settings/account/me', updateMyAccount)
router.get('/settings/account/accounts', getAccounts)
router.post('/settings/account/accounts', postAccount)
router.put('/settings/account/accounts/:id', putAccount)
router.get('/monitor/summary', getMonitorSummary)
router.delete('/monitor/metrics', deleteMonitorMetrics)

module.exports = router

