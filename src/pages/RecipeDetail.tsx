const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";
import { useState, useEffect } from "react"; // Import useEffect
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, Users, ChefHat, Star, ArrowLeft } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { recipes } from "@/data/recipes"; // REMOVED: Static data import
import roll from "@/assets/Roll_Title.png";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton"; // Added for loading state

// A simple star rating component to display the 5-star rating
const StarRating = ({ rating = 5 }: { rating?: number }) => (
  <div className="flex items-center gap-1 text-yellow-500">
    {[...Array(5)].map((_, i) => (
      <Star key={i} className={`h-5 w-5 ${i < rating ? 'fill-current' : ''}`} />
    ))}
  </div>
);

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>(); // Get ID from URL
  const [recipe, setRecipe] = useState<any>(null); // State for the fetched recipe
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [servingSize, setServingSize] = useState(4);
  const isMobile = useIsMobile();
  const servingSizes = [2, 4, 6, 8];

  // Fetch specific recipe data
  useEffect(() => {
    const fetchRecipe = async () => {
      const response = await fetch(`${API_BASE_URL}/api/recipes/${id}`);
      if (!id) return; // Don't fetch if ID is missing

      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:5001/api/recipes/${id}`);
        if (!response.ok) {
          throw new Error("Recipe not found or failed to load");
        }
        const data = await response.json();
        setRecipe(data);
      } catch (err: any) {
        setError(err.message || "Could not load recipe details.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]); // Re-run effect if the ID changes

  // --- Loading State UI ---
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fffbf3]">
        <Header />
        <main className="flex-1">
          <Skeleton className="w-full h-64 md:h-96" />
          <div className="container mx-auto px-4 md:px-6">
            <Card className="p-6 md:p-10 -mt-16 md:-mt-24 relative z-10 shadow-xl max-w-5xl mx-auto border-2 border-gray-200">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-4">
                     <Skeleton className="h-8 w-3/4" />
                     <Skeleton className="h-6 w-1/2" />
                     <Skeleton className="h-4 w-full" />
                     <Skeleton className="h-4 w-full" />
                     <Skeleton className="h-4 w-5/6" />
                     <Skeleton className="h-24 w-full mt-4" />
                  </div>
                  <div className="space-y-4">
                     <Skeleton className="h-40 w-full" />
                     <Skeleton className="h-10 w-full" />
                     <Skeleton className="h-32 w-full" />
                  </div>
               </div>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // --- Error State UI (or Recipe Not Found) ---
  if (error || !recipe) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center text-center">
            <div>
                 <h1 className="text-4xl font-bold mb-4">{error ? "Error Loading Recipe" : "Recipe Not Found"}</h1>
                 <p className="text-muted-foreground mb-4">{error || "The recipe you are looking for does not exist."}</p>
                 <Button asChild>
                   <Link to="/recipes">Back to Recipes</Link>
                 </Button>
            </div>
        </div>
        <Footer />
      </div>
    );
  }

  // --- Recipe Found - Render Details ---
  return (
    <div className="min-h-screen flex flex-col bg-[#fffbf3]">
      <Header />

      {/* Moving Image Banner */}
      <div className="relative w-full overflow-hidden border-b border-gray-200 bg-white">
        <div
          className="scroll-banner"
          style={{ backgroundImage: `url(${roll})` }}
        ></div>
      </div>

      <main className="flex-1 relative">
        <Link 
            to="/recipes" 
            className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/50 text-white px-4 py-2 rounded-full hover:bg-black/75 transition-colors"
        >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
        </Link>
        
        <div className="w-full h-64 md:h-96">
            <img
              src={recipe.image || 'https://placehold.co/1200x400/EEE/31343C?text=No+Image'} // Fallback
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
        </div>

        <div className="container mx-auto px-4 md:px-6">
          <Card className="p-6 md:p-10 -mt-16 md:-mt-24 relative z-10 shadow-xl max-w-5xl mx-auto border-2 border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <h1 className="text-3xl md:text-4xl font-bold">{recipe.title}</h1>
                <p className="text-lg text-muted-foreground mt-1 mb-4">{recipe.subtitle}</p>

                <div className="flex items-center justify-between flex-wrap gap-4 border-b pb-4 mb-4">
                  <StarRating />
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="text-center">
                      <Users className="h-6 w-6 mx-auto text-primary" />
                      <span>{recipe.serves} Serves</span>
                    </div>
                    <div className="text-center">
                      <ChefHat className="h-6 w-6 mx-auto text-primary" />
                      <span>{recipe.prepTime} Min</span>
                    </div>
                    <div className="text-center">
                      <Clock className="h-6 w-6 mx-auto text-primary" />
                      <span>{recipe.cookTime} Min</span>
                    </div>
                    {recipe.restTime && (
                       <div className="text-center">
                         <Clock className="h-6 w-6 mx-auto text-primary" />
                         <span>{recipe.restTime}</span>
                       </div>
                    )}
                  </div>
                </div>

                <p className="text-base text-muted-foreground leading-relaxed mb-8 text-justify">
                  {recipe.description}
                </p>

                {/* Ingredients Section */}
                <div id="ingredients" className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Ingredients</h2>
                    {isMobile ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button className="bg-green-600 hover:bg-green-700 text-white">
                            Serves: {servingSize}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {servingSizes.map((size) => (
                            <DropdownMenuItem key={size} onSelect={() => setServingSize(size)}>
                              {size}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Serving amount:</span>
                        <div className="flex gap-1">
                          {servingSizes.map((size) => (
                            <Button
                              key={size}
                              variant={servingSize === size ? "default" : "outline"}
                              size="sm"
                              onClick={() => setServingSize(size)}
                              className="w-8 h-8 p-0 rounded-full"
                            >
                              {size}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4 text-muted-foreground">
                    {/* Check if ingredients exist and is an array */}
                    {recipe.ingredients && Array.isArray(recipe.ingredients) && recipe.ingredients.map((category: any, idx: number) => (
                      <div key={idx}>
                        <h3 className="font-semibold text-foreground mb-2">{category.category}</h3>
                        <ul className="list-disc list-inside space-y-1">
                           {/* Check if items exist and is an array */}
                          {category.items && Array.isArray(category.items) && category.items.map((item: string, itemIdx: number) => (
                            <li key={itemIdx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 flex items-center justify-between bg-gray-50 p-4 rounded-md">
                     <p className="text-muted-foreground text-sm font-medium">Order the Ingredient form us</p>
                     <Button size="lg" className="font-semibold shadow-md bg-green-600 hover:bg-green-700">
                        Buy Now
                     </Button>
                  </div>
                </div>

                {/* Instructions Section */}
                <div id="instructions">
                  <h2 className="text-2xl font-bold mb-4">Instructions</h2>
                  <ol className="space-y-4">
                     {/* Check if instructions exist and is an array */}
                    {recipe.instructions && Array.isArray(recipe.instructions) && recipe.instructions.map((instruction: string, idx: number) => (
                      <li key={idx} className="flex gap-4">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <p className="flex-1 pt-1 text-muted-foreground">{instruction}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Right Column as a sidebar */}
              <div className="md:col-span-1">
                <div className="sticky top-24">
                  <img src={recipe.image} alt={recipe.title} className="w-full rounded-lg mb-6 shadow-md"/>
                  
                  <Button asChild size="lg" className="w-full font-semibold shadow-md mb-6">
                    <a 
                      href={`https://www.youtube.com/results?search_query=${recipe.title.split(' ').join('+')}+recipe`}
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                       Click to get Recipe Video
                    </a>
                  </Button>

                  <h3 className="text-xl font-bold mb-4">Nutrition Values</h3>
                  <div className="space-y-2 text-sm">
                    {/* Check if nutrition exists and is an object */}
                    {recipe.nutrition && typeof recipe.nutrition === 'object' && Object.entries(recipe.nutrition).map(([key, value]) => {
                      const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
                      return (
                        <div key={key} className="flex justify-between items-center pb-2 border-b">
                          <span className="text-muted-foreground">{formattedKey}</span>
                          <span className="font-semibold text-foreground">{String(value)}</span> {/* Ensure value is string */}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RecipeDetail;
