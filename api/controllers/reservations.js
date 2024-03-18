const reservationsModel = require("../models/reservations")

const saveReservation = async (req, res) => {
  try {
    const { participants, additional_info, meeting_rooms, users } = req.body
    const [start_date, end_date] = req.body.reservation_range

    const today = new Date().setHours(0, 0, 0, 0)
    if (new Date(start_date).setHours(0, 0, 0, 0) < today || new Date(end_date).setHours(0, 0, 0, 0) < today) {
      return res.status(400).json({ message: "Reservation dates cannot be before today's date" })
    }

    const existingReservations = await reservationsModel.find({ meeting_rooms: meeting_rooms })

    const overlappingReservation = existingReservations.find((reservation) => {
      const startDate = new Date(reservation.start_date)
      const endDate = new Date(reservation.end_date)
      const newStartDate = new Date(start_date)
      const newEndDate = new Date(end_date)

      return (
        (newStartDate >= startDate && newStartDate <= endDate) ||
        (newEndDate >= startDate && newEndDate <= endDate) ||
        (newStartDate <= startDate && newEndDate >= endDate)
      )
    })

    if (overlappingReservation) {
      return res.status(400).json({
        message: "Selected date range is overlapping with an existing reservation for the same meeting room"
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

    res.status(201).json({
      message: "Reservation saved successfully"
    })
  } catch (error) {
    res.status(500).json({
      message: error
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
      message: error
    })
  }
}

module.exports = {
  saveReservation,
  getReservedDates
}
