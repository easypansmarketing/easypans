const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;

async function listAvailableModels() {
  try {
    console.log("Checking available models for your API Key...");
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
    
    const response = await axios.get(url);
    const models = response.data.models;
    
    console.log("\n✅ SUCCESS! Here are the models you can use:");
    models.forEach(model => {
      // We only care about models that support 'generateContent'
      if (model.supportedGenerationMethods.includes("generateContent")) {
        console.log(`- ${model.name.replace("models/", "")}`);
      }
    });

  } catch (error) {
    console.error("\n❌ FAILED to list models.");
    console.error("Error:", error.response ? error.response.data : error.message);
  }
}

listAvailableModels();