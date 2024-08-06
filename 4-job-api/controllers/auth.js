const User = require('../models/User')
const { StatusCodes } = require('http-status-codes') 
const { BadRequestError, UnauthenticatedError } = require('../errors')
       
const register = async (req, res) => {
  // const { name, email, password } = req.body
  // if (!name || !email || !password) {
  //   throw new BadRequestError('Please provide name, email and password')
  // }
  const user = await User.create({ ...req.body })
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token: user.createJWT() })
}

const login = async (req, res) => {
  const { email, password: passToCheck } = req.body
  if (!email || !passToCheck) {
    throw new BadRequestError('Please provide email and password')
  }

  const user =  await User.findOne({ email })
  if (!user) {
    throw new UnauthenticatedError('Invalid credentials')
  } 

  const isPasswordCorrect = await user.validatePassword(passToCheck) 
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid credentials')
  }
  
  const token = user.createJWT()
  res.status(StatusCodes.OK).json({ user: { name: user.name}, token })
}

module.exports = {
  register, 
  login
}