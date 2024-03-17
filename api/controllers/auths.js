const usersModel = require("../models/users")
const resetPasswordsModel = require("../models/reset_passwords")
const jwt = require("jsonwebtoken")
const cryptoJs = require("crypto-js")
const sendEmailService = require("../configs/nodemailer")
const fs = require("fs")
const path = require("path")

const register = async (req, res) => {
  try {
    const user = new usersModel({ ...req.body, role: "user" })
    await user.save()
    res.status(200).json({
      message: "User registered successfully"
    })
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      console.error("Error registering user - Duplicate email", error)
      res.status(400).json({
        error: "Email is already registered"
      })
    } else {
      console.error("Error registering user", error)
      res.status(500).json({
        message: error
      })
    }
  }
}

const login = async (req, res) => {
  try {
    const user = await usersModel.findOne({ email: req.body.email })
    if (!user) {
      return res.status(400).json({
        error: "Invalid credentials"
      })
    }
    const isMatch = await user.comparePassword(req.body.password)
    if (!isMatch) {
      return res.status(400).json({
        error: "Invalid credentials"
      })
    }
    jwt.sign(
      {
        _id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION_DATE },
      (err, token) => {
        if (err) {
          console.error("Error signing token", err)
          return res.status(500).json({
            message: err
          })
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
    res.status(500).json({
      message: error
    })
  }
}

const resetPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body

    const user = await usersModel.findOne({ email })
    if (!user) {
      return res.status(400).json({
        error: "Email not found"
      })
    }

    const existingResetToken = await resetPasswordsModel.findOne({
      user: user._id,
      expires: { $gt: Date.now() }
    })

    var resetToken

    if (existingResetToken) {
      resetToken = existingResetToken.token
    } else {
      resetToken = cryptoJs.SHA256(email + Date.now().toString()).toString()
      const expiration = new Date(Date.now() + process.env.RESET_TOKEN_EXPIRATION_H * 60 * 60 * 1000)
      const resetPassword = new resetPasswordsModel({
        user: user._id,
        token: resetToken,
        expires: expiration
      })
      await resetPassword.save()
    }
    const emailSubject = "Password Reset"
    const htmlTemplatePath = path.join(__dirname, "../views", "reset_password.html")
    const htmlTemplate = fs.readFileSync(htmlTemplatePath, "utf-8")
    const htmlContent = htmlTemplate.replace("resetLink", `${process.env.FRONTEND_URL}/reset-password/${resetToken}`)

    const emailSent = await sendEmailService(email, emailSubject, htmlContent)

    if (emailSent) {
      return res.status(200).json({
        message: "Password reset email sent successfully, check your email"
      })
    } else {
      return res.status(500).json({
        message: "Error sending password reset email, try again later"
      })
    }
  } catch (error) {
    console.error("Error requesting password reset", error)
    res.status(500).json({
      message: error
    })
  }
}

const resetPassword = async (req, res) => {
  try {
    const { password } = req.body
    const token = req.params.token

    const resetPasswordEntry = await resetPasswordsModel.findOne({
      token,
      expires: { $gt: Date.now() }
    })

    if (!resetPasswordEntry) {
      return res.status(400).json({
        error: "Invalid or expired token"
      })
    }
    const user = await usersModel.findById(resetPasswordEntry.user)

    if (!user) {
      return res.status(400).json({
        error: "Invalid or expired token"
      })
    }

    user.password = password

    await resetPasswordEntry.deleteOne()

    await user.save()

    res.status(200).json({
      message: "Password reset successful"
    })
  } catch (error) {
    console.error("Error resetting password", error)
    res.status(500).json({
      message: error
    })
  }
}

module.exports = {
  register,
  login,
  resetPasswordRequest,
  resetPassword
}
