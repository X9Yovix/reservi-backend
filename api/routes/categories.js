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

/**
 * @swagger
 * /categories/{id}:
 *  get:
 *    summary: Get a category by ID
 *    description: Retrieve a category by ID
 *    tags: [Categories]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: ID of the category to retrieve
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Success
 *      500:
 *        description: Internal Server Error
 */
router.get("/:id", categoriesController.getCategory)

/**
 * @swagger
 * /categories/{id}:
 *  put:
 *    summary: Update a category by ID
 *    description: Update a category by ID
 *    tags: [Categories]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: ID of the category to update
 *        schema:
 *          type: string
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
 *      200:
 *        description: Category updated successfully
 *      400:
 *        description: Bad request
 *      404:
 *        description: Category not found
 *      500:
 *        description: Internal Server Error
 */
router.put("/:id", categoriesController.updateCategory)

/**
 * @swagger
 * /categories/{id}:
 *  delete:
 *    summary: Delete a category by ID
 *    description: Delete a category by ID
 *    tags: [Categories]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: ID of the category to delete
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Category deleted successfully
 *      500:
 *        description: Internal Server Error
 */
router.delete("/:id", categoriesController.deleteCategory)

/**
 * @swagger
 * /categories/method/pagination:
 * get:
 *   summary: Get all categories with pagination
 *   description: Retrieve a list of all categories with pagination
 *   tags: [Categories]
 *   parameters:
 *     - in: query
 *       name: page
 *       schema:
 *         type: number
 *       description: Page number
 *     - in: query
 *       name: pageSize
 *       schema:
 *         type: number
 *       description: Number of items in a page
 *   responses:
 *     200:
 *       description: Success
 *     500:
 *       description: Internal Server Error
 */
router.get("/method/pagination", categoriesController.getAllCategoriesPagination)

module.exports = router
