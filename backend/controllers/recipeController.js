const Recipe = require('../models/recipeModel.js');
const axios = require('axios');
const cheerio = require('cheerio');

// @desc    Fetch all recipes
// @route   GET /api/recipes
// @access  Public
const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({}).sort({ createdAt: -1 });
    res.json(recipes);
  } catch (error) {
     console.error("Error fetching recipes:", error);
     res.status(500).json({ message: "Server error fetching recipes" });
  }
};

// @desc    Fetch single recipe
// @route   GET /api/recipes/:id
// @access  Public
const getRecipeById = async (req, res) => {
 try {
    const recipe = await Recipe.findById(req.params.id);
    if (recipe) {
      res.json(recipe);
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (error) {
      console.error(`Error fetching recipe ${req.params.id}:`, error);
      if (error.kind === 'ObjectId') {
         res.status(400).json({ message: 'Invalid recipe ID format' });
      } else {
         res.status(500).json({ message: 'Server error fetching recipe' });
      }
  }
};

// @desc    Create a recipe
// @route   POST /api/recipes
// @access  Private/Admin
const createRecipe = async (req, res) => {
 try {
    // Ensure req.user and req.user._id exist
    if (!req.user || !req.user._id) {
        console.error("Authentication error: req.user._id is missing during recipe creation.");
        return res.status(401).json({ message: "User not authenticated or ID missing. Cannot create recipe." });
    }

    const { title, subtitle, image, cookTime, prepTime, serves, restTime, description, ingredients, instructions, nutrition, keywords } = req.body;

    // Basic validation for required fields
    if (!title || !image || !cookTime || !prepTime || !serves || !description || !ingredients || ingredients.length === 0 || !instructions || instructions.length === 0) {
        console.error("Missing required recipe fields during creation:", { title: !!title, image: !!image, cookTime: !!cookTime, prepTime: !!prepTime, serves: !!serves, description: !!description, ingredients: ingredients?.length, instructions: instructions?.length });
        return res.status(400).json({ message: 'Missing required recipe fields (title, image, times, serves, description, ingredients, instructions)' });
    }

    const recipe = new Recipe({
      title,
      subtitle,
      image,
      cookTime,
      prepTime,
      serves,
      restTime,
      description,
      ingredients,
      instructions,
      nutrition,
      keywords: keywords || [],
      author: req.user._id, // Set author during creation
    });

    const createdRecipe = await recipe.save();
    console.log(`Recipe created successfully by user ${req.user._id}`);
    res.status(201).json(createdRecipe);
 } catch (error) {
    console.error("Error creating recipe:", error);
    if (error.name === 'ValidationError') {
        console.error("Create Validation Errors:", error.errors);
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ message: `Validation failed: ${messages.join(', ')}`, errors: error.errors });
    }
    res.status(500).json({ message: "Server error creating recipe" });
 }
};

