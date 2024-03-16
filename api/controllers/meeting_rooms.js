const meetingRoomModel = require("../models/meeting_rooms")
const materialModel = require("../models/materials")

const getAllMeetingRooms = async (req, res) => {
  const meetingRooms = await meetingRoomModel.find().populate("materials._id")
  const data = meetingRooms.map((meetingRoom) => meetingRoom.toObject())
  res.status(200).json({
    meeting_rooms: data
  })
}

const saveMeetingRoom = async (req, res) => {
  try {
    const { name, description, capacity, length, width, height, categories, materials } = req.body
    const parseMaterials = JSON.parse(materials)
    const parseCategories = JSON.parse(categories)
    const imagesMeeTingRoom = []
    req.files.map((file) => {
      imagesMeeTingRoom.push(file.path)
    })
    const meetingRoom = new meetingRoomModel({
      name: name,
      description: description,
      capacity: capacity,
      length: length,
      width: width,
      height: height,
      images: imagesMeeTingRoom,
      categories: parseCategories,
      materials: parseMaterials
    })

    await meetingRoom.save()

    const promises = parseMaterials.map(async (item) => {
      const material = await materialModel.findOne({ _id: item._id })
      if (material) {
        material.availableQuantity -= item.reservedQuantity
        await material.save()
      }
    })

    await Promise.all(promises)

    res.status(201).json({
      message: "Meeting room saved successfully"
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

module.exports = {
  getAllMeetingRooms,
  saveMeetingRoom
}
