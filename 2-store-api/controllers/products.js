const Product = require('../model/Product')

const getAllProductsStatic = async (req, res) => {
  const search = 'a'
  // const products = await Product.find({
  //   name: {
  //     $regex: search,
  //     $options: 'i'
  //   }
  // })
  const products = await Product.find()
    .where('name').regex(new RegExp(search, 'i'))
    .skip(2)
    .limit(3)
    .sort('-name')
    .select('name price')
  res.status(200).json({ nbHits: products.length, products })
}

const getAllProducts = async (req, res) => {
  // retrieve only the specified props from ther user's query
  const { featured, company, name, sort, fields, numericFilters } = req.query
  const queryObject = {}

  if (featured) {
    queryObject.featured = featured === 'true' ? true : false
  }
  if (company) {
    queryObject.company = company
  }
  if (name) {
    queryObject.name = { $regex: name, $options: 'i'} // i - case Insensitive
  }
  if (numericFilters) {
    const operatorMapper = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    }
    const regEx = /\b(>|>=|=|<|<=)\b/g
    let filters = numericFilters.replace(regEx, match => `-${operatorMapper[match]}-`)
    const options = ['price', 'rating']
    filters = filters.split(',').forEach(item => {
      const [field, operator, value] = item.split('-')
      if (options.includes(field)) {
        queryObject[field] = {
          ...queryObject[field], 
          [operator]: Number(value)
        }
      }
    })
  }
  console.log(queryObject)

  let results = Product.find(queryObject)

  if (sort) {
    const sortList = sort.split(',').join(' ')
    results = results.sort(sortList)
  } else {
    results = results.sort('createdAt')
  }

  if (fields) {
    const fieldList = fields.split(',').join(' ')
    results.select(fieldList)
  }

  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * limit
  results = results.skip(skip).limit(limit)

  const products = await results
  res.status(200).json({ nbHits: products.length, products })
}

module.exports = {
  getAllProducts, getAllProductsStatic
}