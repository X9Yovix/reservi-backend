const validation = (schema) => async (req, res, next) => {
  try {
    const body = req.body
    await schema.validateAsync(body)
    next()
  } catch (error) {
    res.status(400).json({
      error: error.message
    })
  }
}

module.exports = validation
