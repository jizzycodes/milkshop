const express = require('express')
const healthRoutes = require('./healthRoutes')
const franchiseRoutes = require('./franchiseRoutes')
const adminAuthRoutes = require('./adminAuthRoutes')
const adminRoutes = require('./adminRoutes')
const trackingRoutes = require('./trackingRoutes')

const router = express.Router()

router.use('/health', healthRoutes)
router.use('/franchise', franchiseRoutes)
router.use('/track', trackingRoutes)
router.use('/admin', adminAuthRoutes)
router.use('/admin', adminRoutes)

module.exports = router

