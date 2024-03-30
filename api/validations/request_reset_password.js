const joi = require("joi")

const requestResetPasswordValidationSchema = joi.object({
  email: joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required"
  })
})

module.exports = requestResetPasswordValidationSchema
