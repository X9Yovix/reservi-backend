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
    const userSaved = await user.save()

    const tempFilePath = req.file.path
    const userId = userSaved._id.toString()
    const destinationDir = path.join(__dirname, "../../", "uploads", "users", userId)
    const newFilePath = path.join(destinationDir, req.file.filename)
    if (!fs.existsSync(destinationDir)) {
      fs.mkdirSync(destinationDir, { recursive: true })
    }
    fs.renameSync(tempFilePath, newFilePath)

    const relativeFilePath = path.relative(path.join(__dirname, "../../"), newFilePath)
    userSaved.avatar = relativeFilePath
    await userSaved.save()

    res.status(200).json({
      message: "Account created successfully"
    })
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      res.status(400).json({
        error: "Email is already registered"
      })
    } else {
      res.status(500).json({
        error: error.message
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
          return res.status(500).json({
            error: err
          })
        }
        const userFiltered = {
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          address: user.address,
          phone: user.phone,
          birthday: user.birthday,
          avatar: user.avatar
        }
        return res.status(200).json({
          token: token,
          user: userFiltered,
          message: "User logged in successfully"
        })
      }
    )
  } catch (error) {
    res.status(500).json({
      error: error.message
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
        error: "Error sending password reset email, try again later"
      })
    }
  } catch (error) {
    res.status(500).json({
      error: error.message
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
