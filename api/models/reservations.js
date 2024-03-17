const mongoose = require("mongoose")

const reservationsSchema = mongoose.Schema({
  participants: {
    type: Number,
    required: true
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  additional_info: {
    type: String
  },
  status: {
    type: String,
    default: "pending"
  },
  meeting_rooms: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "meeting_rooms",
    required: true
  },
  users: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  }
})

module.exports = mongoose.model("reservations", reservationsSchema)
