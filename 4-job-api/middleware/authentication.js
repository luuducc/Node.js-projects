const User = require('../models/User')
const { UnauthenticatedError } = require('../errors')
const jwt = require('jsonwebtoken')

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Authentication invalid')
  }
  const token = authHeader.split(' ')[1]
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    // attach user to the job routes
    const { userId, name } = payload
    req.user = { userId, name }

    // another way to attach user property
    // const user = await User.findById(userId).select('-password')
    // req.user = user 
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid')
  }
  next()
}
module.exports = verifyToken