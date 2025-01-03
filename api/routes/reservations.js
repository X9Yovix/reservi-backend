const express = require("express")
const router = express.Router()
const reservationsController = require("../controllers/reservations")
const validate = require("../middlewares/validation")
const saveValidationSchema = require("../validations/save_reservation")
const updateValidationSchema = require("../validations/update_reservation")
const auth = require("../middlewares/auths")

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
router.post("/", validate(saveValidationSchema), reservationsController.saveReservation)

/**
 * @swagger
 * /reservations/{room_id}:
 *   get:
 *     summary: Get reserved dates
 *     description: Retrieve a list of reserved dates for a specific meeting room
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: room_id
 *         required: true
 *         description: Meeting room ID
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal Server Error
 */
router.get("/:room_id", reservationsController.getReservedDates)

/**
 * @swagger
 * /reservations/state/pendings:
 *   get:
 *     summary: Get pending reservations
 *     description: Retrieve a list of pending reservations
 *     tags: [Reservations]
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal Server Error
 */
router.get("/state/pendings", reservationsController.listPendingReservations)

/**
 * @swagger
 * /reservations/state/decision/{id}:
 *   put:
 *     summary: Handle reservation state
 *     description: Update the state of a reservation from admin panel
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Reservation ID
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               state:
 *                 type: string
 *             required:
 *               - state
 *     responses:
 *       200:
 *         description: The reservation state was updated successfully
 *       500:
 *         description: Internal Server Error
 */
router.put("/state/decision/:id", auth.isAdmin, reservationsController.handleStateReservation)

/**
 * @swagger
 * /reservations/state/decision/client/{id}:
 *   put:
 *     summary: Handle reservation state
 *     description: Update the state of a reservation from client panel
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Reservation ID
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             state:
 *               type: string
 *         required:
 *           - state
 *     responses:
 *       200:
 *         description: The reservation state was updated successfully
 *       500:
 *         description: Internal Server Error
 */
router.put("/state/decision/client/:id", reservationsController.handleStateReservationClient)

/**
 * @swagger
 * /reservations/user/{id}:
 *   get:
 *     summary: Get user reservations
 *     description: Retrieve a list of reservations for a specific user
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal Server Error
 */
router.get("/user/:id", reservationsController.listReservationsAuthenticatedUser)

/**
 * @swagger
 * /reservations/user/update/{id}:
 *   put:
 *     summary: Update reservation request
 *     description: Update a reservation request from user panel
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Reservation ID
 *         schema:
 *           type: number
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
 *         description: The reservation was updated successfully
 *       500:
 *         description: Internal Server Error
 */
router.put("/user/update/:id", validate(updateValidationSchema), reservationsController.updateReservationRequest)

/**
 * @swagger
 * /reservations:
 *  get:
 *   summary: Get all reservations
 *   description: Retrieve a list of all reservations
 *   tags: [Reservations]
 *   responses:
 *    200:
 *      description: Success
 *   500:
 *     description: Internal Server Error
 */
router.get("/", auth.isAdmin, reservationsController.getAllReservations)

module.exports = router
