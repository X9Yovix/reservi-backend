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

/**
 * @swagger
 * /auths/login:
 *   post:
 *     summary: Login a user
 *     description: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" })
    }
    const isMatch = await user.comparePassword(req.body.password)
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" })
    }
    res.status(200).json({ message: "User logged in successfully" })
  } catch (error) {
    console.error("Error logging in user", error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

module.exports = router
