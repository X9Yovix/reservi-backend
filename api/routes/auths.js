const express = require("express")
const router = express.Router()
const authsController = require("../controllers/auths")
const validate = require("../middlewares/validation_middleware")
const loginValidationSchema = require("../validations/login_validation")
const registerValidationSchema = require("../validations/register_validation")
const requestResetPasswordValidationSchema = require("../validations/request_reset_password_validation")
const resetPasswordValidationSchema = require("../validations/reset_password_validation")

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API endpoints for user authentication
 */

/**
 * @swagger
 * /auths/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user
 *     tags: [Authentication]
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
router.post("/register", validate(registerValidationSchema), authsController.register)

/**
 * @swagger
 * /auths/login:
 *   post:
 *     summary: Login a user
 *     description: Login a user
 *     tags: [Authentication]
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

router.post("/login", validate(loginValidationSchema), authsController.login)

/**
 * @swagger
 * /auths/reset-password/request:
 *   post:
 *     summary: Request a password reset
 *     description: Send an email with a reset password link
 *     tags: [Authentication]
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
router.post("/reset-password/request", validate(requestResetPasswordValidationSchema), authsController.resetPasswordRequest)

/**
 * @swagger
 * /auths/reset-password/reset:
 *   post:
 *     summary: Reset password
 *     description: Reset user's password using a verified token
 *     tags: [Authentication]
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
router.post("/reset-password/reset/:token", validate(resetPasswordValidationSchema), authsController.resetPassword)

module.exports = router
