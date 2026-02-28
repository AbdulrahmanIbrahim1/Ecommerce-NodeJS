const express = require("express");

const router = express.Router();

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productService");

const {
  createProductValidator,
  getProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidator");

const authService = require("../controllers/authService");
router
  .route("/")
  .get(getProducts)
  .post(
    authService.protect,
    authService.checkActive,
    authService.allowedTo("admin", "manager"),
    createProductValidator,
    createProduct,
  );
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    authService.protect,
    authService.checkActive,
    authService.allowedTo("admin", "manager"),
    updateProductValidator,
    updateProduct,
  )
  .delete(
    authService.protect,
    authService.checkActive,
    authService.allowedTo("admin", "manager"),
    deleteProductValidator,
    deleteProduct,
  );

module.exports = router;


/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management endpoints
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 * 
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
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
 *               - price
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 example: iPhone 14
 *               description:
 *                 type: string
 *                 example: Latest Apple smartphone
 *               price:
 *                 type: number
 *                 example: 1200
 *               category:
 *                 type: string
 *                 example: 640a1b5c1e2d1a7b2c3d4e5f
 *               brand:
 *                 type: string
 *                 example: 640a1b5c1e2d1a7b2c3d4e7
 *               quantity:
 *                 type: number
 *                 example: 50
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a specific product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 * 
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: iPhone 14 Pro
 *               description:
 *                 type: string
 *                 example: Updated Apple smartphone
 *               price:
 *                 type: number
 *                 example: 1300
 *               quantity:
 *                 type: number
 *                 example: 45
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Product not found
 * 
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       204:
 *         description: Product deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 640a1b5c1e2d1a7b2c3d4e9
 *         name:
 *           type: string
 *           example: iPhone 14
 *         description:
 *           type: string
 *           example: Latest Apple smartphone
 *         price:
 *           type: number
 *           example: 1200
 *         quantity:
 *           type: number
 *           example: 50
 *         category:
 *           type: string
 *           description: Category ID
 *           example: 640a1b5c1e2d1a7b2c3d4e5f
 *         brand:
 *           type: string
 *           description: Brand ID
 *           example: 640a1b5c1e2d1a7b2c3d4e7
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2026-02-27T01:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2026-02-27T01:00:00.000Z
 */