const joi = require("joi")

const registerValidationSchema = joi.object({
  first_name: joi.string().required().messages({
    "any.required": "First name is required"
  }),
  last_name: joi.string().required().messages({
    "any.required": "Last name is required"
  }),
  email: joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required"
  }),
  password: joi.string().min(8).required().messages({
    "any.required": "Password is required",
    "string.min": "Password must be at least 8 characters long"
  }),
  birthday: joi.date().required().messages({
    "date.base": "Invalid date format",
    "date.empty": "Birthday is required"
  }),
  phone: joi.string().optional(),
  address: joi.string().optional(),
  avatar: joi.string().optional()
})

module.exports = registerValidationSchema
