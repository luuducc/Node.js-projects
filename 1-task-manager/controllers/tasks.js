const Task = require('../models/Task')
const asyncWrapper = require('../middleware/async')
const { createCustomError } = require('../errors/custom-error')

const getAllTasks = asyncWrapper(async (req, res) => { 
  const tasks = await Task.find()
  res.status(200).json({ tasks, count: tasks.length })
})

const createTask = asyncWrapper(async (req, res) => { 
  const task = await Task.create(req.body) // only prop in the schema will be created
  res.status(201).json({ task })
})

const getTask = asyncWrapper(async (req, res, next) => { 
  const { id: taskId} = req.params
  const task = await Task.findById(taskId)
  if (!task) {
    const error = createCustomError('not found', 404)
    throw error
    return next(error)
    return res.status(404).json({ msg: `no task found with id ${taskId}` })
  } 
  res.status(200).json({ task })
})

const updateTask = asyncWrapper(async (req, res) => { 
  const { id: taskId } = req.params
  const task = await Task.findOneAndUpdate({ _id: taskId}, req.body, {
    new: true, // return the updated document, not the initial document
    runValidators: true,
    // overwrite: true // for PUT method, replace with the data from request
  })
  if (!task) {
    return res.status(404).json({ msg: `no task with id ${taskId}` })
  }
  res.status(200).json({task})
})

const deleteTask = asyncWrapper(async (req, res) => { 
  const { id: taskId} = req.params
  const task = await Task.findOneAndDelete({ _id: taskId})
  if (!task) {
    return res.status(404).json({ msg: `no task found with id ${taskId}` })
  } 
  res.status(200).json(task)
})

module.exports = {
  getAllTasks, createTask, getTask, updateTask, deleteTask
}