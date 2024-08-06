const mongoose = require('mongoose')
const JobSchema = mongoose.Schema({
  company: {
    type: String, 
    required: [true, 'Please provide company name'],
    maxLength: 50// either maxLenght or maxlength still valid - case insensitive
  }, 
  position: {
    type: String,
    required: [true, 'Please provide position'],
    maxLength: 100
  },
  status: {
    type: String, 
    enum: ['interview', 'declined', 'pending'],
    default: 'pending'
  }, 
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user']
  }
}, { timestamps: true })

// Create a unique compound index on company, position, and createdBy
JobSchema.index({ company: 1, position: 1, createdBy: 1 }, { unique: true });

module.exports = mongoose.model('Job', JobSchema)