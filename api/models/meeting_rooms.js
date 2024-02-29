const mongoose = require("mongoose")

const meetingRoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  availability: {
    type: Boolean,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  equipements: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "equipements"
    }
  ]
})

module.exports = mongoose.model("meeting_rooms", meetingRoomSchema)
