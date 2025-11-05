import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const AdminUsers = () => {
  return (
    <AdminLayout>
      <div className="container mx-auto px-4 md:px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              User management functionality will be implemented here.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;