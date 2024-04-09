const usersModel = require("../models/users")

const getAllUsers = async (req, res) => {
  try {
    const users = await usersModel.find()
    const usersData = users.map((user) => user.toObject())
    res.status(200).json({
      users: usersData
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
}

const countUsers = async (req, res) => {
  try {
    const users = await usersModel.countDocuments()
    res.status(200).json({
      count_users: users
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
}
module.exports = {
  getAllUsers,
  countUsers
}
