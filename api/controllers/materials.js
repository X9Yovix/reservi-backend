const materialsModel = require("../models/materials")

const getAllMaterials = async (req, res) => {
  try {
    const materials = await materialsModel.find()
    const data = materials.map((material) => material.toObject())
    res.status(200).json({
      materials: data
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const saveMaterial = async (req, res) => {
  try {
    const body = req.body
    const material = new materialsModel({ ...body, availableQuantity: body.totalQuantity })
    await material.save()
    res.status(201).json({
      message: "Material saved successfully"
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  getAllMaterials,
  saveMaterial
}
