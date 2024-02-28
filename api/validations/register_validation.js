const joi = require("joi")

const registerValidationSchema = joi.object({
  first_name: joi.string().required().messages({
    "string.empty": "First name is required"
  }),
  last_name: joi.string().required().messages({
    "string.empty": "Last name is required"
  }),
  email: joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "string.empty": "Email is required"
  }),
  password: joi.string().min(8).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 8 characters long"
  }),
  phone: joi.string().optional(),
  address: joi.string().optional(),
  birthday: joi.date().required().messages({
    "date.base": "Invalid date format",
    "date.empty": "Birthday is required"
  })
})

module.exports = registerValidationSchema
