const joi = require("joi")

const saveMaterialValidationSchema = joi.object({
  name: joi.string().required().messages({
    "string.empty": "Name is required"
  }),
  description: joi.string().messages({
    "string.base": "Description must be a string"
  }),
  totalQuantity: joi.number().required().messages({
    "number.base": "Total quantity must be a number",
    "any.required": "Total quantity is required"
  })
})

module.exports = saveMaterialValidationSchema
