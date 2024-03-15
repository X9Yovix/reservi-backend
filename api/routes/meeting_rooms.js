const express = require("express")
const router = express.Router()
const meetingRoomsController = require("../controllers/meeting_rooms")
const upload = require("../middlewares/image_upload")

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
router.get("/", meetingRoomsController.getAllMeetingRooms)

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
router.post("/", upload.array("images"), meetingRoomsController.saveMeetingRoom)

module.exports = router
