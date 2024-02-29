const mongoose = require("mongoose")

const equipementScheman = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  availability: {
    type: Boolean,
    required: true
  }
})

module.exports = mongoose.model("equipements", equipementScheman)
