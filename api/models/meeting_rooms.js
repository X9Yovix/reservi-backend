const mongoose = require("mongoose")

const meetingRoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
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
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "materials"
      },
      reservedQuantity: {
        type: Number,
        required: true
      }
    }
  ],
  is_deleted: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model("meeting_rooms", meetingRoomSchema)
