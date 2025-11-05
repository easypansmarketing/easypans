import dalMakhaniImg from "@/assets/dal-makhani.jpg";
import recipe1Img from "@/assets/recipe-1.jpg";
import recipe2Img from "@/assets/recipe-2.jpg";
import recipe3Img from "@/assets/recipe-3.jpg";

export interface Recipe {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  cookTime: string;
  prepTime: string;
  serves: string;
  restTime?: string;
  description: string;
  ingredients: {
    category: string;
    items: string[];
  }[];
  instructions: string[];
  nutrition: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
    sodium: string;
  };
  keywords: string[];
}

export const recipes: Recipe[] = [
  {
    id: "dal-makhani",
    title: "Dal Makhani",
    subtitle: "Restaurant Style in Cooker",
    image: dalMakhaniImg,
    cookTime: "10 mins",
    prepTime: "20 mins",
    serves: "4-5",
    restTime: "10 mins",
    description: "Sloppy joes are the ultimate throwback. The name alone transports us back to the cafeteria line, that tangy smell of ketchup-spiked tomato sauce lingering, the giddy anticipation of sitting down to eat. We've grown up since then, however, and in turn, so have our sloppy joes. (In ingredients and flavor, not in spirit of course—we wouldn't want them to!) This version is worlds tastier than the ones the lunch lady slung. Think: sliced pickles, a smoky BBQ sauce, and a side of hearty potato wedges.",
    ingredients: [
      {
        category: "Main Ingredients",
        items: [
          "1 cup whole black lentils (urad dal)",
          "¼ cup red kidney beans (rajma)",
          "3 cups water",
          "2 tablespoons butter",
          "1 tablespoon oil",
          "1 bay leaf",
          "2 green cardamom pods",
          "1-inch cinnamon stick"
        ]
      },
      {
        category: "For the Sauce",
        items: [
          "2 large tomatoes, pureed",
          "1 tablespoon ginger-garlic paste",
          "1 teaspoon red chili powder",
          "½ teaspoon turmeric powder",
          "1 teaspoon garam masala",
          "Salt to taste",
          "½ cup fresh cream",
          "2 tablespoons kasuri methi (dried fenugreek leaves)"
        ]
      }
    ],
    instructions: [
      "Soak the black lentils and kidney beans overnight in water. Drain and rinse before cooking.",
      "In a pressure cooker, add the soaked lentils, kidney beans, and 3 cups of water. Cook for 15-20 minutes until soft and creamy.",
      "Heat butter and oil in a large pan. Add bay leaf, cardamom, and cinnamon. Sauté for 30 seconds.",
      "Add ginger-garlic paste and sauté until fragrant. Add tomato puree and cook for 5-7 minutes until oil separates.",
      "Add red chili powder, turmeric, and salt. Mix well and cook for 2 minutes.",
      "Add the cooked lentils and beans to the sauce. Mix well and simmer for 15-20 minutes on low heat.",
      "Crush kasuri methi between your palms and add to the dal. Add garam masala and mix.",
      "Stir in fresh cream and let it simmer for another 5 minutes. Serve hot with naan or rice."
    ],
    nutrition: {
      calories: "380",
      protein: "18g",
      carbs: "42g",
      fat: "15g",
      fiber: "12g",
      sodium: "520mg"
    },
    keywords: ["Indian", "Vegetarian", "Comfort Food", "Popular", "Healthy"]
  },
  {
    id: "grilled-chicken-vegetables",
    title: "Grilled Chicken with Roasted Vegetables",
    image: recipe1Img,
    cookTime: "25 mins",
    prepTime: "15 mins",
    serves: "4",
    description: "A healthy and delicious grilled chicken breast served with colorful roasted vegetables. Perfect for a wholesome weeknight dinner that's both nutritious and satisfying.",
    ingredients: [
      {
        category: "Main Ingredients",
        items: [
          "4 chicken breasts",
          "2 bell peppers (mixed colors)",
          "2 zucchini",
          "1 red onion",
          "2 carrots",
          "3 tablespoons olive oil",
          "2 cloves garlic, minced",
          "1 teaspoon dried herbs (rosemary, thyme)",
          "Salt and pepper to taste"
        ]
      }
    ],
    instructions: [
      "Preheat oven to 425°F (220°C). Line a baking sheet with parchment paper.",
      "Cut all vegetables into similar-sized pieces for even cooking.",
      "In a bowl, toss vegetables with 2 tablespoons olive oil, garlic, herbs, salt, and pepper.",
      "Spread vegetables on the baking sheet and roast for 20-25 minutes.",
      "Meanwhile, season chicken breasts with remaining oil, salt, and pepper.",
      "Heat a grill pan over medium-high heat. Cook chicken for 6-7 minutes per side until cooked through.",
      "Let chicken rest for 5 minutes before slicing. Serve with roasted vegetables."
    ],
    nutrition: {
      calories: "320",
      protein: "38g",
      carbs: "18g",
      fat: "12g",
      fiber: "5g",
      sodium: "380mg"
    },
    keywords: ["Quick Meals", "Healthy", "High Protein", "Popular"]
  },
  {
    id: "pasta-primavera",
    title: "Pasta Primavera",
    image: recipe2Img,
    cookTime: "20 mins",
    prepTime: "10 mins",
    serves: "4",
    description: "A fresh and vibrant Italian pasta dish loaded with colorful seasonal vegetables and tossed in a light garlic and olive oil sauce. Simple, delicious, and ready in 30 minutes!",
    ingredients: [
      {
        category: "Main Ingredients",
        items: [
          "400g pasta (penne or fusilli)",
          "2 cups cherry tomatoes, halved",
          "1 bell pepper, sliced",
          "1 zucchini, sliced",
          "1 cup broccoli florets",
          "4 cloves garlic, minced",
          "¼ cup olive oil",
          "Fresh basil leaves",
          "Parmesan cheese, grated",
          "Salt and pepper to taste",
          "Red pepper flakes (optional)"
        ]
      }
    ],
    instructions: [
      "Cook pasta according to package directions. Reserve 1 cup pasta water before draining.",
      "In a large pan, heat olive oil over medium heat. Add garlic and sauté for 1 minute.",
      "Add broccoli and bell pepper. Cook for 3-4 minutes until slightly tender.",
      "Add zucchini and cherry tomatoes. Cook for another 3 minutes.",
      "Add cooked pasta to the vegetables. Toss well, adding pasta water as needed for sauce.",
      "Season with salt, pepper, and red pepper flakes if using.",
      "Remove from heat and toss with fresh basil leaves.",
      "Serve hot with grated Parmesan cheese on top."
    ],
    nutrition: {
      calories: "420",
      protein: "14g",
      carbs: "62g",
      fat: "14g",
      fiber: "8g",
      sodium: "240mg"
    },
    keywords: ["Vegetarian", "Quick Meals", "Italian", "Popular", "Healthy"]
  },
  {
    id: "buddha-bowl",
    title: "Healthy Buddha Bowl",
    image: recipe3Img,
    cookTime: "15 mins",
    prepTime: "15 mins",
    serves: "2",
    description: "A nourishing and colorful buddha bowl packed with quinoa, roasted chickpeas, fresh vegetables, and creamy tahini dressing. Perfect for a healthy lunch or dinner!",
    ingredients: [
      {
        category: "Bowl Ingredients",
        items: [
          "1 cup quinoa, cooked",
          "1 can chickpeas, drained and roasted",
          "1 avocado, sliced",
          "1 cup kale or spinach",
          "½ cup shredded carrots",
          "½ cup cucumber, diced",
          "¼ red cabbage, shredded",
          "2 tablespoons sesame seeds"
        ]
      },
      {
        category: "Tahini Dressing",
        items: [
          "3 tablespoons tahini",
          "2 tablespoons lemon juice",
          "1 tablespoon maple syrup",
          "2 tablespoons water",
          "1 clove garlic, minced",
          "Salt to taste"
        ]
      }
    ],
    instructions: [
      "Preheat oven to 400°F (200°C). Toss chickpeas with olive oil, salt, and spices. Roast for 20 minutes.",
      "Cook quinoa according to package directions and let cool slightly.",
      "For the dressing, whisk together tahini, lemon juice, maple syrup, water, garlic, and salt.",
      "Divide quinoa between two bowls as the base.",
      "Arrange all vegetables and roasted chickpeas on top of the quinoa.",
      "Add avocado slices and sprinkle with sesame seeds.",
      "Drizzle with tahini dressing and serve immediately."
    ],
    nutrition: {
      calories: "520",
      protein: "22g",
      carbs: "58g",
      fat: "24g",
      fiber: "16g",
      sodium: "320mg"
    },
    keywords: ["Vegetarian", "Healthy", "Vegan", "Popular", "Quick Meals"]
  }
];
