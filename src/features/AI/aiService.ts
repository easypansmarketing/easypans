import axios from "axios";

const BACKEND_URL = window.location.hostname === "localhost" 
  ? "http://localhost:5001" 
  : "https://easypans-backend.onrender.com";

export const generateRecipeRequest = async (ingredients: string) => {
  const response = await axios.post(`${BACKEND_URL}/api/ai/generate`, {
    ingredients,
  });
  return response.data;
};

// 👇 Add this new function
export const identifyIngredientsRequest = async (imageFile: File) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await axios.post(`${BACKEND_URL}/api/ai/identify`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data; // Should return { ingredients: "Tomato, Onion..." }
};