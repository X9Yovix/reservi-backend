const materialsModel = require("../models/materials")

const getAllMaterials = async (req, res) => {
  const materials = await materialsModel.find()
  const data = materials.map((material) => material.toObject())
  res.status(200).json({
    materials: data
  })
}

const saveMaterial = async (req, res) => {
  const body = req.body
  try {
    const material = new materialsModel({ ...body, availableQuantity: body.totalQuantity })
    await material.save()
    res.status(201).json({
      message: "Material saved successfully"
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

module.exports = {
  getAllMaterials,
  saveMaterial
}
