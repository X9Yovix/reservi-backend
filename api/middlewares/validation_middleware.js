const validation = (schema) => async (req, res, next) => {
  const body = req.body

  try {
    await schema.validateAsync(body)
    next()
  } catch (error) {
    res.status(400).json({
      error: error.message
    })
  }
}

module.exports = validation
