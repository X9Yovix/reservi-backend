const express = require("express")
const router = express.Router()
const materialsController = require("../controllers/materials")
const validate = require("../middlewares/validation")
const saveValidationSchema = require("../validations/save_material")

/**
 * @swagger
 * tags:
 *  name: Materials
 *  description: API endpoints for materials
 */

/**
 * @swagger
 * /materials:
 * get:
 *   summary: Get all materials
 *   description: Retrieve a list of all materials
 *   tags: [Materials]
 *   responses:
 *     200:
 *       description: Success
 *     500:
 *       description: Internal Server Error
 */
router.get("/", materialsController.getAllMaterials)

/**
 * @swagger
 * /materials:
 *  post:
 *    summary: Save a new material
 *    description: Save a new material
 *    tags: [Materials]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              description:
 *                type: string
 *              quantity:
 *                type: number
 *    responses:
 *      201:
 *        description: Meeting room saved successfully
 *      400:
 *        description: Bad request
 *      500:
 *        description: Internal Server Error
 */
router.post("/", validate(saveValidationSchema), materialsController.saveMaterial)

module.exports = router
