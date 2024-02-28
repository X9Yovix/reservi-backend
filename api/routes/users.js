const express = require("express")
const router = express.Router()
const usersController = require("../controllers/users")

/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: API endpoints for clients
 */

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
router.get("/", usersController.getAllUsers)

module.exports = router
