const joi = require("joi")

const loginValidationSchema = joi.object({
  email: joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required"
  }),
  password: joi.string().required().messages({
    "any.required": "Password is required"
  })
})

module.exports = loginValidationSchema
