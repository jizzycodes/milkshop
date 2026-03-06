const dotenv = require('dotenv')

let loaded = false

function loadEnv() {
  if (loaded) return
  dotenv.config()
  loaded = true
}

function requireEnv(key) {
  loadEnv()
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

module.exports = {
  loadEnv,
  requireEnv,
}

