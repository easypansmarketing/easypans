import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public Pages
import Index from "./pages/Index";
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// AI Features
import AIChefPage from "./features/AI/AIChefPage"; 
import VirtualChefPage from "./features/VirtualChef/VirtualChefPage"; // <--- NEW IMPORT

// Admin Pages
import AdminHome from "./pages/admin/AdminHome";
import AdminRecipes from "./pages/admin/AdminRecipes";
import RecipeForm from "./pages/admin/RecipeForm";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminRecipeDetail from "./pages/admin/AdminRecipeDetail";

// Auth Components
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* --- Public User-Facing Routes --- */}
          <Route path="/" element={<Index />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/login" element={<Login />} />
          
          {/* --- AI Chef Routes (Sidebar Features) --- */}
          <Route path="/ai-chef" element={<AIChefPage />} />            {/* Recipe Generator */}
          <Route path="/virtual-chef" element={<VirtualChefPage />} />  {/* NEW Virtual Chef */}
          
          {/* Placeholders for other Sidebar Links (Prevents 404 Errors) */}
          <Route path="/profile" element={<div className="min-h-screen bg-slate-900 text-white p-10 font-bold text-2xl">User Profile - Coming Soon</div>} />
          <Route path="/settings" element={<div className="min-h-screen bg-slate-900 text-white p-10 font-bold text-2xl">Settings - Coming Soon</div>} />

          {/* --- Protected User Route (for recipe details) --- */}
          <Route element={<ProtectedRoute />}>
            <Route path="/recipe/:id" element={<RecipeDetail />} />
          </Route>

          {/* --- Protected Admin Routes --- */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminHome />} />
            <Route path="/admin/recipes" element={<AdminRecipes />} />
            <Route path="/admin/recipes/new" element={<RecipeForm />} />
            <Route path="/admin/recipes/edit/:id" element={<RecipeForm />} />
            <Route path="/admin/recipes/:id" element={<AdminRecipeDetail />} />
            <Route path="/admin/users" element={<AdminUsers />} />
          </Route>

          {/* Catch-all Not Found Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;