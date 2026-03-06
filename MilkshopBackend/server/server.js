const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const { loadEnv } = require('./utils/env')
require('dotenv').config();
const apiRouter = require('./routes')
const { requestLogger } = require('./middleware/requestLogger')
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler')

loadEnv()

const app = express()

// Required when behind a reverse proxy (e.g. ngrok); avoids ERR_ERL_UNEXPECTED_X_FORWARDED_FOR
app.set('trust proxy', 1)

const corsOrigin = process.env.CORS_ORIGIN || '*'

app.use(
  cors({
    origin: corsOrigin,
  }),
)

app.use(helmet())

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many login attempts. Please try again later.',
  },
})

app.use(globalLimiter)

app.use(express.json({ limit: '1mb' }))
app.use(requestLogger)

app.use('/api/admin/login', authLimiter)
app.use('/api', apiRouter)

// Root: backend is API-only; admin UI is on the frontend
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Milkshop API',
    docs: {
      health: '/api/health',
      adminLogin: '/api/admin/login',
      admin: 'Use the frontend at http://localhost:5173/admin for the admin UI',
    },
  })
})

app.use(notFoundHandler)
app.use(errorHandler)

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`Milkshop backend listening on port ${PORT}`)
})

