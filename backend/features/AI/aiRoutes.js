const express = require('express');
const router = express.Router();
const multer = require('multer');
const { generateRecipe, identifyIngredients } = require('./aiController');

// Configure Multer (Memory Storage)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Routes
router.post('/generate', generateRecipe);
router.post('/identify', upload.single('image'), identifyIngredients); // 👈 New Route

module.exports = router;