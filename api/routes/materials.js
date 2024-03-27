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
 * /materials/pagination:
 * get:
 *   summary: Get all materials with pagination
 *   description: Retrieve a list of all materials with pagination
 *   tags: [Materials]
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
router.get("/method/pagination", materialsController.getAllMaterialsPagination)

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

/**
 * @swagger
 * /materials/{id}:
 *   get:
 *     summary: Get a material by ID
 *     description: Retrieve a material by ID
 *     tags: [Materials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the material to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal Server Error
 *       404:
 *         description: Material not found
 */
router.get("/:id", materialsController.getMaterial)

/**
 * @swagger
 * /materials/{id}:
 *   put:
 *     summary: Update a material by ID
 *     description: Update a material by ID
 *     tags: [Materials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the material to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Material updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Material not found
 */
router.put("/:id", materialsController.updateMaterial)

/**
 * @swagger
 * /materials/{id}:
 *   delete:
 *     summary: Delete a material by ID
 *     description: Delete a material by ID
 *     tags: [Materials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the material to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Material deleted successfully
 *       500:
 *         description: Internal Server Error
 *       404:
 *         description: Material not found
 */
router.delete("/:id", materialsController.deleteMaterial)

/**
 * @swagger
 * /materials/state/{id}:
 *   put:
 *     summary: Update the state of a material
 *     description: Update the state of a material
 *     tags: [Materials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the material to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               availability:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Material state updated successfully
 *       500:
 *         description: Internal Server Error
 *       404:
 *         description: Material not found
 */
router.put("/state/:id", materialsController.updateMaterialState)

module.exports = router
