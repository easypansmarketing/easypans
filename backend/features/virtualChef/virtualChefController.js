const { GoogleGenerativeAI } = require("@google/generative-ai");
const CookingSession = require('../../models/CookingSession');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper: Calculate seconds elapsed
const getSecondsDiff = (date1, date2) => Math.round((new Date(date2) - new Date(date1)) / 1000);

// --- 1. VERIFIED MODEL LIST (Based on your output) ---
// We prioritize the newest stable models, then fall back to "Lite" to save quota.
const MODELS = [
  "gemini-2.5-flash",       // ⚡ Newest & Best
  "gemini-2.0-flash",       // Standard Stable
  "gemini-2.0-flash-lite",  // Quota Saver (use this if 429 happens)
  "gemini-2.0-flash-exp"    // Experimental Backup
];

const generateWithFallback = async (prompt, imagePart) => {
  let lastError = null;

  for (const modelName of MODELS) {
    try {
      // console.log(`🔄 Attempting: ${modelName}...`); 
      const model = genAI.getGenerativeModel({ model: modelName });
      
      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      
      console.log(`✅ Success with model: ${modelName}`);
      return response.text(); 
    } catch (error) {
      console.warn(`⚠️ Model ${modelName} failed: ${error.message.split('[')[0]}`); // Log brief error
      lastError = error;

      // Continue loop ONLY if it's a Recoverable Error
      // 429 (Quota), 404 (Not Found), 503 (Server Overload)
      const isRecoverable = 
        error.message.includes("429") || 
        error.message.includes("404") || 
        error.message.includes("503");

      if (!isRecoverable) throw error; 
    }
  }
  throw lastError;
};

const analyzeCookingState = async (req, res) => {
  try {
    const { image, currentStep, chefPersona, userId, sessionId } = req.body;

    // 1. Recover History (The "Brain")
    let session;
    if (sessionId) {
      session = await CookingSession.findById(sessionId);
    } else if (userId) {
      session = await CookingSession.findOne({ userId, isActive: true }) 
                || await CookingSession.create({ userId });
    }

    // 2. Build Context from History
    let contextHistory = "Start of cooking.";
    if (session && session.history && session.history.length > 0) {
      const lastLog = session.history[session.history.length - 1];
      const secondsAgo = getSecondsDiff(lastLog.timestamp, new Date());
      contextHistory = `
        ${secondsAgo} seconds ago, you saw: "${lastLog.visualObservation}".
        Your advice was: "${lastLog.aiResponse}".
      `;
    }

    // 3. Construct Prompt
    const prompt = `
      ROLE: You are a ${chefPersona || 'professional'} chef guiding a user in REAL-TIME.
      
      INPUTS:
      - USER SPEECH: "${currentStep}"
      - HISTORY: ${contextHistory}
      - IMAGE: Provided below.

      TASK:
      Analyze the image and speech. 
      1. COMPARE: If food changed drastically in short time, warn about heat.
      2. REACT: If user asks a question, answer it based on the visual.
      3. GUIDE: If silence, just comment on the cooking progress.

      OUTPUT JSON ONLY:
      {
        "visualObservation": "Short technical description of food state",
        "message": "Conversational response to speak to the user (max 2 sentences)",
        "status": "success" | "warning" | "danger"
      }
    `;

    // 4. Prepare Image
    const cleanBase64 = image.includes("base64,") ? image.split("base64,")[1] : image;
    const imagePart = { 
      inlineData: { 
        data: cleanBase64, 
        mimeType: "image/jpeg" 
      } 
    };

    // 5. Call AI (With the new Fallback Logic)
    const textResponse = await generateWithFallback(prompt, imagePart);
    
    // Clean JSON
    const cleanJson = textResponse.replace(/```json|```/g, "").trim();
    const responseData = JSON.parse(cleanJson);

    // 6. Save to Memory
    if (session) {
      session.history.push({
        userSpeech: currentStep,
        visualObservation: responseData.visualObservation,
        aiResponse: responseData.message,
        status: responseData.status
      });
      await session.save();
    }

    res.json({ ...responseData, sessionId: session?._id });

  } catch (error) {
    console.error("Chef Error Details:", error.message);
    
    // Customized error for the UI
    if (error.message.includes("429")) {
        res.status(429).json({ 
            message: "I'm overwhelmed with requests! Give me 30 seconds to catch up.",
            status: "warning"
        });
    } else {
        res.status(500).json({ 
            message: "I'm having trouble connecting to my brain. Please try again.",
            status: "warning" 
        });
    }
  }
};

module.exports = { analyzeCookingState };