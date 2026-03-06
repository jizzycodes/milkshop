const { query } = require('../config/db')

async function getHealth(req, res, next) {
  try {
    const dbResult = await query('SELECT 1 AS ok')

    res.json({
      success: true,
      message: 'Milkshop backend is healthy',
      data: {
        uptime: process.uptime(),
        db: dbResult.rows[0].ok === 1 ? 'up' : 'unknown',
      },
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getHealth,
}

