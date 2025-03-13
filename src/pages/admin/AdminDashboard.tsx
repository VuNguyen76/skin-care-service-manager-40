
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { statsApi, serviceApi, specialistApi, bookingApi, blogApi } from "@/services/api";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, LineChart, Line } from "recharts";
import { CalendarDays, Clock, Users, Calendar, FileText, DollarSign, TrendingUp, CheckCircle, AlertCircle } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const AdminDashboard = () => {
  const [period, setPeriod] = useState<"weekly" | "monthly" | "yearly">("monthly");
  
  const { data: dashboardStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: statsApi.getDashboardStats,
    retry: 1,
  });

  const { data: bookingStats, isLoading: isLoadingBookingStats } = useQuery({
    queryKey: ["booking-stats", period],
    queryFn: () => statsApi.getBookingStats({ period }),
    retry: 1,
  });

  const { data: revenueStats, isLoading: isLoadingRevenueStats } = useQuery({
    queryKey: ["revenue-stats", period],
    queryFn: () => statsApi.getRevenueStats({ period }),
    retry: 1,
  });

  const { data: services, isLoading: isLoadingServices } = useQuery({
    queryKey: ["services-popularity"],
    queryFn: statsApi.getServicePopularity,
    retry: 1,
  });

  const { data: specialists, isLoading: isLoadingSpecialists } = useQuery({
    queryKey: ["specialists-performance"],
    queryFn: statsApi.getSpecialistPerformance,
    retry: 1,
  });

  const { data: latestBookings, isLoading: isLoadingLatestBookings } = useQuery({
    queryKey: ["latest-bookings"],
    queryFn: () => bookingApi.getAllBookings({ status: "all" }),
    retry: 1,
  });

  const { data: latestBlogs, isLoading: isLoadingLatestBlogs } = useQuery({
    queryKey: ["latest-blogs"],
    queryFn: () => blogApi.getAll(),
    retry: 1,
  });

  if (isLoadingStats) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  // Fallback mock data if API doesn't return data yet
  const stats = dashboardStats || {
    totalCustomers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalServices: 0,
    completedBookings: 0,
    pendingBookings: 0,
    totalSpecialists: 0,
    totalBlogs: 0
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bảng điều khiển</h1>
        <p className="text-muted-foreground">
          Tổng quan về doanh nghiệp của bạn
        </p>
      </div>

      {/* Top Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khách hàng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Tổng số khách hàng
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đặt lịch</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Tổng số lịch hẹn
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()}đ</div>
            <p className="text-xs text-muted-foreground">
              Tổng doanh thu
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chuyên viên</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSpecialists}</div>
            <p className="text-xs text-muted-foreground">
              Tổng số chuyên viên
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="bookings" className="space-y-4">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="bookings">Đặt lịch</TabsTrigger>
          <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
          <TabsTrigger value="services">Dịch vụ</TabsTrigger>
          <TabsTrigger value="specialists">Chuyên viên</TabsTrigger>
        </TabsList>
        <TabsContent value="bookings" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Số lượng đặt lịch theo thời gian</CardTitle>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPeriod("weekly")}
                    className={`px-2.5 py-1.5 text-xs font-medium rounded-md ${
                      period === "weekly" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    Tuần
                  </button>
                  <button
                    onClick={() => setPeriod("monthly")}
                    className={`px-2.5 py-1.5 text-xs font-medium rounded-md ${
                      period === "monthly" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    Tháng
                  </button>
                  <button
                    onClick={() => setPeriod("yearly")}
                    className={`px-2.5 py-1.5 text-xs font-medium rounded-md ${
                      period === "yearly" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    Năm
                  </button>
                </div>
              </CardHeader>
              <CardContent className="pl-2">
                {isLoadingBookingStats ? (
                  <div className="flex justify-center items-center h-[300px]">
                    <Spinner />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={bookingStats || []}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar name="Đặt lịch" dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Trạng thái đặt lịch</CardTitle>
                <CardDescription>
                  Phân phối trạng thái lịch hẹn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="mr-2 h-2 w-2 rounded-full bg-green-500" />
                    <div className="flex-1">Hoàn thành</div>
                    <div>{stats.completedBookings}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-2 h-2 w-2 rounded-full bg-orange-500" />
                    <div className="flex-1">Đang chờ</div>
                    <div>{stats.pendingBookings}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Doanh thu theo thời gian</CardTitle>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPeriod("weekly")}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-md ${
                    period === "weekly" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  Tuần
                </button>
                <button
                  onClick={() => setPeriod("monthly")}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-md ${
                    period === "monthly" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  Tháng
                </button>
                <button
                  onClick={() => setPeriod("yearly")}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-md ${
                    period === "yearly" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  Năm
                </button>
              </div>
            </CardHeader>
            <CardContent className="pl-2">
              {isLoadingRevenueStats ? (
                <div className="flex justify-center items-center h-[300px]">
                  <Spinner />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueStats || []}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line name="Doanh thu (VNĐ)" type="monotone" dataKey="value" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dịch vụ phổ biến</CardTitle>
              <CardDescription>
                Dịch vụ được đặt nhiều nhất
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingServices ? (
                <div className="flex justify-center items-center h-[300px]">
                  <Spinner />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart layout="vertical" data={services || []}>
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip />
                    <Legend />
                    <Bar name="Số lượt đặt" dataKey="bookings" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="specialists" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Chuyên viên hiệu quả nhất</CardTitle>
              <CardDescription>
                Xếp hạng theo số lượng đặt lịch
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingSpecialists ? (
                <div className="flex justify-center items-center h-[300px]">
                  <Spinner />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart layout="vertical" data={specialists || []}>
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip />
                    <Legend />
                    <Bar name="Số lượt đặt" dataKey="bookings" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Latest Activities */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Lịch hẹn gần đây</CardTitle>
            <CardDescription>
              Các lịch hẹn mới nhất trong hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingLatestBookings ? (
              <div className="flex justify-center py-4">
                <Spinner />
              </div>
            ) : latestBookings && latestBookings.length > 0 ? (
              <div className="space-y-4">
                {latestBookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="flex items-center">
                    <div className="mr-4">
                      {booking.status === "COMPLETED" ? (
                        <CheckCircle className="h-8 w-8 text-green-500" />
                      ) : booking.status === "PENDING" ? (
                        <Clock className="h-8 w-8 text-orange-500" />
                      ) : (
                        <AlertCircle className="h-8 w-8 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {booking.customer?.fullName || "Khách hàng"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {booking.services?.map(s => s.name).join(", ")}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {booking.bookingDate && format(new Date(booking.bookingDate), "dd/MM/yyyy", { locale: vi })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-muted-foreground">Không có lịch hẹn gần đây</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Bài viết gần đây</CardTitle>
            <CardDescription>
              Các bài viết mới nhất trên blog của bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingLatestBlogs ? (
              <div className="flex justify-center py-4">
                <Spinner />
              </div>
            ) : latestBlogs && latestBlogs.length > 0 ? (
              <div className="space-y-4">
                {latestBlogs.slice(0, 5).map((blog) => (
                  <div key={blog.id} className="flex items-center">
                    <div className="mr-4">
                      <FileText className="h-8 w-8 text-blue-500" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {blog.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {blog.isPublished ? "Đã xuất bản" : "Bản nháp"}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {blog.publishedAt 
                        ? format(new Date(blog.publishedAt), "dd/MM/yyyy", { locale: vi }) 
                        : format(new Date(blog.createdAt), "dd/MM/yyyy", { locale: vi })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-muted-foreground">Không có bài viết gần đây</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
