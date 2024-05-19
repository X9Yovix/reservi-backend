const reservationsModel = require("../models/reservations")
const usersModel = require("../models/users")
const meetingRoomModel = require("../models/meeting_rooms")
const sendEmailService = require("../configs/nodemailer")
const fs = require("fs")
const path = require("path")

const saveReservation = async (req, res) => {
  try {
    const { participants, additional_info, meeting_rooms, users } = req.body
    const [start_date, end_date] = req.body.reservation_range

    const meetingRoom = await meetingRoomModel.findById(meeting_rooms)
    if (!meetingRoom) {
      return res.status(404).json({
        error: "Meeting room not found"
      })
    }
    if (participants < 1) {
      return res.status(400).json({
        error: "Participants must be greater than 0"
      })
    }

    if (meetingRoom.capacity < participants) {
      return res.status(400).json({
        error: "Participants must be less than or equal to the capacity of the meeting room"
      })
    }

    if (meetingRoom.availability == false) {
      return res.status(400).json({
        error: "This room is currently unavailable for reservations"
      })
    }

    if (meetingRoom.is_deleted == true) {
      return res.status(400).json({
        error: "This room has been deleted"
      })
    }

    //const today = new Date().setHours(0, 0, 0, 0)
    const today = new Date()
    if (new Date(start_date).setHours(0, 0, 0, 0) < today || new Date(end_date).setHours(0, 0, 0, 0) < today) {
      return res.status(400).json({
        error: "Reservation dates cannot be before today's date"
      })
    }

    const existingReservations = await reservationsModel.find({ meeting_rooms: meeting_rooms })

    const overlappingReservation = existingReservations.find((reservation) => {
      const startDateExisting = new Date(reservation.start_date)
      const endDateExisting = new Date(reservation.end_date)
    
      if (
        (new Date(start_date) >= startDateExisting && new Date(start_date) <= endDateExisting) ||
        (new Date(end_date) >= startDateExisting && new Date(end_date) <= endDateExisting) ||
        (new Date(start_date) <= startDateExisting && new Date(end_date) >= endDateExisting)
      ) {
        if (reservation.status === "pending" || reservation.status === "confirmed") {
          return true
        }
      }
      return false
    })

    if (overlappingReservation) {
      return res.status(400).json({
        error: "Selected date range is overlapping with an existing reservation for the same meeting room"
      })
    }

    const reservation = new reservationsModel({
      participants,
      start_date,
      end_date,
      additional_info,
      meeting_rooms,
      users
    })
    await reservation.save()

    res.status(200).json({
      message: "Reservation saved successfully"
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
}

const getReservedDates = async (req, res) => {
  try {
    const reservedDates = await reservationsModel.find({
      meeting_rooms: req.params.room_id
    })
    res.status(200).json({
      reservations: reservedDates
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
}

const listPendingReservations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 5

    const totalReservations = await reservationsModel.countDocuments({ status: "pending" })
    const totalPages = Math.ceil(totalReservations / pageSize)

    const pendingReservations = await reservationsModel
      .find({ status: "pending" })
      .sort({ _id: -1 })
      .populate("meeting_rooms")
      .populate("users")
      .skip((page - 1) * pageSize)
      .limit(pageSize)

    res.status(200).json({
      reservations: pendingReservations,
      total_pages: totalPages
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
}

const handleStateReservation = async (req, res) => {
  try {
    const { id } = req.params
    const { state } = req.body
    if (![2, 1, 0].includes(state)) {
      return res.status(400).json({
        error: "Invalid state"
      })
    }
    let reservation
    const options = { day: "2-digit", month: "2-digit", year: "numeric" }
    if (state === 1) {
      reservation = await reservationsModel.findByIdAndUpdate(id, { status: "confirmed" })
      const startDate = new Date(reservation.start_date).toLocaleDateString("en-GB", options)
      const endDate = new Date(reservation.end_date).toLocaleDateString("en-GB", options)
      sendEmailToUserAfterChangeState(reservation.users, state, reservation.meeting_rooms, `${startDate} - ${endDate}`)
      res.status(200).json({
        message: "Reservation approved"
      })
    } else if (state === 0) {
      reservation = await reservationsModel.findByIdAndUpdate(id, { status: "rejected" })
      const startDate = new Date(reservation.start_date).toLocaleDateString("en-GB", options)
      const endDate = new Date(reservation.end_date).toLocaleDateString("en-GB", options)
      sendEmailToUserAfterChangeState(reservation.users, state, reservation.meeting_rooms, `${startDate} - ${endDate}`)
      res.status(200).json({
        message: "Reservation rejected"
      })
    }
    //user
    else if (state === 2) {
      reservation = await reservationsModel.findByIdAndUpdate(id, { status: "canceled" })
      const startDate = new Date(reservation.start_date).toLocaleDateString("en-GB", options)
      const endDate = new Date(reservation.end_date).toLocaleDateString("en-GB", options)
      sendEmailToUserAfterChangeState(reservation.users, state, reservation.meeting_rooms, `${startDate} - ${endDate}`)
      res.status(200).json({
        message: "Reservation canceled"
      })
    }
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
}

const sendEmailToUserAfterChangeState = async (userId, state, roomId, reservationRange) => {
  try {
    const user = await usersModel.findById(userId)
    const room = await meetingRoomModel.findById(roomId)
    const emailSubject = "Reservation State"
    const htmlTemplatePath = path.join(__dirname, "../views", "reservation_state.html")
    const htmlTemplate = fs.readFileSync(htmlTemplatePath, "utf-8")
    let text
    if (state === 1) {
      text = `Your reservation has been approved at ${room.name} ranging from ${reservationRange}`
    } else if (state === 0) {
      text = `Your reservation has been rejected at ${room.name} ranging from ${reservationRange}`
    }
    //user
    else if (state === 2) {
      text = `Your reservation has been canceled at ${room.name} ranging from ${reservationRange}`
    }
    const htmlContent = htmlTemplate.replace("reservationState", text)
    const emailSent = await sendEmailService(user.email, emailSubject, htmlContent)
    return emailSent ? true : false
  } catch (error) {
    return false
  }
}

const getAllReservations = async (req, res) => {
  try {
    const reservations = await reservationsModel.find()
    const data = reservations.map((reservation) => reservation.toObject())
    res.status(200).json({
      reservations: data
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
}

const listReservationsAuthenticatedUser = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 10
    const userId = req.params.id
    const reservations = await reservationsModel
      .find({ users: userId })
      .sort({ _id: -1 })
      .populate({
        path: "meeting_rooms",
        populate: {
          path: "categories"
        }
      })
      .skip((page - 1) * pageSize)
      .limit(pageSize)

    const totalReservations = await reservationsModel.countDocuments({ users: userId })
    const totalPages = Math.ceil(totalReservations / pageSize)
    res.status(200).json({
      reservations: reservations,
      total_pages: totalPages
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
}

const updateReservationRequest = async (req, res) => {
  try {
    const { id } = req.params
    const { participants, additional_info, meeting_rooms } = req.body
    const [start_date, end_date] = req.body.reservation_range

    const reservation = await reservationsModel.findById(id)
    if (!reservation) {
      return res.status(404).json({
        error: "Reservation not found"
      })
    }

    //const today = new Date().setHours(0, 0, 0, 0)
    const today = new Date()
    if (new Date(start_date).setHours(0, 0, 0, 0) < today || new Date(end_date).setHours(0, 0, 0, 0) < today) {
      return res.status(400).json({ error: "Reservation dates cannot be before today's date" })
    }

    const { start_date: old_start_date, end_date: old_end_date } = reservation

    const existingReservations = await reservationsModel.find({ meeting_rooms: meeting_rooms })

    const overlappingReservation = existingReservations.find((reservation) => {
      const startDateExisting = new Date(reservation.start_date)
      const endDateExisting = new Date(reservation.end_date)

      if (
        (start_date >= startDateExisting && start_date <= endDateExisting) ||
        (end_date >= startDateExisting && end_date <= endDateExisting) ||
        (start_date <= startDateExisting && end_date >= endDateExisting)
      ) {
        if (
          (old_start_date >= startDateExisting && old_start_date <= endDateExisting) ||
          (old_end_date >= startDateExisting && old_end_date <= endDateExisting) ||
          (old_start_date <= startDateExisting && old_end_date >= endDateExisting)
        ) {
          return false
        }
        if (reservation.status === "pending" || reservation.status === "confirmed") {
          return true
        }
      }
      return false
    })

    if (overlappingReservation) {
      return res.status(400).json({
        error: "Selected date range is overlapping with an existing reservation for the same meeting room"
      })
    }

    await reservationsModel.findByIdAndUpdate(id, { participants, start_date, end_date, additional_info })

    res.status(200).json({
      message: "Reservation updated successfully"
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
}

module.exports = {
  saveReservation,
  getReservedDates,
  listPendingReservations,
  handleStateReservation,
  listReservationsAuthenticatedUser,
  updateReservationRequest,
  getAllReservations
}
