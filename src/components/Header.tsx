import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, LogOut } from "lucide-react";
import logo from "@/assets/logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const storedInfo = localStorage.getItem("userInfo");
    if (storedInfo) {
      setUserInfo(JSON.parse(storedInfo));
    } else {
      setUserInfo(null);
    }
  }, [location]); // Re-check on route change

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUserInfo(null);
    navigate("/"); // Redirect to home page after logout
  };

  const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative flex h-16 items-center justify-between">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <nav className="grid gap-6 text-base font-medium mt-6">
                  <Link to="/" className="flex items-center gap-2 font-semibold mb-4">
                    <img src={logo} alt="EasyPans Logo" className="h-7 w-auto" />
                  </Link>
                  <Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link>
                  <Link to="/recipes" className="text-muted-foreground hover:text-foreground">Recipe</Link>
                  <Link to="/#about" className="text-muted-foreground hover:text-foreground">About Us</Link>
                  {userInfo ? (
                     <Button onClick={handleLogout} className="font-medium w-full mt-4">Logout</Button>
                  ) : (
                    <Button asChild className="font-medium w-full mt-4"><Link to="/login">Login</Link></Button>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          <Link to="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:static md:left-auto md:top-auto md:translate-x-0 md:translate-y-0">
            <img src={logo} alt="EasyPans Logo" className="h-14 w-auto" />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-8">
              <Link to="/" className={`text-lg font-medium transition-colors hover:text-primary ${isActive("/") && !isActive("/recipes") ? "text-primary" : "text-muted-foreground"}`}>Home</Link>
              <Link to="/recipes" className={`text-lg font-medium transition-colors hover:text-primary ${isActive("/recipes") ? "text-primary" : "text-muted-foreground"}`}>Recipe</Link>
              <Link to="/#about" className="text-lg font-medium text-muted-foreground hover:text-primary">About Us</Link>
            </nav>
            {userInfo ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${userInfo.username}`} alt={userInfo.username} />
                      <AvatarFallback>{getInitials(userInfo.username)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild size="sm" className="font-medium text-lg">
                <Link to="/login">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

