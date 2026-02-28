const express = require("express");
const {
  createSubCategory,
  getSubCategory,
  getSubCategories,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
  createFilteredObj,
} = require("../controllers/subCategoryService");
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");

const authService = require("../controllers/authService");

// Merge params to access parent router params (allow use access :mainCategoryId from categoryRoutes)
// ex : we need to access categoryId from categoryRoutes to use it in subCategoryRoutes
// like /api/v1/categories/:categoryId/subCategories
const router = express.Router({ mergeParams: true }); // to access params from parent router

router
  .route("/")
  .post(
    authService.protect,
    authService.checkActive,
    authService.allowedTo("admin", "manager"),
    setCategoryIdToBody,
    createSubCategoryValidator,
    createSubCategory,
  )
  .get(createFilteredObj, getSubCategories);

router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(
    authService.protect,
    authService.checkActive,
    authService.allowedTo("admin", "manager"),
    updateSubCategoryValidator,
    updateSubCategory,
  )
  .delete(
    authService.protect,
    authService.checkActive,
    authService.allowedTo("admin", "manager"),
    deleteSubCategoryValidator,
    deleteSubCategory,
  );

module.exports = router;



/**
 * @swagger
 * tags:
 *   name: SubCategories
 *   description: SubCategory management endpoints
 */

/**
 * @swagger
 * /subCategories:
 *   get:
 *     summary: Get all subcategories (can filter by category)
 *     tags: [SubCategories]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category ID to filter subcategories
 *     responses:
 *       200:
 *         description: List of subcategories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SubCategory'
 *
 *   post:
 *     summary: Create a new subcategory
 *     tags: [SubCategories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 example: Smartphones
 *               category:
 *                 type: string
 *                 description: Parent category ID
 *                 example: 640a1b5c1e2d1a7b2c3d4e5f
 *     responses:
 *       201:
 *         description: Subcategory created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubCategory'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /subCategories/{id}:
 *   get:
 *     summary: Get a specific subcategory by ID
 *     tags: [SubCategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: SubCategory ID
 *     responses:
 *       200:
 *         description: Subcategory details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubCategory'
 *       404:
 *         description: Subcategory not found
 *
 *   put:
 *     summary: Update a subcategory by ID
 *     tags: [SubCategories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: SubCategory ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Smartphones Updated
 *     responses:
 *       200:
 *         description: Subcategory updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubCategory'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Subcategory not found
 *
 *   delete:
 *     summary: Delete a subcategory by ID
 *     tags: [SubCategories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: SubCategory ID
 *     responses:
 *       204:
 *         description: Subcategory deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Subcategory not found
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SubCategory:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 640a1b5c1e2d1a7b2c3d4e6
 *         name:
 *           type: string
 *           example: Smartphones
 *         category:
 *           type: string
 *           description: Parent category ID
 *           example: 640a1b5c1e2d1a7b2c3d4e5f
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2026-02-27T01:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2026-02-27T01:00:00.000Z
 */