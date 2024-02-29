const getAllMeetingRooms = (req, res) => {
  res.status(200).json({
    message: "Success"
  })
}

module.exports = {
  getAllMeetingRooms
}
