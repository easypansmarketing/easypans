import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, Users, ChefHat, Star, ArrowLeft, Edit } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// A simple star rating component to display a 5-star rating
const StarRating = ({ rating = 5 }: { rating?: number }) => (
  <div className="flex items-center gap-1 text-yellow-500">
    {[...Array(5)].map((_, i) => (
      <Star key={i} className={`h-5 w-5 ${i < rating ? 'fill-current' : ''}`} />
    ))}
  </div>
);

const AdminRecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [servingSize, setServingSize] = useState(4);
  const isMobile = useIsMobile();
  const servingSizes = [2, 4, 6, 8];

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5001/api/recipes/${id}`);
        if (!response.ok) {
          throw new Error("Recipe not found");
        }
        const data = await response.json();
        setRecipe(data);
      } catch (error) {
        console.error("Failed to fetch recipe:", error);
        setRecipe(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRecipe();
    }
  }, [id]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="container mx-auto px-4 md:px-6 py-8">
          <Skeleton className="h-8 w-1/4 mb-4" />
          <Skeleton className="w-full h-96 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!recipe) {
    return (
      <AdminLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Recipe Not Found</h1>
            <Button asChild>
              <Link to="/admin/recipes">Back to All Recipes</Link>
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="bg-[#fffbf3]">
        <main className="flex-1 relative">
          <div className="absolute top-4 left-4 z-20 flex gap-2">
              <Button asChild variant="secondary" className="bg-white/80 hover:bg-white text-black">
                <Link to="/admin/recipes">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Link>
              </Button>
          </div>
          <div className="w-full h-64 md:h-96">
              <img
                src={recipe.image || 'https://placehold.co/1200x400/EEE/31343C?text=No+Image'}
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
                      <div className="text-center"><Users className="h-6 w-6 mx-auto text-primary" /><span>{recipe.serves} Serves</span></div>
                      <div className="text-center"><ChefHat className="h-6 w-6 mx-auto text-primary" /><span>{recipe.prepTime} Min</span></div>
                      <div className="text-center"><Clock className="h-6 w-6 mx-auto text-primary" /><span>{recipe.cookTime} Min</span></div>
                      {recipe.restTime && (<div className="text-center"><Clock className="h-6 w-6 mx-auto text-primary" /><span>{recipe.restTime}</span></div>)}
                    </div>
                  </div>
                  <p className="text-base text-muted-foreground leading-relaxed mb-8 text-justify">{recipe.description}</p>
                  
                  <div id="ingredients" className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold">Ingredients</h2>
                      {isMobile ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button className="bg-green-600 hover:bg-green-700 text-white">Serves: {servingSize}</Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {servingSizes.map((size) => (<DropdownMenuItem key={size} onSelect={() => setServingSize(size)}>{size}</DropdownMenuItem>))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Serving amount:</span>
                          <div className="flex gap-1">
                            {servingSizes.map((size) => (<Button key={size} variant={servingSize === size ? "default" : "outline"} size="sm" onClick={() => setServingSize(size)} className="w-8 h-8 p-0 rounded-full">{size}</Button>))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4 text-muted-foreground">
                      {recipe.ingredients.map((category: any, idx: number) => (
                        <div key={idx}>
                          <h3 className="font-semibold text-foreground mb-2">{category.category}</h3>
                          <ul className="list-disc list-inside space-y-1">
                            {category.items.map((item: string, itemIdx: number) => (<li key={itemIdx}>{item}</li>))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div id="instructions">
                    <h2 className="text-2xl font-bold mb-4">Instructions</h2>
                    <ol className="space-y-4">
                      {recipe.instructions.map((instruction: string, idx: number) => (
                        <li key={idx} className="flex gap-4">
                          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">{idx + 1}</span>
                          <p className="flex-1 pt-1 text-muted-foreground">{instruction}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
                <div className="md:col-span-1">
                  <div className="sticky top-24">
                    <img src={recipe.image} alt={recipe.title} className="w-full rounded-lg mb-6 shadow-md"/>
                    {/* --- VIDEO BUTTON RESTORED HERE --- */}
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
                      {recipe.nutrition && Object.entries(recipe.nutrition).map(([key, value]) => {
                        const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
                        return (
                          <div key={key} className="flex justify-between items-center pb-2 border-b">
                            <span className="text-muted-foreground">{formattedKey}</span>
                            <span className="font-semibold text-foreground">{String(value)}</span>
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
      </div>
    </AdminLayout>
  );
};

export default AdminRecipeDetail;

