
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Quiz from "./pages/Quiz";
import ServicesPage from "./pages/ServicesPage";
import SpecialistsPage from "./pages/SpecialistsPage";
import SpecialistDetail from "./pages/SpecialistDetail";
import BookingPage from "./pages/BookingPage";
import MyBookings from "./pages/MyBookings";
import NotFound from "./pages/NotFound";
import BlogsPage from "./pages/BlogsPage";
import BlogDetail from "./pages/BlogDetail";

// Admin pages
import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import BlogManagement from "./pages/admin/BlogManagement";
import ServicesManagement from "./pages/admin/ServicesManagement";
import SpecialistsManagement from "./pages/admin/SpecialistsManagement";
import BookingManagement from "./pages/admin/BookingManagement";
import SettingsManagement from "./pages/admin/SettingsManagement";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/specialists" element={<SpecialistsPage />} />
          <Route path="/specialists/:id" element={<SpecialistDetail />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="blogs" element={<BlogManagement />} />
            <Route path="services" element={<ServicesManagement />} />
            <Route path="specialists" element={<SpecialistsManagement />} />
            <Route path="bookings" element={<BookingManagement />} />
            <Route path="settings" element={<SettingsManagement />} />
          </Route>
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
