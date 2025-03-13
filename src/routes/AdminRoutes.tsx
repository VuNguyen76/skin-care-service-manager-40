
import { Route, Routes } from "react-router-dom";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import ServicesManagement from "@/pages/admin/ServicesManagement";
import SpecialistsManagement from "@/pages/admin/SpecialistsManagement";
import BlogManagement from "@/pages/admin/BlogManagement";
import BookingManagement from "@/pages/admin/BookingManagement";
import SettingsManagement from "@/pages/admin/SettingsManagement";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { Spinner } from "@/components/ui/spinner";
import AdminLayout from "@/components/layout/AdminLayout";

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
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="services" element={<ServicesManagement />} />
        <Route path="specialists" element={<SpecialistsManagement />} />
        <Route path="blogs" element={<BlogManagement />} />
        <Route path="bookings" element={<BookingManagement />} />
        <Route path="settings" element={<SettingsManagement />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
