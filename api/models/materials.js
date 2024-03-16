const mongoose = require("mongoose")

const materialsSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  totalQuantity: {
    type: Number,
    required: true
  },
  availableQuantity: {
    type: Number,
    required: true
  },
  availability: {
    type: Boolean,
    default: true
  }
})

module.exports = mongoose.model("materials", materialsSchema)
