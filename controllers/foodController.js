import foodModel from "../models/foodModel.js";
import fs from "fs";

const addFood = async (req, res) => {
  console.log("File received:", req.file); // Debug line to check `req.file`

  const image_filename = req.file ? req.file.filename : null;

  if (!image_filename) {
    return res
      .status(400)
      .json({ success: false, message: "Image file is required" });
  }

  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
  });

  try {
    await food.save();
    res.json({ success: true, message: "Food Added" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//all food list
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

//remove food
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    fs.unlink("uploads/${food.image}", () => {});

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { addFood, listFood, removeFood };

/**
 * @swagger
 * /api/food/add:
 *   post:
 *     summary: Add a new food item
 *     description: Add a new food item to the database.
 *     tags:
 *       - Food
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the food item.
 *               description:
 *                 type: string
 *                 description: Description of the food item.
 *               price:
 *                 type: number
 *                 description: Price of the food item.
 *               category:
 *                 type: string
 *                 description: Category of the food item.
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file for the food item.
 *     responses:
 *       200:
 *         description: Successfully added food.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid input or missing image file.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /api/food:
 *   get:
 *     summary: Get list of all food
 *     description: Retrieve all food items in the database.
 *     tags:
 *       - Food
 *     responses:
 *       200:
 *         description: List of food items retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: ID of the food item.
 *                       name:
 *                         type: string
 *                         description: Name of the food item.
 *                       description:
 *                         type: string
 *                         description: Description of the food item.
 *                       price:
 *                         type: number
 *                         description: Price of the food item.
 *                       category:
 *                         type: string
 *                         description: Category of the food item.
 *                       image:
 *                         type: string
 *                         description: Image filename of the food item.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /api/food/remove:
 *   post:
 *     summary: Remove a food item
 *     description: Remove a food item from the database.
 *     tags:
 *       - Food
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID of the food item to be removed.
 *     responses:
 *       200:
 *         description: Successfully removed food.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid food ID.
 *       500:
 *         description: Server error.
 */
