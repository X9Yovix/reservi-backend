const express = require("express")
const router = express.Router()
const User = require("../model/user")

/**
 * @swagger
 * /auths/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *                 required: false
 *               address:
 *                 type: string
 *                 required: false
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal Server Error
 */
router.post("/register", async (req, res) => {
  try {
    const user = new User({ ...req.body, role: "user" })
    await user.save()
    res.status(200).json({ message: "User registered successfully" })
  } catch (error) {
    console.error("Error registering user", error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

module.exports = router
