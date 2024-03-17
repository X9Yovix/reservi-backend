const meetingRoomModel = require("../models/meeting_rooms")
const materialModel = require("../models/materials")
const categoryModel = require("../models/categories")

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

const getMeetingRoom = async (req, res) => {
  try {
    const meetingRoom = await meetingRoomModel.findOne({ _id: req.params.id })
    if (!meetingRoom) {
      return res.status(404).json({ message: "Meeting room not found" })
    }

    const categoriesPromise = meetingRoom.categories.map(async (category) => {
      return await categoryModel.findOne({ _id: category })
    })

    const materialsPromise = meetingRoom.materials.map(async (material) => {
      return await materialModel.findOne({ _id: material._id })
    })

    const [categories, materials] = await Promise.all([Promise.all(categoriesPromise), Promise.all(materialsPromise)])

    res.status(200).json({
      meeting_room: meetingRoom,
      materials: materials,
      categories: categories
    })
  } catch (error) {
    console.error("Error occurred while fetching meeting room:", error)
    res.status(500).json({
      message: error
    })
  }
}

module.exports = {
  getAllMeetingRooms,
  saveMeetingRoom,
  getMeetingRoom
}
