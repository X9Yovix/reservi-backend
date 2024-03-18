const joi = require("joi")

const saveCategoryValidationSchema = joi.object({
  name: joi.string().required().messages({
    "string.empty": "Name is required"
  }),
  color: joi.string().required().messages({
    "string.empty": "Color is required"
  })
})

module.exports = saveCategoryValidationSchema
