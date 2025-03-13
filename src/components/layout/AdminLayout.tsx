
import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarProvider
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Menu, 
  Home, 
  FileText, 
  Users, 
  Calendar, 
  Tag, 
  Settings, 
  LogOut, 
  ChevronRight, 
  User 
} from "lucide-react";
import useAdminAuth from "@/hooks/use-admin-auth";
import { toast } from "sonner";
import authService from "@/services/authService";

const AdminLayout = () => {
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { isAdmin, isLoading } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
  }, []);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    authService.logout();
    toast.success("Logged out successfully");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="spinner h-8 w-8 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar collapsed={collapsed} className="border-r bg-white shadow-sm">
          <SidebarHeader>
            <div className="flex items-center justify-between px-4 py-3">
              {!collapsed && <h2 className="text-lg font-medium text-gray-900">BeautySkin</h2>}
              <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-gray-500">
                <Menu />
              </Button>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <div className={`px-4 py-2 ${collapsed ? 'hidden' : 'block'}`}>
                <div className="flex items-center space-x-3 mb-6 pt-1">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
                    <User size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{currentUser?.username || "Admin"}</h4>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                </div>
              </div>
              
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem className="mb-1">
                    <SidebarMenuButton asChild>
                      <a href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 font-medium">
                        <Home size={18} />
                        <span>Dashboard</span>
                        {collapsed && <ChevronRight className="ml-auto h-4 w-4" />}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem className="mb-1">
                    <SidebarMenuButton asChild>
                      <a href="/admin/services" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 font-medium">
                        <Tag size={18} />
                        <span>Services</span>
                        {collapsed && <ChevronRight className="ml-auto h-4 w-4" />}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem className="mb-1">
                    <SidebarMenuButton asChild>
                      <a href="/admin/specialists" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 font-medium">
                        <Users size={18} />
                        <span>Specialists</span>
                        {collapsed && <ChevronRight className="ml-auto h-4 w-4" />}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem className="mb-1">
                    <SidebarMenuButton asChild>
                      <a href="/admin/bookings" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 font-medium">
                        <Calendar size={18} />
                        <span>Bookings</span>
                        {collapsed && <ChevronRight className="ml-auto h-4 w-4" />}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem className="mb-1">
                    <SidebarMenuButton asChild>
                      <a href="/admin/blogs" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 font-medium">
                        <FileText size={18} />
                        <span>Blog Posts</span>
                        {collapsed && <ChevronRight className="ml-auto h-4 w-4" />}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem className="mb-1">
                    <SidebarMenuButton asChild>
                      <a href="/admin/settings" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 font-medium">
                        <Settings size={18} />
                        <span>Settings</span>
                        {collapsed && <ChevronRight className="ml-auto h-4 w-4" />}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className="p-4">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900" 
                onClick={handleLogout}
              >
                <LogOut size={18} />
                <span className={collapsed ? 'hidden' : 'block'}>Logout</span>
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
