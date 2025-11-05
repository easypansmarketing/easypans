const express = require('express');
const router = express.Router();
const {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} = require('../controllers/recipeController.js');
const { protect, admin } = require('../middleware/authMiddleware.js');

// Public routes for fetching recipes
router.route('/').get(getRecipes);
router.route('/:id').get(getRecipeById);

// Protected admin routes for managing recipes
router.route('/').post(protect, admin, createRecipe);
router.route('/:id').put(protect, admin, updateRecipe).delete(protect, admin, deleteRecipe);

module.exports = router;
