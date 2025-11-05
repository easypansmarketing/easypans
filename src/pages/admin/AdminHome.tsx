import { Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { NotebookText, Users, ArrowRight } from 'lucide-react';

const AdminHome = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 md:px-6 py-8">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Welcome back, {userInfo.username || 'Admin'}.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/admin/recipes">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-medium">
                  Manage Recipes
                </CardTitle>
                <NotebookText className="h-6 w-6 text-primary" />
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Add, edit, or delete recipes from the website.
                </CardDescription>
              </CardContent>
              <div className="flex items-center p-6 pt-0">
                <span className="text-sm font-medium text-primary flex items-center">
                  Go to Recipes <ArrowRight className="h-4 w-4 ml-1" />
                </span>
              </div>
            </Card>
          </Link>

          <Link to="/admin/users">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-medium">
                  Manage Users
                </CardTitle>
                <Users className="h-6 w-6 text-primary" />
              </CardHeader>
              <CardContent>
                <CardDescription>
                  View and manage all registered users.
                </CardDescription>
              </CardContent>
              <div className="flex items-center p-6 pt-0">
                <span className="text-sm font-medium text-primary flex items-center">
                  Go to Users <ArrowRight className="h-4 w-4 ml-1" />
                </span>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminHome;