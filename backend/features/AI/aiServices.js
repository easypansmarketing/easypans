 const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ⚡ MODELS TO TRY (Updated for Dec 2025)
// Gemini 1.5 and 1.0 are SHUT DOWN (404 Error).
// We must use Gemini 2.5 and 2.0.
const MODELS = [
  "gemini-2.5-flash",       // Newest stable model
  "gemini-2.0-flash",       // Previous stable (You hit quota on this one)
  "gemini-2.5-flash-lite"   // Lightweight fallback (Good for saving quota)
];

async function generateWithFallback(prompt, imagePart = null) {
  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      
      let result;
      if (imagePart) {
        // Vision Request
        result = await model.generateContent([prompt, imagePart]);
      } else {
        // Text Request
        result = await model.generateContent(prompt);
      }
      
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.warn(`⚠️ Model ${modelName} failed: ${error.message}`);
      
      // If we are out of models, stop.
      if (modelName === MODELS[MODELS.length - 1]) {
        // Check for Quota Error specifically
        if (error.message.includes("429")) {
          throw new Error("Free Quota Exceeded. Please try again in a few minutes.");
        }
        throw new Error("AI Service Unavailable. Please check your API Key.");
      }
    }
  }
}

// --- 1. RECIPE GENERATION LOGIC ---
const generateRecipeLogic = async (ingredients) => {
  if (!process.env.GEMINI_API_KEY) throw new Error("API Key Missing");

  const prompt = `
    You are an expert Indian Chef.
    User has these ingredients: ${ingredients}.
    Suggest one recipe.
    Strictly return ONLY valid JSON:
    {
      "name": "Recipe Name",
      "description": "Short description",
      "steps": ["Step 1", "Step 2"],
      "missingIngredients": []
    }
  `;

  const text = await generateWithFallback(prompt);
  // Clean markdown if present
  const cleanJson = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleanJson);
};

// --- 2. INGREDIENT IDENTIFICATION LOGIC ---
const identifyIngredientsLogic = async (fileBuffer, mimeType) => {
  if (!process.env.GEMINI_API_KEY) throw new Error("API Key Missing");

  const prompt = "Identify the food ingredients in this image. Return ONLY a comma-separated list of ingredients. Example: 'Tomato, Onion'.";

  const imagePart = {
    inlineData: {
      data: fileBuffer.toString("base64"),
      mimeType: mimeType
    },
  };

  const text = await generateWithFallback(prompt, imagePart);
  return text.trim();
};

// --- ROUTE HANDLERS ---
const generateRecipe = async (req, res) => {
  try {
    const { ingredients } = req.body;
    if (!ingredients) return res.status(400).json({ error: "Ingredients required" });
    
    const recipe = await generateRecipeLogic(ingredients);
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const identifyIngredients = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Image required" });
    
    const ingredients = await identifyIngredientsLogic(req.file.buffer, req.file.mimetype);
    res.json({ ingredients });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { generateRecipe, identifyIngredients, generateRecipeLogic, identifyIngredientsLogic };
