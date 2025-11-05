const mongoose = require('mongoose');

// This schema defines the structure for nutrition information.
// --- CHANGED: ---
// Replaced the strict, 6-field sub-schema with a flexible Map.
// This will now accept any object of key-value pairs,
// perfectly matching your dynamic admin table.
const nutritionSchema = {
  type: Map,
  of: String,
};

// This schema defines the structure for ingredient categories.
const ingredientSchema = new mongoose.Schema({
  category: { type: String, required: true },
  items: [{ type: String, required: true }],
}, { _id: false });

// This is the main schema for our recipes.
const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  image: { type: String, required: true }, // This will store the URL of the uploaded image.
  cookTime: { type: String, required: true },
  prepTime: { type: String, required: true },
  serves: { type: String, required: true },
  restTime: { type: String },
  description: { type: String, required: true },
  ingredients: [ingredientSchema],
  instructions: [{ type: String, required: true }],
  nutrition: nutritionSchema, // <-- This now uses the flexible Map
  keywords: [{ type: String }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // This links the recipe to the user who created it.
  },
}, {
  timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields.
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;