const meetingRoomModel = require("../models/meeting_rooms")
const materialModel = require("../models/materials")
const categoryModel = require("../models/categories")
const fs = require("fs")
const path = require("path")

const getAllMeetingRooms = async (req, res) => {
  const meetingRooms = await meetingRoomModel.find().populate("materials._id").populate("categories")
  const data = meetingRooms.map((meetingRoom) => meetingRoom.toObject())
  res.status(200).json({
    meeting_rooms: data
  })
}

const saveMeetingRoom = async (req, res) => {
  try {
    const { name, description, capacity, length, width, height, categories, materials } = req.body
    const parseMaterials = JSON.parse(materials)

    for (let material of parseMaterials) {
      const existingMaterial = await materialModel.findOne({ _id: material._id })
      if (!existingMaterial) {
        return res.status(400).json({ error: `Material with ID ${material._id} not found` })
      }
      if (material.reservedQuantity > existingMaterial.availableQuantity) {
        return res.status(400).json({
          error: `Selected quantity (${material.reservedQuantity}) exceeds available quantity (${existingMaterial.availableQuantity}) for ${existingMaterial.name}`
        })
      }
    }
    const parseCategories = JSON.parse(categories)
    const imagesMeetingRoom = []
    req.files.map((file) => {
      imagesMeetingRoom.push(file.path)
    })

    const meetingRoom = new meetingRoomModel({
      name: name,
      description: description,
      capacity: capacity,
      length: length,
      width: width,
      height: height,
      images: imagesMeetingRoom,
      categories: parseCategories,
      materials: parseMaterials
    })

    const meetingRoomSaved = await meetingRoom.save()

    const relativeFilePathArr = []
    for (let file of req.files) {
      const tempFilePath = file.path
      const meetingRoomId = meetingRoomSaved._id.toString()
      const destinationDir = path.join(__dirname, "../../", "uploads", "meeting_rooms", meetingRoomId)
      const newFilePath = path.join(destinationDir, file.filename)

      if (!fs.existsSync(destinationDir)) {
        fs.mkdirSync(destinationDir, { recursive: true })
      }
      fs.renameSync(tempFilePath, newFilePath)

      const relativeFilePath = path.relative(path.join(__dirname, "../../"), newFilePath)
      relativeFilePathArr.push(relativeFilePath)
    }
    meetingRoomSaved.images = relativeFilePathArr
    await meetingRoomSaved.save()

    const promises = parseMaterials.map(async (item) => {
      const material = await materialModel.findOne({ _id: item._id })
      if (material) {
        material.availableQuantity -= item.reservedQuantity
        await material.save()
      }
    })

    await Promise.all(promises)

    res.status(200).json({
      message: "Meeting room saved successfully"
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
}

const getMeetingRoom = async (req, res) => {
  try {
    const meetingRoom = await meetingRoomModel.findOne({ _id: req.params.id })
    if (!meetingRoom) {
      return res.status(404).json({
        error: "Meeting room not found"
      })
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
    res.status(500).json({
      error: error.message
    })
  }
}

const getAllMeetingRoomsPagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 6
    const meetingRooms = await meetingRoomModel
      .find()
      .sort({ _id: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)

    const totalMeetingRooms = await meetingRoomModel.countDocuments()
    const totalPages = Math.ceil(totalMeetingRooms / pageSize)

    res.status(200).json({
      meeting_rooms: meetingRooms,
      total_pages: totalPages
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
}

module.exports = {
  getAllMeetingRooms,
  saveMeetingRoom,
  getMeetingRoom,
  getAllMeetingRoomsPagination
}
