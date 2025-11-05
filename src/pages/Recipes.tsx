const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";
import { useState, useEffect } from "react"; // Import useEffect
import Header from "../components/Header";
import Footer from "../components/Footer";
import RecipeCard from "../components/RecipeCard";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Search } from "lucide-react";
// import { recipes } from "../data/recipes"; // REMOVED: Static data import
import roll from "../assets/Roll_Title.png";
import { useIsMobile } from "../hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton"; // Added for loading state
import { Card } from "@/components/ui/card";

const Recipes = () => {
  const [allRecipes, setAllRecipes] = useState<any[]>([]); // To store fetched recipes
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeKeyword, setActiveKeyword] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const keywords = ["Quick Meals", "Healthy", "Popular", "Vegetarian", "Indian", "Italian"]; // Keep keywords for filtering UI

  // Fetch recipes from the backend
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        setError(null);
        // const response = await fetch("http://localhost:5001/api/recipes"); // Old
        const response = await fetch(`${API_BASE_URL}/api/recipes`); // New
        if (!response.ok) {
          throw new Error("Failed to fetch recipes");
        }
        const data = await response.json();
        setAllRecipes(data);
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []); // Empty dependency array means this runs once on mount

  // Filter recipes based on search and keyword (applied to fetched data)
  const filteredRecipes = allRecipes.filter((recipe) => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (recipe.description && recipe.description.toLowerCase().includes(searchQuery.toLowerCase())); // Added check for description existence
    
    // Ensure keywords exist before trying to include them
    const matchesKeyword = !activeKeyword || (recipe.keywords && recipe.keywords.includes(activeKeyword)); 
    
    return matchesSearch && matchesKeyword;
  });

  // --- Loading State UI ---
  if (loading) {
     return (
       <div className="min-h-screen flex flex-col">
         <Header />
         <div className="container mx-auto px-4 md:px-6 py-12">
           <Skeleton className="h-10 w-1/4 mb-4 mx-auto" />
           <Skeleton className="h-6 w-1/2 mb-8 mx-auto" />
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
             {[...Array(6)].map((_, i) => (
                <Card key={i}>
                    <Skeleton className="aspect-[4/3] w-full" />
                    <div className="p-4 md:p-5 space-y-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                </Card>
             ))}
           </div>
         </div>
         <Footer />
       </div>
     );
  }

  // --- Error State UI ---
  if (error) {
     return (
       <div className="min-h-screen flex flex-col">
         <Header />
         <div className="flex-1 flex items-center justify-center text-center">
            <div>
                 <h2 className="text-2xl font-bold text-red-600 mb-4">Error Fetching Recipes</h2>
                 <p className="text-muted-foreground mb-4">{error}</p>
                 <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
         </div>
         <Footer />
       </div>
     );
  }


  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Moving Image Banner */}
      <div className="relative w-full overflow-hidden border-b border-gray-200 bg-white">
        <div
          className="scroll-banner"
          style={{
            backgroundImage: `url(${roll})`,
          }}
        ></div>
      </div>
      
      <section className="py-2 md:py-9 pb-8 md:pb-3 bg-[#067a45] text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">FRESH TASTY HEALTHY</h1>
          <p className="text-sm md:text-xl">Explore our collection of delicious recipes</p>
        </div>
        <div className="container mx-auto px-4 md:px-6 pt-4 md:py-5">
          <div className="relative max-w-2xl mx-auto md:mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search recipes by name or keyword..."
              className="pl-12 h-12 md:h-14 text-black md:text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {!isMobile && (
            <div className="flex flex-wrap justify-center gap-3 md:gap-4 mt-8">
              <Button
                variant={activeKeyword === null ? "default" : "outline"}
                onClick={() => setActiveKeyword(null)}
                className="font-medium"
              >
                All
              </Button>
              {keywords.map((keyword) => (
                <Button
                  key={keyword}
                  variant={activeKeyword === keyword ? "default" : "outline"}
                  onClick={() => setActiveKeyword(keyword)}
                  className="font-medium"
                >
                  {keyword}
                </Button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-12 md:py-16 flex-1">
        <div className="container mx-auto px-4 md:px-6">
          {filteredRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe._id} // Use backend ID
                  id={recipe._id} // Use backend ID
                  title={recipe.title}
                  image={recipe.image || 'https://placehold.co/600x400/EEE/31343C?text=No+Image'} // Add fallback
                  cookTime={recipe.cookTime}
                  serves={recipe.serves}
                  description={recipe.description}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">
                No recipes found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 md:py-16 bg-secondary">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">Can't find what you're looking for?</h2>
          <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8">
            We're constantly adding new recipes to our collection. Check back soon for more delicious options!
          </p>
          <Button size="lg" className="font-semibold">
            Subscribe for Updates
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Recipes;
