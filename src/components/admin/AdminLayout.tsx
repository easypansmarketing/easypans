import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Home, NotebookText, Users, PanelLeft } from "lucide-react";
import logo from "../../assets/logo.png";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarHeader>
            <Link to="/admin" className="flex items-center gap-2">
              <img src={logo} alt="EasyPans Logo" className="h-12 w-auto" />
            </Link>
          </SidebarHeader>

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive("/admin")}
                tooltip="Dashboard"
              >
                <Link to="/admin">
                  <Home />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={location.pathname.startsWith("/admin/recipes")}
                tooltip="Manage Recipes"
              >
                <Link to="/admin/recipes">
                  <NotebookText />
                  <span>Manage Recipes</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive("/admin/users")}
                tooltip="Manage Users"
              >
                <Link to="/admin/users">
                  <Users />
                  <span>Manage Users</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${userInfo.username}`} alt={userInfo.username} />
              <AvatarFallback>{getInitials(userInfo.username)}</AvatarFallback>
            </Avatar>
            <span className="font-medium truncate group-data-[collapsible=icon]:hidden">
              {userInfo.username}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="ml-auto group-data-[collapsible=icon]:hidden"
              aria-label="Log out"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        {/* Mobile Header */}
        <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b bg-background px-4 md:hidden">
          <Link to="/admin">
            <img src={logo} alt="EasyPans Logo" className="h-12 w-auto" />
          </Link>
          <SidebarTrigger>
            <PanelLeft />
          </SidebarTrigger>
        </header>
        
        {/* Main Page Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;