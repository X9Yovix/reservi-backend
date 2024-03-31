const materialsModel = require("../models/materials")
const meetingRoomsModel = require("../models/meeting_rooms")

const getAllMaterials = async (req, res) => {
  try {
    const materials = await materialsModel.find()
    const data = materials.map((material) => material.toObject())
    res.status(200).json({
      materials: data
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
}

const getAllMaterialsPagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 10
    const materials = await materialsModel
      .find()
      .sort({ _id: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)

    const totalMaterials = await materialsModel.countDocuments()
    const totalPages = Math.ceil(totalMaterials / pageSize)

    res.status(200).json({
      materials: materials,
      total_pages: totalPages
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
}

const saveMaterial = async (req, res) => {
  try {
    const body = req.body
    const material = new materialsModel({ ...body, availableQuantity: body.totalQuantity })
    await material.save()
    res.status(200).json({
      message: "Material saved successfully"
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
}

const getMaterial = async (req, res) => {
  try {
    const material = await materialsModel.findById(req.params.id)
    res.status(200).json(material)
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
}

const updateMaterial = async (req, res) => {
  try {
    const { id } = req.params

    const material = await materialsModel.findById(id)
    if (!material) {
      return res.status(404).json({
        error: "Material not found"
      })
    }

    const existingTotalQuantity = material.totalQuantity
    const availableQuantity = material.availableQuantity
    const newTotalQuantity = req.body.totalQuantity

    const quantityDifference = newTotalQuantity - existingTotalQuantity
    if (newTotalQuantity < existingTotalQuantity) {
      if (availableQuantity < Math.abs(quantityDifference)) {
        return res.status(400).json({
          error: "Not enough available quantity to reduce the total quantity"
        })
      }
      const newAvailableQuantity = availableQuantity - Math.abs(quantityDifference)
      await materialsModel.findByIdAndUpdate(id, { ...req.body, availableQuantity: newAvailableQuantity })
    } else {
      const newAvailableQuantity = Math.abs(quantityDifference) + material.availableQuantity
      await materialsModel.findByIdAndUpdate(id, { ...req.body, availableQuantity: newAvailableQuantity })
    }
    res.status(200).json({
      message: "Material updated successfully"
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
}

const updateMaterialState = async (req, res) => {
  try {
    const { id } = req.params
    const { availability } = req.body
    const material = await materialsModel.findById(id)
    if (!material) {
      return res.status(404).json({
        error: "Material not found"
      })
    }

    await materialsModel.findByIdAndUpdate(id, { availability: availability })

    res.status(200).json({
      message: "Material state updated successfully"
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
}

const deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params

    const data = await meetingRoomsModel.find({ "materials._id": id })

    if (data.length > 0) {
      return res.status(400).json({
        error: "Material is used in a meeting room"
      })
    }
    await materialsModel.findByIdAndDelete(id)

    res.status(200).json({
      message: "Material deleted successfully"
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
}

module.exports = {
  getAllMaterials,
  saveMaterial,
  getAllMaterialsPagination,
  getMaterial,
  updateMaterial,
  deleteMaterial,
  updateMaterialState
}