// --- UPDATED updateRecipe FUNCTION ---
// @desc    Update a recipe
// @route   PUT /api/recipes/:id
// @access  Private/Admin
const updateRecipe = async (req, res) => {
 try {
     // Ensure user is authenticated
     if (!req.user) {
        console.error("Authentication error: req.user is missing during recipe update.");
        return res.status(401).json({ message: "User not authenticated. Cannot update recipe." });
    }

    const recipeId = req.params.id;
    const updateData = req.body; // Contains all fields sent from the frontend form

    // Remove author field from updateData if present, to prevent accidental modification
    // Although findByIdAndUpdate usually doesn't update fields not in $set, this adds safety.
    delete updateData.author;

    console.log(`Attempting to update recipe ${recipeId} by user ${req.user._id}`);
    // console.log("Update data received:", updateData); // Optional: Log received data for debugging

    // Use findByIdAndUpdate
    const updatedRecipe = await Recipe.findByIdAndUpdate(
        recipeId,
        { $set: updateData }, // Use $set to update only provided fields
        {
            new: true, // Return the modified document rather than the original
            runValidators: true, // Run schema validation on the updated fields
            context: 'query' // Necessary for some validators, good practice to include
        }
    );

    if (updatedRecipe) {
        console.log(`Recipe ${recipeId} updated successfully.`);
        res.json(updatedRecipe);
    } else {
        // If findByIdAndUpdate returns null, the recipe wasn't found
        res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (error) {
     // Log the specific validation error details if it occurs
     console.error(`Error updating recipe ${req.params.id}:`, error);
     if (error.name === 'ValidationError') {
         console.error("Update Validation Errors:", error.errors);
         const messages = Object.values(error.errors).map(val => val.message);
         // No need to specifically check for 'author' error now, as it shouldn't happen with findByIdAndUpdate
         return res.status(400).json({ message: `Validation failed: ${messages.join(', ')}`, errors: error.errors });
     }
     if (error.kind === 'ObjectId') {
         res.status(400).json({ message: 'Invalid recipe ID format' });
      } else {
         // Catch other potential errors during update
         res.status(500).json({ message: 'Server error updating recipe' });
      }
  }
};
// --- END UPDATED updateRecipe FUNCTION ---


// @desc    Delete a recipe
// @route   DELETE /api/recipes/:id
// @access  Private/Admin
const deleteRecipe = async (req, res) => {
  // ... (deleteRecipe function remains the same) ...
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (recipe) {
      await recipe.deleteOne();
      res.json({ message: 'Recipe removed' });
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (error) {
      console.error(`Error deleting recipe ${req.params.id}:`, error);
       if (error.kind === 'ObjectId') {
         res.status(400).json({ message: 'Invalid recipe ID format' });
      } else {
         res.status(500).json({ message: 'Server error deleting recipe' });
      }
  }
};

// --- SCRAPER FUNCTION (remains the same) ---
const scrapeRecipe = async (req, res) => {
    // ... (scrapeRecipe function remains the same) ...
     const { htmlContent } = req.body;

    if (!htmlContent) {
        return res.status(400).json({ message: 'HTML content is required' });
    }
    console.log(`Attempting to parse provided HTML content...`);
    try {
        const $ = cheerio.load(htmlContent);
        // ... (Selectors and data extraction) ...
         const title = $('h1.entry-title').first().text().trim();
        const description = $('meta[name="description"]').first().attr('content')?.trim()
                           || $('meta[property="og:description"]').first().attr('content')?.trim()
                           || '';
        const image = $('meta[property="og:image"]').first().attr('content')?.trim()
                      || '';
        const video = $('iframe[src*="youtube.com"]').first().attr('src')?.trim() || '';

        let ingredientsData = [];
        const ingredientGroups = $('.wprm-recipe-ingredient-group');

        if (ingredientGroups.length > 0) {
            ingredientGroups.each((i, group) => {
                const categoryName = $(group).find('.wprm-recipe-ingredient-group-name').first().text().trim() || `Ingredients ${i + 1}`;
                const items = $(group).find('.wprm-recipe-ingredient')
                                    .map((j, el) => $(el).text().trim())
                                    .get()
                                    .filter(text => text);
                if (items.length > 0) {
                    ingredientsData.push({ category: categoryName, items: items });
                }
            });
        } else {
            const allItems = $('.wprm-recipe-ingredient')
                                .map((i, el) => $(el).text().trim())
                                .get()
                                .filter(text => text);
            if (allItems.length > 0) {
                 ingredientsData.push({ category: "Imported Ingredients", items: allItems });
            }
        }

        const instructions = $('.wprm-recipe-instruction-text').map((i, el) => $(el).text().trim()).get()
                               .filter(text => text);

        const serves = $('.wprm-recipe-servings-container .wprm-recipe-servings').first().text().trim()
                       || $('.wprm-recipe-details[data-servings]').first().attr('data-servings')
                       || '';
        const prepTime = $('.wprm-recipe-prep_time-container .wprm-recipe-time').first().text().trim()
                         || '';
        const cookTime = $('.wprm-recipe-cook_time-container .wprm-recipe-time').first().text().trim()
                         || '';

        const nutrition = {};
        $('.wprm-nutrition-label-container li, .wprm-nutrition-label__item').each((i, el) => {
            const keyElement = $(el).find('.wprm-nutrition-label-name, .wprm-nutrition-label__name').first();
            const valElement = $(el).find('.wprm-nutrition-label-value, .wprm-nutrition-label__value').first();
            const unitElement = $(el).find('.wprm-nutrition-label-unit, .wprm-nutrition-label__unit').first();

            const key = keyElement.text().trim().replace(':', '');
            let value = valElement.text().trim();
            const unit = unitElement.text().trim();

            if (key && value) {
                nutrition[key.toLowerCase()] = unit ? `${value} ${unit}` : value;
            }
        });

        if (!title && ingredientsData.length === 0 && instructions.length === 0) {
            console.warn(`Parsing might have failed - Minimal data extracted from HTML.`);
        }

        let outputIngredients = [];
        let outputCategory = "Imported Ingredients";

        if (ingredientsData.length === 1) {
             outputIngredients = ingredientsData[0].items;
             outputCategory = ingredientsData[0].category;
        } else if (ingredientsData.length > 1) {
            outputIngredients = ingredientsData.flatMap(group => group.items);
            outputCategory = "Imported Ingredients (Multiple Groups)";
             console.log("Multiple ingredient categories found, flattened into one list for frontend.");
        }

        const scrapedData = {
            title, description, image, video,
            ingredients: outputIngredients,
            ingredientCategory: outputCategory,
            instructions, serves, prepTime, cookTime, nutrition,
        };

        console.log(`Parsing successful for: ${title || 'Pasted HTML'}`);
        res.status(200).json(scrapedData);

    } catch (error) {
        console.error(`Error parsing HTML content:`, error);
        res.status(500).json({
             message: `HTML parsing failed: ${error.message || 'Unknown error during parsing.'}`
        });
    }
};


module.exports = {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  scrapeRecipe,
};

