// --- ADDED THIS LINE ---
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";
// ---

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Clock, Users, Edit, Trash2, PlusCircle } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useToast } from "../../components/ui/use-toast";

const AdminRecipes = () => {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");


  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        // --- THIS LINE WAS CORRECTED ---
        const response = await fetch(`${API_BASE_URL}/api/recipes`);
        // ---
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error("Failed to fetch recipes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent navigation when clicking delete
    e.preventDefault();
    if (window.confirm("Are you sure you want to delete this recipe?")) {
        try {
            // --- THIS LINE WAS CORRECTED ---
            const response = await fetch(`${API_BASE_URL}/api/recipes/${id}`, {
            // ---
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${userInfo.token}`
                }
            });
            if (response.ok) {
                setRecipes(recipes.filter(r => r._id !== id));
                toast({
                    title: "Success",
                    description: "Recipe deleted successfully.",
                });
            } else {
                throw new Error('Failed to delete recipe');
            }
        } catch (error) {
            console.error("Failed to delete recipe:", error);
            toast({
                title: "Error",
                description: "Could not delete recipe.",
                variant: "destructive",
            });
        }
    }
  };

  const handleEdit = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent navigation when clicking edit
    e.preventDefault();
    navigate(`/admin/recipes/edit/${id}`);
  };


  return (
    <AdminLayout>
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manage Recipes</h1>
          <Button onClick={() => navigate('/admin/recipes/new')}>
            <PlusCircle className="mr-2 h-5 w-5" />
            Add new Recipe
          </Button>
        </div>

        {loading ? (
          <p>Loading recipes...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {recipes.map((recipe) => (
              <Link to={`/admin/recipes/${recipe._id}`} key={recipe._id} className="group">
                <Card className="overflow-hidden transition-all duration-300 shadow-sm group-hover:shadow-[var(--hover-shadow)] h-full flex flex-col">
                  <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                          src={recipe.image || 'https://placehold.co/600x400/EEE/31343C?text=No+Image'}
                          alt={recipe.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                          <Button size="icon" className="h-8 w-8" variant="secondary" onClick={(e) => handleEdit(e, recipe._id)}>
                              <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="icon" className="h-8 w-8" variant="destructive" onClick={(e) => handleDelete(e, recipe._id)}>
                              <Trash2 className="h-4 w-4" />
                          </Button>
                      </div>
                  </div>
                  <div className="p-4 md:p-5 flex flex-col flex-grow">
                    <h3 className="font-semibold text-lg md:text-xl mb-2 group-hover:text-primary transition-colors">
                      {recipe.title}
                    </h3>
                    {recipe.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-grow">
                        {recipe.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-auto">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{recipe.cookTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{recipe.serves}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminRecipes;