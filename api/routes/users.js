const express = require("express")
const router = express.Router()
const usersController = require("../controllers/users")
const auth = require("../middlewares/auths")

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
 *     tags: [Clients]
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal Server Error
 */
router.get("/", auth.isAdmin, usersController.getAllUsers)

/**
 * @swagger
 * /users/count:
 *   get:
 *     summary: Count users
 *     description: Retrieve the total number of users
 *     tags: [Clients]
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal Server Error
 */
router.get("/count", auth.isAdmin, usersController.countUsers)

module.exports = router
