const express = require("express")
const router = express.Router()
const meetingRoomsController = require("../controllers/meeting_rooms")
const upload = require("../middlewares/image_upload")
const validate = require("../middlewares/validation")
const updateValidationSchema = require("../validations/update_meeting_room")
const saveValidationSchema = require("../validations/save_meeting_room")
const auth = require("../middlewares/auths")

/**
 * @swagger
 * tags:
 *  name: Meeting Rooms
 *  description: API endpoints for meeting rooms
 */

/**
 * @swagger
 * /meeting_rooms:
 *  get:
 *    summary: Get all meeting rooms
 *    description: Retrieve a list of all meeting rooms
 *    tags: [Meeting Rooms]
 *    responses:
 *      200:
 *        description: Success
 *      500:
 *        description: Internal Server Error
 */
router.get("/", auth.isAdmin, meetingRoomsController.getAllMeetingRooms)

/**
 * @swagger
 * /meeting_rooms:
 *  post:
 *    summary: Save a meeting room
 *    description: Save a new meeting room
 *    tags: [Meeting Rooms]
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              description:
 *                type: string
 *              capacity:
 *                type: integer
 *              length:
 *                type: integer
 *              width:
 *                type: integer
 *              height:
 *                type: integer
 *              materials:
 *                type: string
 *              images:
 *                type: array
 *                items:
 *                  type: string
 *    responses:
 *      201:
 *        description: Meeting room saved successfully
 *      400:
 *        description: Bad request
 *      500:
 *        description: Internal Server Error
 */
router.post("/", auth.isAdmin, upload.array("images"), validate(saveValidationSchema), meetingRoomsController.saveMeetingRoom)

/**
 * @swagger
 * /meeting_rooms/{id}:
 *   get:
 *     summary: Get a meeting room
 *     description: Retrieve a meeting room
 *     tags: [Meeting Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Meeting room not found
 *       500:
 *         description: Internal Server Error
 */
router.get("/:id", auth.isAdmin, meetingRoomsController.getMeetingRoom)

/**
 * @swagger
 * /meeting_rooms/method/pagination:
 * get:
 *   summary: Get all meeting rooms with pagination
 *   description: Retrieve a list of all meeting rooms with pagination
 *   tags: [Meeting Rooms]
 *   parameters:
 *     - in: query
 *       name: page
 *       schema:
 *         type: number
 *       description: Page number
 *     - in: query
 *       name: pageSize
 *       schema:
 *         type: number
 *       description: Number of items in a page
 *   responses:
 *     200:
 *       description: Success
 *     500:
 *       description: Internal Server Error
 */
router.get("/method/pagination", meetingRoomsController.getAllMeetingRoomsPagination)

/**
 * @swagger
 * /meeting_rooms/state/{id}:
 *   put:
 *     summary: Update meeting room state
 *     description: Update meeting room state
 *     tags: [Meeting Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               availability:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
router.put("/state/:id", auth.isAdmin, meetingRoomsController.updateMeetingRoomState)

/**
 * @swagger
 * /meeting_rooms/{id}:
 *   put:
 *     summary: Update a meeting room
 *     description: Update a meeting room
 *     tags: [Meeting Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               length:
 *                 type: integer
 *               width:
 *                 type: integer
 *               height:
 *                 type: integer
 *               materials:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Meeting room updated successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
router.put("/:id", auth.isAdmin, upload.array("images"), validate(updateValidationSchema), meetingRoomsController.updateMeetingRoom)

module.exports = router
