const joi = require("joi")

const resetPasswordValidationSchema = joi.object({
  password: joi.string().min(8).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 8 characters long"
  }),
  confirm_password: joi.string().required().valid(joi.ref("password")).messages({
    "string.empty": "Confirm password is required",
    "any.only": "Passwords do not match"
  })
})

module.exports = resetPasswordValidationSchema
