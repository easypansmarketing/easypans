import { useState } from "react";
import axios from "axios"; // Make sure you have axios installed

const AIChef = () => {
  const [ingredients, setIngredients] = useState("");
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);

  // Replace with your actual Render Backend URL
  const BACKEND_URL =
    "[https://your-easypans-backend.onrender.com](https://your-easypans-backend.onrender.com)";

  const handleGenerate = async () => {
    if (!ingredients) return alert("Please enter ingredients!");

    setLoading(true);
    setRecipe(null);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/ai/generate`, {
        ingredients: ingredients,
      });

      setRecipe(response.data);
    } catch (error) {
      console.error(error);
      alert("Chef is busy! Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-chef-container">
      <h2>👩‍🍳 EasyPans AI Chef</h2>
      <textarea
        placeholder="Enter ingredients (e.g., Paneer, Butter, Tomato)"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
      />
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "Cooking..." : "Generate Recipe"}
      </button>

      {recipe && (
        <div className="recipe-card">
          <h3>{recipe.name}</h3>
          <p>{recipe.description}</p>
          <h4>Instructions:</h4>
          <ul>
            {recipe.steps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AIChef;
