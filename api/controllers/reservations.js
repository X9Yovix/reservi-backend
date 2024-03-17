const reservationsModel = require("../models/reservations")

const saveReservation = async (req, res) => {
  try {
    const { participants, additional_info, meeting_rooms, users } = req.body
    const [start_date, end_date] = req.body.reservation_range

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
