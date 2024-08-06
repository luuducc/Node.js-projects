const {BadRequestError} = require('../errors')
const jwt = require('jsonwebtoken')

const login = async (req, res) => {
  const { username, password } = req.body
  // 3 ways for validation
  // mongo
  // Joi package
  // check in the controller
  if (!username || !password) {
    throw new BadRequestError('please provide username and password', 400)
  }

  // for demo, normally provided by db
  const id = new Date().getDate()

  // try to keep payload small, better experience for user
  const token = jwt.sign({ id, username }, process.env.JWT_SECRET, {expiresIn: '30d'})
  res.status(200).json({ msg: 'user created', token })
}

const dashboard = async (req, res) => {
  const luckyNumber = Math.floor(Math.random()*100)
  res.status(200).json({ msg: `hello ${req.user.username}`, secret: `here is your lucky number: ${luckyNumber}`})
}

module.exports = {
  login, dashboard
}