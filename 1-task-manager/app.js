const express = require('express')
const app = express()


// routes
app.get('/', (req, res) => {
  res.json('hello')
})

const port = 3000

app.listen(port, () => {
  console.log(`server is listening on http://localhost:${port}`)
})