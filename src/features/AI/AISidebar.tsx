import { ChefHat, Settings, Sparkles, User, Tv } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const AISidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  // Updated Navigation Items per your request
  const navItems = [
    { icon: Sparkles, label: "Recipe Generator", path: "/ai-chef" }, // Main Page
    { icon: Tv, label: "Virtual Chef", path: "/virtual-chef" },      // New Feature
    { icon: User, label: "User Profile", path: "/profile" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <aside className="w-20 md:w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 h-[calc(100vh-80px)] hidden md:flex flex-col pt-6">
      
      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${isActive(item.path) 
                ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-400 font-medium shadow-[0_0_15px_rgba(0,0,0,0.2)]" 
                : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
          >
            <item.icon className={`w-5 h-5 ${isActive(item.path) ? "text-green-400" : ""}`} />
            <span className="font-medium">{item.label}</span>
            
            {/* Beta Badge for Virtual Chef */}
            {item.label === "Virtual Chef" && (
              <span className="ml-auto text-[10px] uppercase tracking-wider bg-green-500 text-black px-1.5 py-0.5 rounded font-bold">
                BETA
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="p-4 mt-auto border-t border-white/10">
        <p className="text-xs text-gray-500 text-center">EasyPans AI v1.0</p>
      </div>
    </aside>
  );
};

export default AISidebar;