const notFound = (req, res) => res.status(404).json(`Route: ${req.url} does not exist`)

module.exports = notFound