const express = require('express')
const app = express()
const tasks = require('./routes/tasks')
const mongoose = require('mongoose')
require('dotenv').config()
const notFound = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

// middleware
app.use(express.static('./public'))
app.use(express.json())

// routes
const someJobs = () => {
  return new Promise((resolve, reject) => {
    resolve('hehe')
  })
}
const myWrapper = fn => {
  return  (req, res, next) => {
    console.log('hell')
     fn(req, res, next)
  }
}
const testController = myWrapper( (req, res) => {
  const data = 3
  console.log(data)
  // res.send('baby')
})
myWrapper((req, res) => {
  const data = 3
  console.log(data)
})
// testController(3, 5)
app.use('/test', testController)
app.use('/api/v1/tasks', tasks)
app.use(notFound) // allow this middleware for all paths (no path is specified in use())
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000


const start= async () => {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('connected to db')
  app.listen(port, () => {
    console.log(`server is listening on http://localhost:${port}`)
  })
}

start()
  