import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ChefHat, Clock, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  // Check if it's AI-Chef related route
  const isAIChef = location.pathname.toLowerCase().includes('ai-chef') || 
                   location.pathname.toLowerCase().includes('chef');

  if (isAIChef) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-lime-50 py-12">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="mb-8">
              <div className="relative inline-block">
                <ChefHat className="h-24 w-24 text-emerald-600 mx-auto mb-4" />
                <Sparkles className="h-8 w-8 text-yellow-500 absolute -top-2 -right-2 animate-pulse" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AI Chef
            </h1>
            
            <div className="flex items-center justify-center gap-2 mb-6">
              <Clock className="h-5 w-5 text-emerald-600" />
              <span className="text-xl font-semibold text-emerald-600">Coming Soon!</span>
            </div>
            
            <p className="text-gray-600 mb-8 leading-relaxed">
              Our AI Chef is being trained to help you cook better. 
              Get ready for personalized cooking guidance and smart recipe suggestions!
            </p>
            
            <Button asChild className="rounded-xl">
              <Link to="/">
                Return to Home
              </Link>
            </Button>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-gray-600">Oops! Page not found</p>
        <a href="/" className="text-blue-500 underline hover:text-blue-700">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
