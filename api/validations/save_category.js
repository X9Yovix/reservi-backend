const joi = require("joi")

const saveCategoryValidationSchema = joi.object({
  name: joi.string().required().messages({
    "any.required": "Name is required"
  }),
  color: joi.string().required().messages({
    "any.required": "Color is required"
  })
})

module.exports = saveCategoryValidationSchema
