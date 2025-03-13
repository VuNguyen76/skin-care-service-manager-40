
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
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
import { Menu, Home, FileText, Users, Calendar, Tag, Settings, LogOut } from "lucide-react";
import useAdminAuth from "@/hooks/use-admin-auth";
import { toast } from "sonner";

const AdminLayout = () => {
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);
  const { isAdmin, isLoading } = useAdminAuth();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    window.location.href = "/login";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="spinner h-8 w-8 mx-auto mb-4"></div>
          <p>Checking permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-muted/20">
        <Sidebar defaultCollapsed={collapsed} className="border-r">
          <SidebarHeader>
            <div className="flex items-center justify-between px-4 py-2">
              <h2 className="text-lg font-semibold">Skincare Admin</h2>
              <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                <Menu />
              </Button>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="/admin" className="flex items-center gap-2">
                        <Home size={20} />
                        <span>Dashboard</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="/admin/services" className="flex items-center gap-2">
                        <Tag size={20} />
                        <span>Services</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="/admin/specialists" className="flex items-center gap-2">
                        <Users size={20} />
                        <span>Specialists</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="/admin/bookings" className="flex items-center gap-2">
                        <Calendar size={20} />
                        <span>Bookings</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="/admin/blogs" className="flex items-center gap-2">
                        <FileText size={20} />
                        <span>Blog Posts</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="/admin/settings" className="flex items-center gap-2">
                        <Settings size={20} />
                        <span>Settings</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className="p-4">
              <Button variant="outline" className="w-full justify-start gap-2" onClick={handleLogout}>
                <LogOut size={18} />
                <span>Logout</span>
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
