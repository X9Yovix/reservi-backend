const express = require("express")
const router = express.Router()

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
router.get("/", (req, res) => {
  res.send({ message: "List of users" })
})

module.exports = router
