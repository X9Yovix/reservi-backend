const categoryModel = require("../models/categories")

const getAllCategories = async (req, res) => {
  const materials = await categoryModel.find()
  const data = materials.map((material) => material.toObject())
  res.status(200).json({
    categories: data
  })
}

const saveCategory = async (req, res) => {
  try {
    const category = new categoryModel(req.body)
    await category.save()
    res.status(201).json({
      message: "Category saved successfully"
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

module.exports = {
  getAllCategories,
  saveCategory
}
