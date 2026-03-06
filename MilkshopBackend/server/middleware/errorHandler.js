function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    path: req.originalUrl,
  })
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.status || 500
  const isClientError = status >= 400 && status < 500

  if (!isClientError) {
    console.error('Unhandled error:', err)
  }

  const response = {
    success: false,
    error: err.message || 'Internal Server Error',
  }

  if (process.env.NODE_ENV === 'development' && !isClientError) {
    response.details = {
      stack: err.stack,
    }
  }

  res.status(status).json(response)
}

module.exports = {
  notFoundHandler,
  errorHandler,
}

