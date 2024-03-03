const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const usersSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  phone: {
    type: String
  },
  birthday: {
    type: Date,
    required: true
  },
  role: {
    type: String,
    required: true
  }
})

const saltRounds = 10

usersSchema.pre("save", async function (next) {
  const user = this

  if (!user.isModified("password")) {
    return next()
  }

  try {
    const salt = await bcrypt.genSalt(saltRounds)
    const hashedPassword = await bcrypt.hash(user.password, salt)
    user.password = hashedPassword
    next()
  } catch (error) {
    return next(error)
  }
})

usersSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password)
  } catch (error) {
    throw new Error(error)
  }
}

module.exports = mongoose.model("users", usersSchema)
