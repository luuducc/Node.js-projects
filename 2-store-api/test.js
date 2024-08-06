const Product = require('./model/Product')
const mongoose = require('mongoose')
require('dotenv').config()

// PROMISE

const getProduct = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI) 
    const product = await Product.findOne()
    console.log(product)
    console.log(2)
  } catch (error) {
  }
}

mongoose.connect(process.env.MONGO_URI) 
Product.findOne() 
.then(products => console.log(products))
.then(() => console.log(2))
.catch(error => mongoose.Error)


// getProduct()