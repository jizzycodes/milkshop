const express = require('express')
const { postTrackingEvents } = require('../controllers/trackingController')

const router = express.Router()

router.post('/events', postTrackingEvents)

module.exports = router
