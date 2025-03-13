
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { statsApi } from "@/services/api";
import { Spinner } from "@/components/ui/spinner";
import { BarChart, AreaChart, Bar, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Calendar, Users, Tag, FileText, TrendingUp, Activity } from "lucide-react";

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
    recentBookings: [
      { date: "Jan", count: 30 },
      { date: "Feb", count: 45 },
      { date: "Mar", count: 38 },
      { date: "Apr", count: 52 },
      { date: "May", count: 48 },
      { date: "Jun", count: 60 }
    ],
    popularServices: [
      { name: "Facial Treatment", value: 35 },
      { name: "Chemical Peel", value: 28 },
      { name: "Acne Treatment", value: 22 },
      { name: "Anti-Aging", value: 18 },
      { name: "Hydration", value: 15 }
    ],
    userGrowth: [
      { month: "Jan", users: 80 },
      { month: "Feb", users: 90 },
      { month: "Mar", users: 95 },
      { month: "Apr", users: 105 },
      { month: "May", users: 110 },
      { month: "Jun", users: 120 }
    ]
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
    <div className="p-6 space-y-8 bg-white">
      <div className="flex flex-col">
        <h2 className="text-2xl font-medium tracking-tight text-gray-900">Dashboard</h2>
        <p className="text-gray-500 mt-1">Welcome to your Skincare Admin Dashboard</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
            <p className="text-xs text-gray-500 mt-1">Registered users in the system</p>
          </CardContent>
        </Card>
        <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Specialists</CardTitle>
            <Users className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalSpecialists}</div>
            <p className="text-xs text-gray-500 mt-1">Active skincare specialists</p>
          </CardContent>
        </Card>
        <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Services</CardTitle>
            <Tag className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalServices}</div>
            <p className="text-xs text-gray-500 mt-1">Available skincare services</p>
          </CardContent>
        </Card>
        <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalBookings}</div>
            <p className="text-xs text-gray-500 mt-1">Completed appointments</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border border-gray-100 shadow-sm col-span-1">
          <CardHeader>
            <CardTitle className="text-base font-medium">Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.recentBookings} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fill: '#888' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: '#888' }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="count" stroke="#4F46E5" fillOpacity={1} fill="url(#colorBookings)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-100 shadow-sm col-span-1">
          <CardHeader>
            <CardTitle className="text-base font-medium">Popular Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.popularServices} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fill: '#888' }} tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" tick={{ fill: '#888' }} width={100} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px' }} />
                  <Bar dataKey="value" fill="#F472B6" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-gray-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-medium">User Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.userGrowth} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fill: '#888' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: '#888' }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px' }} />
                <Line type="monotone" dataKey="users" stroke="#10B981" strokeWidth={2} dot={{ stroke: '#10B981', strokeWidth: 2, fill: '#fff', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
