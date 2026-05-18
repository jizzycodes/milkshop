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

app.disable('x-powered-by')

// Required when behind a reverse proxy (e.g. ngrok); avoids ERR_ERL_UNEXPECTED_X_FORWARDED_FOR
app.set('trust proxy', 1)

const corsOriginRaw = process.env.CORS_ORIGIN || '*'
const corsAllowlist = corsOriginRaw
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)
const corsAllowAll = corsAllowlist.includes('*')

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow non-browser clients (no Origin header)
      if (!origin) return cb(null, true)
      if (corsAllowAll) return cb(null, true)
      if (corsAllowlist.includes(origin)) return cb(null, true)
      return cb(new Error('Not allowed by CORS'))
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204,
    maxAge: 86400,
  }),
)

app.use(
  helmet({
    // Only meaningful when served over HTTPS in production
    hsts:
      process.env.NODE_ENV === 'production'
        ? { maxAge: 15552000, includeSubDomains: true, preload: true }
        : false,
  }),
)

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

