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

    const meetingRoomsWithMaterials = await Promise.all(
      meetingRooms.map(async (meetingRoom) => {
        const materialsDetails = await Promise.all(
          meetingRoom.materials.map(async (material) => {
            return await materialModel.findOne({ _id: material._id })
          })
        )
        return {
          ...meetingRoom.toObject(),
          materialsDetails: materialsDetails
        }
      })
    )

    res.status(200).json({
      meeting_rooms: meetingRoomsWithMaterials,
      total_pages: totalPages
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
}

const updateMeetingRoomState = async (req, res) => {
  try {
    const { id } = req.params
    const { availability } = req.body
    const meetingRoom = await meetingRoomModel.findById(id)
    if (!meetingRoom) {
      return res.status(404).json({
        error: "Meeting Room not found"
      })
    }

    await meetingRoomModel.findByIdAndUpdate(id, { availability: availability })

    res.status(200).json({
      message: "Meeting Room state updated successfully"
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
}

const updateMeetingRoom = async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, capacity, length, width, height, categories, materials, removed_images } = req.body
    const parseMaterials = JSON.parse(materials)

    const existingMeetingRoom = await meetingRoomModel.findById(id)

    if (!existingMeetingRoom) {
      return res.status(404).json({ error: "Meeting room not found" })
    }

    for (let material of parseMaterials) {
      const existingMaterial = await materialModel.findOne({ _id: material._id })
      if (!existingMaterial) {
        return res.status(400).json({ error: `Material with ID ${material._id} not found` })
      }
      const oldMaterial = existingMeetingRoom.materials.find((m) => m._id.equals(material._id))
      const availableQuantity = existingMaterial.availableQuantity + (oldMaterial ? oldMaterial.reservedQuantity : 0)
      if (material.reservedQuantity > availableQuantity) {
        return res.status(400).json({
          error: `Selected quantity (${material.reservedQuantity}) exceeds available quantity (${availableQuantity}) for ${existingMaterial.name}`
        })
      }
    }

    //update availableQuantity for materials ( existing items or new items )
    for (let newMaterial of parseMaterials) {
      const existingMaterial = existingMeetingRoom.materials.find((m) => m._id == newMaterial._id)
      if (existingMaterial) {
        const oldReservedQuantity = existingMaterial.reservedQuantity
        const newReservedQuantity = newMaterial.reservedQuantity
        const difference = oldReservedQuantity - newReservedQuantity

        existingMaterial.reservedQuantity = newReservedQuantity

        const materialToUpdate = await materialModel.findById(existingMaterial._id)
        materialToUpdate.availableQuantity += difference
        await materialToUpdate.save()
      } else {
        const materialToAdd = await materialModel.findById(newMaterial._id)
        if (materialToAdd) {
          materialToAdd.availableQuantity -= newMaterial.reservedQuantity
          await materialToAdd.save()
        }
      }
    }

    //update availableQuantity for materials ( removed items )
    const removedMaterials = existingMeetingRoom.materials.filter(
      (existingMaterial) => !parseMaterials.some((newMaterial) => newMaterial._id == existingMaterial._id)
    )
    for (let removedMaterial of removedMaterials) {
      const materialToUpdate = await materialModel.findById(removedMaterial._id)
      if (materialToUpdate) {
        materialToUpdate.availableQuantity += removedMaterial.reservedQuantity
        await materialToUpdate.save()
      }
    }

    const parseCategories = JSON.parse(categories)
    const updateData = {
      name: name,
      description: description,
      capacity: capacity,
      length: length,
      width: width,
      height: height,
      categories: parseCategories,
      materials: parseMaterials
    }

    if (req.files.length > 0) {
      const imagesMeetingRoom = []
      req.files.map((file) => {
        imagesMeetingRoom.push(file.path)
      })
      updateData.images = imagesMeetingRoom
    }

    const meetingRoomUpdated = await meetingRoomModel.findByIdAndUpdate(id, updateData, { new: true })

    const relativeFilePathArr = []
    if (req.files.length > 0) {
      for (let file of req.files) {
        const tempFilePath = file.path
        const meetingRoomId = meetingRoomUpdated._id.toString()
        const destinationDir = path.join(__dirname, "../../", "uploads", "meeting_rooms", meetingRoomId)
        const newFilePath = path.join(destinationDir, file.filename)
        if (!fs.existsSync(destinationDir)) {
          fs.mkdirSync(destinationDir, { recursive: true })
        }
        fs.renameSync(tempFilePath, newFilePath)
        const relativeFilePath = path.relative(path.join(__dirname, "../../"), newFilePath)
        relativeFilePathArr.push(relativeFilePath)
      }
    }

    const totalImages = [...existingMeetingRoom.images, ...relativeFilePathArr]

    const parseRemovedImages = JSON.parse(removed_images)
    if (parseRemovedImages.length > 0) {
      parseRemovedImages.map((image) => {
        const relativePath = image.split("uploads")[1]
        const imagePath = path.join(__dirname, "../../", "uploads", relativePath)
        console.log(relativePath)
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath)
        }
        const indexToRemove = totalImages.findIndex((item) => {
          return item === "uploads" + relativePath
        })
        console.log(indexToRemove)
        if (indexToRemove !== -1) {
          totalImages.splice(indexToRemove, 1)
        }
      })
    }

    meetingRoomUpdated.images = totalImages
    await meetingRoomUpdated.save()

    res.status(200).json({
      message: "Meeting room updated successfully"
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
  getAllMeetingRoomsPagination,
  updateMeetingRoomState,
  updateMeetingRoom
}
