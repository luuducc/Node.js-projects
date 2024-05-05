const Task = require('../models/Task')

const getAllTasks = async (req, res) => { 
  try {
    const tasks = await Task.find()
    res.status(200).json({ tasks, count: tasks.length })
  } catch (error) {
    res.status(500).json({ error })
  }
}

const createTask = async (req, res) => { 
  try {
    const task = await Task.create(req.body) // only prop in the schema will be created
    res.status(201).json({ task })
  } catch (error) {
    res.status(500).json({ error })
  }
  
}

const getTask = async (req, res) => { 
  try {
    const { id: taskId} = req.params
    const task = await Task.findById(taskId)
    if (!task) {
      return res.status(404).json({ msg: `no task found with id ${taskId}` })
    } 
    res.status(200).json({ task })
  } catch (error) {
    res.status(500).json({ error })
  }
}

const updateTask = async (req, res) => { 
  try {
    const { id: taskId } = req.params
    const task = await Task.findOneAndUpdate({ _id: taskId}, req.body, {
      new: true,
      runValidators: true
    })
    if (!task) {
      return res.status(404).json({ msg: `no task with id ${taskId}` })
    }
    res.status(200).json({task})
  } catch (error) {
    res.status(500).json(error)
  }
}

const deleteTask = async (req, res) => { 
  try {
    const { id: taskId} = req.params
    const task = await Task.findOneAndDelete({ _id: taskId})
    if (!task) {
      return res.status(404).json({ msg: `no task found with id ${taskId}` })
    } 
    res.status(200).json(task)
  } catch (error) {
    res.status(500).json({ error })
  }
}

module.exports = {
  getAllTasks, createTask, getTask, updateTask, deleteTask
}