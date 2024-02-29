const express = require("express")
const router = express.Router()
const meetingRoomsController = require("../controllers/meeting_rooms")

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

module.exports = router
