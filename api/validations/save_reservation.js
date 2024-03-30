const joi = require("joi")

const saveReservationValidationSchema = joi.object({
  participants: joi.number().required().messages({
    "number.base": "Participants must be a number",
    "any.required": "Participants is required"
  }),
  reservation_range: joi.array().items(joi.date()).length(2).required().messages({
    "array.base": "Reservation range must be an array",
    "array.length": "Reservation range must contain exactly 2 dates",
    "any.required": "Reservation range is required"
  }),
  additional_info: joi.string().messages({
    "string.base": "Additional info must be a string"
  }),
  meeting_rooms: joi.string().required().messages({
    "any.required": "Meeting room is a required"
  }),
  users: joi.string().required().messages({
    "any.required": "User is a required"
  })
})

module.exports = saveReservationValidationSchema
