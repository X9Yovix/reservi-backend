const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI,{
      dbName: process.env.MONGODB_DB,
    })
    console.log("Connected to MongoDB")
  } catch (error) {
    console.error("Error connecting to MongoDB", error)
  }
}

module.exports = connectDB
