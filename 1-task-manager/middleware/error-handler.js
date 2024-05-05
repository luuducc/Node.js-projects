const errorHandlerMiddleware = (err, req, res, next) => {
  return res.status(400).json({ msg: err })
}

module.exports = errorHandlerMiddleware