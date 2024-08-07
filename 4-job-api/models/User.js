const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema =  mongoose.Schema({
  name: {
    type: String, 
    required: [true, 'Please provide name'],
    minlength: 3,
    maxlength: 20
  },
  email: {
    type: String, 
    required: [true, 'Please provide email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide valid email'
    ], 
    unique: true // this is not validator??
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6
  }
})

// for newer versions of mongoose, no need to call next() to call to the next middleware in async function
UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})
UserSchema.methods.validatePassword = async function (passToCheck) {
  const isMatch = await bcrypt.compare(passToCheck, this.password)
  return isMatch
}
UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name}, 
    process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_EXPIRATION }
  )
}
module.exports = mongoose.model('User', UserSchema)