// test-ai.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ API Key is missing from .env file");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function checkModels() {
  try {
    console.log("🔄 Connecting to Google AI...");
    // This connects to the API and asks "What models do I have access to?"
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Quick test generation
    const result = await model.generateContent("Say 'Hello' if you can hear me.");
    const response = await result.response;
    console.log("✅ SUCCESS! The model replied:", response.text());
    
  } catch (error) {
    console.error("\n❌ CONNECTION FAILED");
    console.error("Error Message:", error.message);
    
    if (error.message.includes("404")) {
      console.log("\n⚠️ DIAGNOSIS: The model name is invalid or your API key doesn't have access to it.");
    } else if (error.message.includes("429")) {
      console.log("\n⚠️ DIAGNOSIS: You have exceeded your free quota.");
    }
  }
}

checkModels();