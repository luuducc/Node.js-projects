const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong try again later'
  }

  if (err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors)
      .map(item => item.message)
      .join(', ')
    customError.statusCode = StatusCodes.BAD_REQUEST
  }

  if (err.code && err.code === 11000) { // mongoose error code for duplicate value error
    customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`
    customError.statusCode = StatusCodes.BAD_REQUEST
  }

  if (err.name === 'CastError') {
    customError.msg = `No item found with id: ${err.value}`
    customError.statusCode = StatusCodes.NOT_FOUND
  }
  res.status(customError.statusCode).json({ msg: customError.msg })
  // res.status(customError.statusCode).json({ err })
}

module.exports = errorHandlerMiddleware
