const categoryModel = require("../models/categories")

const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find()
    const data = categories.map((category) => category.toObject())
    res.status(200).json({
      categories: data
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getAllCategoriesPagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 10
    const categories = await categoryModel
      .find()
      .skip((page - 1) * pageSize)
      .limit(pageSize)

    const totalCategories = await categoryModel.countDocuments()
    const totalPages = Math.ceil(totalCategories / pageSize)

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

    const category = await categoryModel.findById(id)
    if (!category) {
      return res.status(404).json({
        message: "Category not found"
      })
    }

    await categoryModel.findByIdAndUpdate(id, req.body)

    res.status(200).json({
      message: "Category updated successfully"
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
  deleteCategory,
  getAllCategoriesPagination
}
