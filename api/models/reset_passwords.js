const mongoose = require("mongoose")

const resetPasswordsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  token: String,
  expires: Date
})

module.exports = mongoose.model("reset_passwords", resetPasswordsSchema)
