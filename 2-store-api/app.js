require('dotenv').config()
require('express-async-errors')
const mongoose = require('mongoose')
// async errors

const express = require('express')
const app = express()
const productsRouter = require('./routes/products')

const notFoundMiddleware = require('./middleware/not-found')
const errorMiddleware = require('./middleware/error-handler')

// middleware
app.use(express.json())

// routes
app.get('/', (req, res) => {
  res.send('<h1>store api </h1><a href="/api/v1/products">products route</a>')
})

app.use('/api/v1/products', productsRouter)

// products route


app.use(notFoundMiddleware)
app.use(errorMiddleware)

const port = process.env.PORT || 3000

const start = async () => {
  try {
    // connect db
    await mongoose.connect(process.env.MONGO_URI)
    console.log('connected to the db')
    app.listen(port, () => {
      console.log(`app is listening on http://localhost:${port}...`)
    })
  } catch (error) {
    console.log(error.message)
  }
} 

start()