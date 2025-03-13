
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { statsApi } from "@/services/api";
import { Spinner } from "@/components/ui/spinner";
import { Calendar, Users, Tag, FileText } from "lucide-react";

const AdminDashboard = () => {
  const { data: dashboardStats, isLoading, error } = useQuery({
    queryKey: ["stats", "dashboard"],
    queryFn: () => statsApi.getDashboardStats(),
    retry: false
  });

  // Fallback data when API isn't available
  const mockData = {
    totalUsers: 120,
    totalSpecialists: 15,
    totalBookings: 450,
    totalServices: 35,
    recentBookings: [],
    popularServices: []
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // Use real data if available, otherwise use mock data
  const stats = dashboardStats || mockData;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-light tracking-tight">Dashboard</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered users in the system</p>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Specialists</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSpecialists}</div>
            <p className="text-xs text-muted-foreground">Active skincare specialists</p>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Services</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalServices}</div>
            <p className="text-xs text-muted-foreground">Available skincare services</p>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">Completed appointments</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
