const jsonProducts = require('./products.json')
const Product = require('./model/Product')
const mongoose = require('mongoose')
require('dotenv').config()

const addProduct = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    await Product.deleteMany({})
    await Product.create(jsonProducts)
    console.log('done')
    process.exit(0)
  } catch (error) {
    console.log(error.message)
    process.exit(1)
  }
}

addProduct()