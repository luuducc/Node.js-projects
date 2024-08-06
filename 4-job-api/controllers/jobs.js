const Job = require('../models/Job')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId})
    .populate('createdBy', 'name -_id')
    .select('-__v')
    .sort('createdAt')
  res.status(StatusCodes.OK).json({ count: jobs.length, jobs})
}
const getJob = async (req, res) => {
  const { user: { userId }, params: { id: jobId }} = req
  const job = await Job.findOne({ createdBy: userId, _id: jobId})
  if (!job) {
    throw new NotFoundError(`No job with id: ${jobId}`)
  }
  res.status(StatusCodes.OK).json({ job })
}
const createJob = async (req, res) => {
  const job = await Job.create({ ... req.body, createdBy: req.user.userId })
  res.status(StatusCodes.CREATED).json({ job })
}
const updateJob = async (req, res) => {
  const { 
    user: { userId }, 
    params: { id: jobId },
    body: { company, position }
  } = req

  if (!company || !position) {
    throw new BadRequestError('Company or position fields cannot be empty')
  }
  
  const job = await Job.findOneAndUpdate({ _id: jobId, createdBy: userId }, req.body, {
    new: true,
    runValidators: true
  })
  if (!job) {
    throw new NotFoundError(`No job with id: ${jobId}`)
  }
  res.status(StatusCodes.OK).json(job)
}
const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId }
  } = req
  const job = await Job.findOneAndDelete({ createdBy: userId, _id: jobId })
  if (!job) {
    throw new NotFoundError(`No job with id: ${jobId}`)
  }
  res.status(StatusCodes.OK).json({ ...job.toObject(), deleted: true })
}


module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob
}