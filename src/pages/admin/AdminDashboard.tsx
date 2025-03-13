
import React, { useState } from "react";
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
    retry: 1
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // Use API data if available, and handle error scenarios
  if (!dashboardStats && error) {
    console.error("Lỗi khi tải dữ liệu thống kê:", error);
  }

  // Always use the data from API
  const stats = dashboardStats || {
    totalUsers: 0,
    totalSpecialists: 0,
    totalBookings: 0,
    totalServices: 0,
    recentBookings: [],
    popularServices: [],
    userGrowth: []
  };

  return (
    <div className="p-6 space-y-8 bg-white">
      <div className="flex flex-col">
        <h2 className="text-2xl font-medium tracking-tight text-gray-900">Trang tổng quan</h2>
        <p className="text-gray-500 mt-1">Chào mừng bạn đến với trang quản trị BeautySkin</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Người dùng</CardTitle>
            <Users className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
            <p className="text-xs text-gray-500 mt-1">Tổng số người dùng đã đăng ký</p>
          </CardContent>
        </Card>
        <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chuyên gia</CardTitle>
            <Users className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalSpecialists}</div>
            <p className="text-xs text-gray-500 mt-1">Chuyên gia chăm sóc da đang hoạt động</p>
          </CardContent>
        </Card>
        <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dịch vụ</CardTitle>
            <Tag className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalServices}</div>
            <p className="text-xs text-gray-500 mt-1">Dịch vụ chăm sóc da hiện có</p>
          </CardContent>
        </Card>
        <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lịch hẹn</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalBookings}</div>
            <p className="text-xs text-gray-500 mt-1">Tổng số lịch hẹn đã hoàn thành</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border border-gray-100 shadow-sm col-span-1">
          <CardHeader>
            <CardTitle className="text-base font-medium">Lịch hẹn gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              {stats.recentBookings && stats.recentBookings.length > 0 ? (
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
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  Không có dữ liệu lịch hẹn
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-100 shadow-sm col-span-1">
          <CardHeader>
            <CardTitle className="text-base font-medium">Dịch vụ phổ biến</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              {stats.popularServices && stats.popularServices.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.popularServices} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                    <XAxis type="number" tick={{ fill: '#888' }} tickLine={false} axisLine={false} />
                    <YAxis dataKey="name" type="category" tick={{ fill: '#888' }} width={100} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '8px' }} />
                    <Bar dataKey="value" fill="#F472B6" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  Không có dữ liệu dịch vụ
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-gray-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-medium">Tăng trưởng người dùng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[240px]">
            {stats.userGrowth && stats.userGrowth.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.userGrowth} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fill: '#888' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: '#888' }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="users" stroke="#10B981" strokeWidth={2} dot={{ stroke: '#10B981', strokeWidth: 2, fill: '#fff', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                Không có dữ liệu tăng trưởng
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
