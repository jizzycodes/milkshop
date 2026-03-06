const express = require('express')
const { createFranchise } = require('../controllers/franchiseController')

const router = express.Router()

router.post('/', createFranchise)

module.exports = router

