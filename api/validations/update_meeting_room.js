const joi = require("joi")

const custom = joi.extend({
  type: "array",
  base: joi.array(),
  coerce: {
    from: "string",
    method(value, helpers) {
      try {
        return { value: JSON.parse(value) }
      } catch (error) {
        console.log(error)
        return helpers.error("any.custom")
      }
    }
  }
})

const updateMeetingRoomValidationSchema = joi.object({
  name: joi.string().required().messages({
    "any.required": "Name is required"
  }),
  capacity: joi.number().required().messages({
    "number.base": "Capacity must be a number",
    "any.required": "Capacity is required"
  }),
  length: joi.number().required().messages({
    "number.base": "Length must be a number",
    "any.required": "Length is required"
  }),
  width: joi.number().required().messages({
    "number.base": "Width must be a number",
    "any.required": "Width is required"
  }),
  height: joi.number().required().messages({
    "number.base": "Height must be a number",
    "any.required": "Height is required"
  }),
  description: joi.string().allow("").messages({
    "string.base": "Additional info must be a string"
  }),
  categories: custom
    .array()
    .items(
      joi.object({
        _id: joi.string().required()
      })
    )
    .required()
    .messages({
      "array.base": "Categories must be an array",
      "any.required": "Categories is required"
    }),
  materials: custom
    .array()
    .items(
      joi.object({
        _id: joi.string().required(),
        reservedQuantity: joi.number().required()
      })
    )
    .required()
    .messages({
      "array.base": "Materials must be an array",
      "any.required": "Materials is required"
    }),
  removed_images: custom.array().messages({
    "string.base": "removed_images info must be a string"
  })
})

module.exports = updateMeetingRoomValidationSchema
