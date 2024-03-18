const express = require("express")
const router = express.Router()
const categoriesController = require("../controllers/categories")
const validate = require("../middlewares/validation")
const saveValidationSchema = require("../validations/save_category")

/**
 * @swagger
 * tags:
 *  name: Categories
 *  description: API endpoints for categories
 */

/**
 * @swagger
 * /categories:
 * get:
 *   summary: Get all categories
 *   description: Retrieve a list of all categories
 *   tags: [Categories]
 *   responses:
 *     200:
 *       description: Success
 *     500:
 *       description: Internal Server Error
 */
router.get("/", categoriesController.getAllCategories)

/**
 * @swagger
 * /materials:
 *  post:
 *    summary: Save a new category
 *    description: Save a new category
 *    tags: [Categories]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              color:
 *                type: string
 *    responses:
 *      201:
 *        description: Category saved successfully
 *      400:
 *        description: Bad request
 *      500:
 *        description: Internal Server Error
 */
router.post("/", validate(saveValidationSchema), categoriesController.saveCategory)

module.exports = router
