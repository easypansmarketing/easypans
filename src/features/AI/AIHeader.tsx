import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import logo from "@/assets/logo.png";

const AIHeader = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0a0f1c]/80 backdrop-blur-md text-white transition-all duration-300">
      <div className="container mx-auto px-4 md:px-6">
        {/* Container Height: h-16 (Matches your main Header.tsx) */}
        <div className="flex h-16 items-center justify-between">
          
          {/* --- LEFT SIDE: LOGO --- */}
          <Link 
            to="/" 
            className="flex-shrink-0 transition-transform hover:scale-105 duration-300"
            title="Go to Home"
          >
            {/* Logo Height: h-14 (Matches your main Header.tsx) */}
            <img 
              src={logo} 
              alt="EasyPans Logo" 
              className="h-14 w-auto brightness-0 invert opacity-95" 
            />
          </Link>

          {/* --- RIGHT SIDE: BACK BUTTON --- */}
          <Button 
            asChild 
            variant="outline" 
            size="sm"
            className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-green-400 hover:border-green-500/50 rounded-full px-4 h-9 transition-all duration-300"
          >
            <Link to="/recipes" className="flex items-center gap-2">
              <span className="font-medium">Back to Recipes</span>
              <LogOut className="h-4 w-4" />
            </Link>
          </Button>

        </div>
      </div>
    </header>
  );
};

export default AIHeader;