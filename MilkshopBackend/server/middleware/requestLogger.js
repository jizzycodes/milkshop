function requestLogger(req, res, next) {
  const startedAt = Date.now()

  res.on('finish', () => {
    const duration = Date.now() - startedAt
    const logLine = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`
    console.log(logLine)
  })

  next()
}

module.exports = {
  requestLogger,
}

