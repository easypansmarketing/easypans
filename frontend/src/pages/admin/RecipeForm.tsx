// --- ADDED THIS LINE ---
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";
// ---

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { useToast } from "../../components/ui/use-toast";
import { PlusCircle, Trash2, ArrowLeft } from "lucide-react";
import roll from "../../assets/Roll_Title.png";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Import Card components

// Define interfaces for better type safety
interface IngredientItem {
  name: string;
  quantity: string;
}

interface IngredientCategory {
  category: string;
  items: IngredientItem[];
}

interface NutritionItem {
    name: string;
    quantity: string;
}

// Helper function to parse ingredient string
const parseIngredientString = (itemString: string): IngredientItem => {
    const words = itemString.trim().split(' ');
    let quantityParts: string[] = [];
    let nameParts: string[] = [];
    let quantityFound = false;

    // Basic check if the first word is numeric or a fraction
    if (words.length > 0 && /^[0-9./]+$/.test(words[0])) {
         quantityFound = true;
         quantityParts.push(words[0]); // Add the number/fraction

         // Check the second word for common units (can be expanded)
         if (words.length > 1) {
             const units = ["cup", "cups", "tsp", "tbsp", "g", "kg", "oz", "lb", "lbs", "ml", "l", "pinch", "slice", "slices", "clove", "cloves"];
             if (units.includes(words[1].toLowerCase().replace(/[,.]$/, ''))) { // Check common units (case-insensitive, remove trailing comma/period)
                 quantityParts.push(words[1]);
                 nameParts = words.slice(2);
             } else {
                 // If the second word isn't a unit, assume quantity is just the first word
                 nameParts = words.slice(1);
             }
         } else {
             // Only one word, and it's numeric? Assume it's quantity, empty name.
             nameParts = [];
         }
    }

    if (!quantityFound) {
        // If the first word wasn't numeric, assume the whole string is the name
        nameParts = words;
    }

    return {
        quantity: quantityParts.join(' ').trim(),
        name: nameParts.join(' ').trim()
    };
};


const RecipeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = Boolean(id);
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  // --- State structure for ingredients ---
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    serves: string;
    cookTime: string;
    prepTime: string;
    image: string;
    videoUrl: string;
    ingredients: IngredientCategory[]; // Now an array of categories
    nutrition: NutritionItem[];
    instructions: string[];
  }>({
    title: "",
    description: "",
    serves: "",
    cookTime: "",
    prepTime: "",
    image: "",
    videoUrl: "",
    // Start with one default category and one item
    ingredients: [{ category: "Main Ingredients", items: [{ name: "", quantity: "" }] }],
    nutrition: [{ name: "", quantity: "" }],
    instructions: [""],
  });

  useEffect(() => {
    if (isEditing) {
      const fetchRecipe = async () => {
        try {
          // --- THIS LINE WAS CORRECTED ---
          const response = await fetch(`${API_BASE_URL}/api/recipes/${id}`);
          // ---
          const data = await response.json();

          // --- UPDATED: Use the new parsing logic ---
          const formattedIngredients = (data.ingredients && data.ingredients.length > 0)
            ? data.ingredients.map((cat: any) => ({
                category: cat.category || "Ingredients", // Provide default category name
                // Use the helper function to parse each item string
                items: cat.items.map(parseIngredientString)
              }))
            : [{ category: "Main Ingredients", items: [{ name: "", quantity: "" }] }]; // Default if no ingredients


          setFormData({
            title: data.title,
            description: data.description,
            serves: data.serves,
            cookTime: data.cookTime,
            prepTime: data.prepTime,
            image: data.image,
            videoUrl: data.videoUrl || "",
            ingredients: formattedIngredients, // Use the formatted data
            nutrition: data.nutrition ? Object.entries(data.nutrition).map(([name, quantity]) => ({ name, quantity: String(quantity) })) : [{ name: "", quantity: "" }],
            instructions: data.instructions || [""],
          });
        } catch (error) {
          console.error("Failed to fetch recipe:", error);
        }
      };
      fetchRecipe();
    }
  }, [id, isEditing]);

  // --- Handlers for nested ingredients ---
  const handleCategoryChange = (catIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
      const newIngredients = [...formData.ingredients];
      newIngredients[catIndex].category = event.target.value;
      setFormData({...formData, ingredients: newIngredients});
  };

  const handleIngredientItemChange = (catIndex: number, itemIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
      const newIngredients = [...formData.ingredients];
      newIngredients[catIndex].items[itemIndex][event.target.name as keyof IngredientItem] = event.target.value;
      setFormData({...formData, ingredients: newIngredients});
  };

  const addCategory = () => {
      setFormData({
          ...formData,
          ingredients: [...formData.ingredients, { category: "", items: [{ name: "", quantity: "" }] }]
      });
  };

  const removeCategory = (catIndex: number) => {
      if (formData.ingredients.length > 1) {
          const newIngredients = [...formData.ingredients];
          newIngredients.splice(catIndex, 1);
          setFormData({ ...formData, ingredients: newIngredients });
      } else {
          toast({ title: "Cannot remove", description: "At least one ingredient category is required.", variant: "destructive"});
      }
  };

  const addIngredientItem = (catIndex: number) => {
      const newIngredients = [...formData.ingredients];
      newIngredients[catIndex].items.push({ name: "", quantity: "" });
      setFormData({ ...formData, ingredients: newIngredients });
  };

  const removeIngredientItem = (catIndex: number, itemIndex: number) => {
      const newIngredients = [...formData.ingredients];
      if (newIngredients[catIndex].items.length > 1) {
          newIngredients[catIndex].items.splice(itemIndex, 1);
          setFormData({ ...formData, ingredients: newIngredients });
      } else {
           toast({ title: "Cannot remove", description: "At least one ingredient item per category is required.", variant: "destructive"});
      }
  };


  // --- Regular handlers for nutrition and instructions ---
   const handleNutritionChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const list: any = [...formData.nutrition];
    list[index][(event.target as HTMLInputElement).name] = event.target.value;
    setFormData({ ...formData, nutrition: list });
  };

   const handleInstructionChange = (index: number, event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const list = [...formData.instructions];
    list[index] = event.target.value;
    setFormData({ ...formData, instructions: list });
  };

    const addNutritionField = () => {
    setFormData({ ...formData, nutrition: [...formData.nutrition, { name: "", quantity: "" }] });
  };

    const removeNutritionField = (index: number) => {
    const list = [...formData.nutrition];
    if (list.length > 1) {
        list.splice(index, 1);
        setFormData({ ...formData, nutrition: list });
    }
  };

  const addInstructionField = () => {
      setFormData({ ...formData, instructions: [...formData.instructions, ""] });
    };

  const removeInstructionField = (index: number) => {
    const list = [...formData.instructions];
    if (list.length > 1) {
        list.splice(index, 1);
        setFormData({ ...formData, instructions: list });
    }
  };

  // --- handleSubmit to format nested ingredients ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submissionData = {
        ...formData,
        // Transform ingredients back to the backend structure
        ingredients: formData.ingredients
          .filter(cat => cat.category.trim() !== '') // Ignore categories without names
          .map(cat => ({
            category: cat.category.trim(),
            items: cat.items
              .map(item => `${item.quantity.trim()} ${item.name.trim()}`) // Combine quantity and name
              .filter(itemString => itemString.trim() !== '') // Ignore empty items
          }))
          .filter(cat => cat.items.length > 0), // Ignore categories with no valid items
        nutrition: formData.nutrition.reduce((obj, item) => {
            if (item.name.trim()) {
                return { ...obj, [item.name.trim().toLowerCase()]: item.quantity.trim() };
            }
            return obj;
        }, {}),
    };

    // Basic validation: Check if there's at least one ingredient category with items
    if (submissionData.ingredients.length === 0) {
        toast({ title: "Validation Error", description: "Please add at least one ingredient category with items.", variant: "destructive"});
        return;
    }


    try {
        // --- THIS LINE WAS CORRECTED ---
        const response = await fetch(isEditing ? `${API_BASE_URL}/api/recipes/${id}` : `${API_BASE_URL}/api/recipes`, {
        // ---
            method: isEditing ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`,
            },
            body: JSON.stringify(submissionData),
        });

        if (response.ok) {
            toast({ title: `Recipe ${isEditing ? 'updated' : 'created'} successfully!` });
            navigate('/admin/recipes');
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to ${isEditing ? 'update' : 'create'} recipe`);
        }
    } catch (error) {
        toast({ title: 'An error occurred', description: (error as Error).message, variant: 'destructive' });
    }
  };


  return (
    <AdminLayout>
      <div className="bg-[#067a45] relative">
        <Button asChild variant="ghost" className="absolute top-4 left-4 text-white hover:bg-green-700 hover:text-white">
          <Link to="/admin/recipes">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </Link>
        </Button>
        
        <div className="text-center py-6">
            <h1 className="text-4xl font-bold text-white tracking-wider">
              {isEditing ? 'EDIT RECIPE' : 'NEW RECIPE'}
            </h1>
        </div>
      </div>
      <div className="container mx-auto px-4 md:px-6 py-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
            <p>Add the following details of the recipe</p>

            <Input name="title" placeholder="Recipe Name" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="h-12 text-lg"/>
            <Textarea name="description" placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />

            <div className="grid grid-cols-3 gap-4">
                <Input name="serves" placeholder="Serve" value={formData.serves} onChange={(e) => setFormData({...formData, serves: e.target.value})} />
                <Input name="cookTime" placeholder="Cooking Time" value={formData.cookTime} onChange={(e) => setFormData({...formData, cookTime: e.target.value})} />
                <Input name="prepTime" placeholder="Preparation Time" value={formData.prepTime} onChange={(e) => setFormData({...formData, prepTime: e.target.value})} />
            </div>

            <Input name="image" placeholder="Photo Link" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} />
            <Input name="videoUrl" placeholder="Video Link" value={formData.videoUrl} onChange={(e) => setFormData({...formData, videoUrl: e.target.value})} />

            {/* --- Ingredients Section with Categories --- */}
            <Card>
                <CardHeader className="bg-[#067a45] text-white rounded-t-lg p-3">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">Ingredients</CardTitle>
                        <Button type="button" size="sm" variant="secondary" onClick={addCategory} className="bg-white text-green-700 hover:bg-gray-100">
                           <PlusCircle className="mr-2 h-4 w-4"/> Add Category
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                   {formData.ingredients.map((category, catIndex) => (
                       <div key={catIndex} className="border-b last:border-b-0">
                            <div className="bg-green-50 p-3 flex justify-between items-center">
                                <Input
                                    placeholder={`Category Name ${catIndex + 1}`}
                                    value={category.category}
                                    onChange={(e) => handleCategoryChange(catIndex, e)}
                                    className="text-md font-semibold border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent flex-grow mr-2"
                                />
                                <div className="flex items-center gap-1">
                                    <Button type="button" size="icon" variant="ghost" onClick={() => addIngredientItem(catIndex)} className="text-green-600 hover:text-green-700 hover:bg-green-100 h-7 w-7">
                                        <PlusCircle className="h-5 w-5" />
                                    </Button>
                                     <Button type="button" size="icon" variant="ghost" onClick={() => removeCategory(catIndex)} className="text-red-500 hover:text-red-600 hover:bg-red-100 h-7 w-7">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                           <Table>
                                <TableHeader className="bg-green-100">
                                    <TableRow>
                                        <TableHead>Item Name</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead className="w-12"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {category.items.map((item, itemIndex) => (
                                        <TableRow key={itemIndex}>
                                            <TableCell><Input name="name" placeholder="e.g., Flour" value={item.name} onChange={(e) => handleIngredientItemChange(catIndex, itemIndex, e)} /></TableCell>
                                            <TableCell><Input name="quantity" placeholder="e.g., 2 cups" value={item.quantity} onChange={(e) => handleIngredientItemChange(catIndex, itemIndex, e)} /></TableCell>
                                            <TableCell>
                                                <Button type="button" size="icon" variant="ghost" onClick={() => removeIngredientItem(catIndex, itemIndex)}>
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                       </div>
                   ))}
                </CardContent>
            </Card>

            {/* Nutrition (Unchanged UI) */}
            <div className="border rounded-lg">
                <div className="bg-[#067a45] text-white p-2 flex justify-between items-center rounded-t-lg">
                    <h3 className="font-semibold">Nutrition Value</h3>
                    <Button type="button" size="icon" variant="ghost" onClick={addNutritionField} className="hover:bg-green-700"><PlusCircle /></Button>
                </div>
                 <Table>
                    <TableHeader className="bg-green-100">
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {formData.nutrition.map((nut, index) => (
                            <TableRow key={index}>
                                <TableCell><Input name="name" placeholder="e.g., calories" value={nut.name} onChange={(e) => handleNutritionChange(index, e)} /></TableCell>
                                <TableCell><Input name="quantity" placeholder="e.g., 300" value={nut.quantity} onChange={(e) => handleNutritionChange(index, e)} /></TableCell>
                                <TableCell><Button type="button" size="icon" variant="ghost" onClick={() => removeNutritionField(index)}><Trash2 className="h-4 w-4 text-red-500" /></Button></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

             {/* Instructions (Unchanged UI) */}
            <div className="border rounded-lg">
                <div className="bg-[#067a45] text-white p-2 flex justify-between items-center rounded-t-lg">
                    <h3 className="font-semibold">Instruction</h3>
                    <Button type="button" size="icon" variant="ghost" onClick={addInstructionField} className="hover:bg-green-700"><PlusCircle /></Button>
                </div>
                 <Table>
                    <TableBody>
                        {formData.instructions.map((inst, index) => (
                            <TableRow key={index}>
                                <TableCell className="w-12 text-center align-top pt-5">{index + 1}</TableCell>
                                <TableCell><Textarea value={inst} onChange={(e) => handleInstructionChange(index, e)} rows={3} /></TableCell>
                                <TableCell className="w-12 align-top pt-5"><Button type="button" size="icon" variant="ghost" onClick={() => removeInstructionField(index)}><Trash2 className="h-4 w-4 text-red-500" /></Button></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="flex justify-end">
                <Button type="submit" size="lg">{isEditing ? 'Update Recipe' : 'Create Recipe'}</Button>
            </div>

        </form>
      </div>
    </AdminLayout>
  );
};

export default RecipeForm;