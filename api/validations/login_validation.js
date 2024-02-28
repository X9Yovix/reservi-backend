const joi = require("joi")

const loginValidationSchema = joi.object({
  email: joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "string.empty": "Email is required"
  }),
  password: joi.string().required().messages({
    "string.empty": "Password is required"
  })
})

module.exports = loginValidationSchema
