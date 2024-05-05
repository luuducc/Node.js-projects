const express = require('express')
const app = express()
const tasks = require('./routes/tasks')
const mongoose = require('mongoose')
require('dotenv').config()
const notFound = require('./middleware/not-found')

// middleware
app.use(express.static('./public'))
app.use(express.json())

// routes
app.get('/', (req, res) => {
  res.json('hello')
})

app.use('/api/v1/tasks', tasks)
app.use(notFound)

const port = 3000


const start= async () => {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('connected to db')
  app.listen(port, () => {
    console.log(`server is listening on http://localhost:${port}`)
  })
}

start()