const mongoose = require("mongoose")

const meetingRoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  length: {
    type: Number,
    required: true
  },
  width: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  availability: {
    type: Boolean,
    default: true
  },
  capacity: {
    type: Number,
    required: true
  },
  images: {
    type: Array,
    required: true
  },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories"
    }
  ],
  materials: [
    {
      material: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "materials"
      },
      reservedQuantity: {
        type: Number,
        required: true
      }
    }
  ]
})

module.exports = mongoose.model("meeting_rooms", meetingRoomSchema)
