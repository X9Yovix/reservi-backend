const usersModel = require("../models/users")

const getAllUsers = async (req, res) => {
  try {
    const users = await usersModel.find()
    const usersData = users.map((user) => user.toObject())
    res.status(200).json({
      users: usersData
    })
  } catch (error) {
    console.error("Error fetching users", error)
    res.status(500).json({
      message: error
    })
  }
}

module.exports = {
  getAllUsers
}
