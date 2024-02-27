const express = require("express")
const router = express.Router()
const User = require("../model/user")
const ResetPassword = require("../model/reset_password")
const jwt = require("jsonwebtoken")
const cryptoJs = require("crypto-js")
const bcrypt = require("bcryptjs")
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
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      console.error("Error registering user - Duplicate email", error)
      res.status(400).json({ error: "Email is already registered" })
    } else {
      console.error("Error registering user", error)
      res.status(500).json({ error: "Internal Server Error" })
    }
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
    jwt.sign(
      {
        _id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "7 days" },
      (err, token) => {
        if (err) {
          console.error("Error signing token", err)
          return res.status(500).json({ error: "Internal Server Error" })
        }
        const userFiltered = {
          _id: user._id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          address: user.address,
          phone: user.phone
        }
        return res.status(200).json({
          token: token,
          user: userFiltered,
          message: "User logged in successfully"
        })
      }
    )
  } catch (error) {
    console.error("Error logging in user", error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

/**
 * @swagger
 * /auths/reset-password/request:
 *   post:
 *     summary: Request a password reset
 *     description: Send an email with a reset password link
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
router.post("/reset-password/request", async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ error: "Email not found" })
    }

    const existingResetToken = await ResetPassword.findOne({
      user: user._id,
      expires: { $gt: Date.now() }
    })

    var resetToken

    if (existingResetToken) {
      resetToken = existingResetToken.token
    } else {
      resetToken = cryptoJs.SHA256(email + Date.now().toString()).toString()

      const resetPassword = new ResetPassword({
        user: user._id,
        token: resetToken,
        expires: new Date(Date.now() + 3600000)
      })

      await resetPassword.save()
    }

    res
      .status(200)
      .json({
        message: "Password reset email sent successfully, check your email"
      })
  } catch (error) {
    console.error("Error requesting password reset", error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

/**
 * @swagger
 * /auths/reset-password/reset:
 *   post:
 *     summary: Reset password
 *     description: Reset user's password using a verified token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
router.post("/reset-password/reset/:token", async (req, res) => {
  try {
    const { password, confirmPassword } = req.body
    const token = req.params.token

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" })
    }

    const resetPasswordEntry = await ResetPassword.findOne({
      token,
      expires: { $gt: Date.now() }
    })

    if (!resetPasswordEntry)
      return res.status(400).json({ error: "Invalid or expired token" })

    const user = await User.findById(resetPasswordEntry.user)

    if (!user)
      return res.status(400).json({ error: "Invalid or expired token" })

    user.password = password

    await resetPasswordEntry.deleteOne()

    await user.save()

    res.status(200).json({ message: "Password reset successful" })
  } catch (error) {
    console.error("Error resetting password", error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

module.exports = router
