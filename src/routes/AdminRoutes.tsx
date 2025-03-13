
import { Route, Routes } from "react-router-dom";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import ServicesManagement from "@/pages/admin/ServicesManagement";
import SpecialistsManagement from "@/pages/admin/SpecialistsManagement";
import BlogManagement from "@/pages/admin/BlogManagement";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { Spinner } from "@/components/ui/spinner";

export const AdminRoutes = () => {
  const { isLoading, isAdmin } = useAdminAuth();
  
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (!isAdmin) {
    return null; // The hook will redirect
  }
  
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/services" element={<ServicesManagement />} />
      <Route path="/specialists" element={<SpecialistsManagement />} />
      <Route path="/blogs" element={<BlogManagement />} />
      {/* Add more admin routes as needed */}
    </Routes>
  );
};

export default AdminRoutes;
