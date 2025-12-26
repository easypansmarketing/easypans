import axios from 'axios';

// Ensure this matches your VITE_API_BASE_URL in .env
const API_URL = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL}/api/virtual-chef`
  : "http://localhost:5001/api/virtual-chef"; 

export const analyzeCookingState = async (
  imageSrc: string, 
  currentStep: string, 
  persona: string = "professional",
  // 👇 ADD THESE TWO NEW ARGUMENTS
  userId?: string,     
  sessionId?: string | null 
) => {
  try {
    console.log("Sending to Chef...", { currentStep, persona, sessionId }); 

    const response = await axios.post(`${API_URL}/analyze`, {
      image: imageSrc,
      currentStep, 
      chefPersona: persona,
      userId,      // <--- Pass to Backend
      sessionId    // <--- Pass to Backend
    });

    return response.data;
  } catch (error: any) {
    console.error("Chef Connection Failed:", error.response ? error.response.data : error.message);
    throw error;
  }
};