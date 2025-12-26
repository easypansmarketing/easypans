const { generateRecipeLogic, identifyIngredientsLogic } = require('./aiService');

// @desc    Generate a recipe based on text ingredients
// @route   POST /api/ai/generate
// @access  Public
const generateRecipe = async (req, res) => {
  try {
    const { ingredients } = req.body;
    
    // Call the service logic
    const recipeData = await generateRecipeLogic(ingredients);
    
    res.status(200).json(recipeData);
  } catch (error) {
    console.error("AI Controller Error (Generate):", error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Identify ingredients from an uploaded image
// @route   POST /api/ai/identify
// @access  Public
const identifyIngredients = async (req, res) => {
  try {
    // Check if an image was uploaded via Multer
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    // Call the service logic with the image buffer and type
    const ingredients = await identifyIngredientsLogic(req.file.buffer, req.file.mimetype);
    
    res.status(200).json({ ingredients });
  } catch (error) {
    console.error("AI Controller Error (Vision):", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { generateRecipe, identifyIngredients };