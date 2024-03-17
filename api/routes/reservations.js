const express = require("express")
const router = express.Router()
const reservationsController = require("../controllers/reservations")

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: API endpoints for reservations
 */

/**
 * @swagger
 * path:
 * /reservations:
 *   post:
 *     summary: Save a reservation
 *     description: Save a new reservation
 *     tags: [Reservations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               participants:
 *                 type: number
 *               reservation_range:
 *                 type: array
 *               additional_info:
 *                 type: string
 *               meeting_rooms:
 *                 type: number
 *               users:
 *                 type: number
 *             required:
 *               - participants
 *               - reservation_range
 *               - meeting_rooms
 *     responses:
 *       200:
 *         description: The reservation was saved successfully
 *       500:
 *         description: Internal Server Error
 */
router.post("/", reservationsController.saveReservation)

router.get("/:room_id", reservationsController.getReservedDates)

module.exports = router
