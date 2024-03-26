const categoryModel = require("../models/categories")

const getAllCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 10
    const categories = await categoryModel
      .find()
      .skip((page - 1) * pageSize)
      .limit(pageSize)

    const totalReservations = await categoryModel.countDocuments()
    const totalPages = Math.ceil(totalReservations / pageSize)

    res.status(200).json({
      categories: categories,
      totalPages: totalPages
    })
  } catch (error) {
    res.status(500).json({
      message: error
    })
  }
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

const getCategory = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.params.id)
    res.status(200).json(category)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 5

    const category = await categoryModel.findById(id)
    if (!category) {
      return res.status(404).json({
        message: "Category not found"
      })
    }

    await categoryModel.findByIdAndUpdate(id, req.body)

    const categories = await categoryModel
      .find()
      .skip((page - 1) * pageSize)
      .limit(pageSize)

    const totalReservations = await categoryModel.countDocuments()
    const totalPages = Math.ceil(totalReservations / pageSize)

    res.status(200).json({
      message: "Category updated successfully",
      categories: categories,
      totalPages: totalPages
    })
  } catch (error) {
    res.status(500).json({
      message: error
    })
  }
}

const deleteCategory = async (req, res) => {
  try {
    await categoryModel.findByIdAndDelete(req.params.id)
    res.status(200).json({
      message: "Category deleted successfully"
    })
  } catch (error) {
    res.status(500).json({
      message: error
    })
  }
}

module.exports = {
  getAllCategories,
  saveCategory,
  getCategory,
  updateCategory,
  deleteCategory
}
