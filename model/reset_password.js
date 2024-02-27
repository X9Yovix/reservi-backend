const mongoose = require("mongoose")

const resetPasswordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  token: String,
  expires: Date
})

module.exports = mongoose.model("ResetPassword", resetPasswordSchema)
