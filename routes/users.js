const express = require("express")
const router = express.Router()
const User = require("../model/user")

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal Server Error
 */
router.get("/", async (req, res) => {
  try {
    const users = await User.find()
    const usersData = users.map((user) => user.toObject())
    res.status(200).json({ users: usersData })
  } catch (error) {
    console.error("Error fetching users", error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

module.exports = router
