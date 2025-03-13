
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, Users2, BookText, Newspaper, DollarSign } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { statsApi, serviceApi, specialistApi, bookingApi, blogApi } from "@/services/api";
import { Spinner } from "@/components/ui/spinner";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const AdminDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("overview");
  
  // Thống kê tổng quan
  const { data: dashboardStats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => statsApi.getDashboardStats(),
    onError: (err) => {
      console.error("Lỗi khi tải dữ liệu thống kê:", err);
    }
  });
  
  // Lấy dữ liệu dịch vụ
  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ["services-admin"],
    queryFn: () => serviceApi.getAll(),
  });
  
  // Lấy dữ liệu chuyên gia
  const { data: specialists, isLoading: specialistsLoading } = useQuery({
    queryKey: ["specialists-admin"],
    queryFn: () => specialistApi.getAll(),
  });
  
  // Lấy lịch hẹn gần đây
  const { data: recentBookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ["recent-bookings"],
    queryFn: () => bookingApi.getAllBookings({ status: "CONFIRMED" }),
  });
  
  // Lấy các bài viết gần đây
  const { data: recentBlogs, isLoading: blogsLoading } = useQuery({
    queryKey: ["recent-blogs"],
    queryFn: () => blogApi.getAll(),
  });

  // Dữ liệu biểu đồ mẫu (sẽ được thay thế bằng dữ liệu API thực tế)
  const bookingData = [
    { name: 'T1', value: 65 },
    { name: 'T2', value: 59 },
    { name: 'T3', value: 80 },
    { name: 'T4', value: 81 },
    { name: 'T5', value: 56 },
    { name: 'T6', value: 55 },
    { name: 'T7', value: 60 },
    { name: 'T8', value: 70 },
    { name: 'T9', value: 65 },
    { name: 'T10', value: 75 },
    { name: 'T11', value: 90 },
    { name: 'T12', value: 100 },
  ];

  const revenueData = [
    { name: 'T1', value: 3400 },
    { name: 'T2', value: 2800 },
    { name: 'T3', value: 4300 },
    { name: 'T4', value: 3900 },
    { name: 'T5', value: 4600 },
    { name: 'T6', value: 5400 },
    { name: 'T7', value: 4700 },
    { name: 'T8', value: 5200 },
    { name: 'T9', value: 5800 },
    { name: 'T10', value: 6300 },
    { name: 'T11', value: 6800 },
    { name: 'T12', value: 7900 },
  ];

  // Xử lý khi API chưa hỗ trợ
  const handleAPIUnavailable = () => {
    if (statsError) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-2">API chưa khả dụng hoặc đang bảo trì.</p>
          <p className="text-gray-400 text-sm">Sử dụng dữ liệu mẫu để hiển thị.</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Bảng điều khiển</h2>
        <p className="text-muted-foreground">Tổng quan về hoạt động của hệ thống</p>
      </div>

      <Tabs defaultValue="overview" value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="bookings">Lịch hẹn</TabsTrigger>
          <TabsTrigger value="services">Dịch vụ</TabsTrigger>
          <TabsTrigger value="specialists">Chuyên gia</TabsTrigger>
          <TabsTrigger value="blogs">Bài viết</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {statsLoading ? (
            <div className="h-48 flex items-center justify-center">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              {handleAPIUnavailable()}
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tổng lịch hẹn</CardTitle>
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardStats?.totalBookings || bookingData.reduce((sum, item) => sum + item.value, 0)}</div>
                    <p className="text-xs text-muted-foreground">
                      +{dashboardStats?.bookingIncreasePercent || "20"}% so với tháng trước
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${dashboardStats?.totalRevenue?.toLocaleString() || "56,790"}</div>
                    <p className="text-xs text-muted-foreground">
                      +{dashboardStats?.revenueIncreasePercent || "15"}% so với tháng trước
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tổng khách hàng</CardTitle>
                    <Users2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardStats?.totalCustomers || "1,245"}</div>
                    <p className="text-xs text-muted-foreground">
                      +{dashboardStats?.customerIncreasePercent || "12"}% so với tháng trước
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tổng dịch vụ</CardTitle>
                    <BookText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardStats?.totalServices || services?.length || "28"}</div>
                    <p className="text-xs text-muted-foreground">
                      {dashboardStats?.serviceIncreasePercent ? `+${dashboardStats.serviceIncreasePercent}%` : "+3 dịch vụ"} so với tháng trước
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Lịch hẹn theo tháng</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={dashboardStats?.bookingsByMonth || bookingData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" name="Số lượng" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Doanh thu theo tháng</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={dashboardStats?.revenueByMonth || revenueData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value}`, 'Doanh thu']} />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#8884d8" 
                          activeDot={{ r: 8 }} 
                          name="Doanh thu"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lịch hẹn gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              {bookingsLoading ? (
                <div className="h-48 flex items-center justify-center">
                  <Spinner size="lg" />
                </div>
              ) : recentBookings && recentBookings.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Khách hàng</TableHead>
                      <TableHead>Dịch vụ</TableHead>
                      <TableHead>Ngày</TableHead>
                      <TableHead>Trạng thái</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentBookings.slice(0, 5).map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>#{booking.id}</TableCell>
                        <TableCell>{booking.customer?.fullName || booking.customer?.user?.username || "Khách hàng"}</TableCell>
                        <TableCell>{booking.bookingDetails?.[0]?.service?.name || "Dịch vụ chăm sóc da"}</TableCell>
                        <TableCell>{new Date(booking.appointmentDateTime).toLocaleDateString("vi-VN")}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            booking.status === "CONFIRMED" 
                              ? "bg-green-100 text-green-800" 
                              : booking.status === "PENDING" 
                              ? "bg-yellow-100 text-yellow-800" 
                              : "bg-red-100 text-red-800"
                          }`}>
                            {booking.status === "CONFIRMED" 
                              ? "Đã xác nhận" 
                              : booking.status === "PENDING" 
                              ? "Đang chờ" 
                              : "Đã hủy"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Chưa có lịch hẹn nào.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thống kê dịch vụ</CardTitle>
            </CardHeader>
            <CardContent>
              {servicesLoading ? (
                <div className="h-48 flex items-center justify-center">
                  <Spinner size="lg" />
                </div>
              ) : services && services.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên dịch vụ</TableHead>
                      <TableHead>Giá</TableHead>
                      <TableHead>Thời gian</TableHead>
                      <TableHead>Trạng thái</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {services.slice(0, 5).map((service) => (
                      <TableRow key={service.id}>
                        <TableCell className="font-medium">{service.name}</TableCell>
                        <TableCell>${service.price.toLocaleString()}</TableCell>
                        <TableCell>{service.durationMinutes} phút</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            service.isActive 
                              ? "bg-green-100 text-green-800" 
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {service.isActive ? "Hoạt động" : "Không hoạt động"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Chưa có dịch vụ nào.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="specialists" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Chuyên gia</CardTitle>
            </CardHeader>
            <CardContent>
              {specialistsLoading ? (
                <div className="h-48 flex items-center justify-center">
                  <Spinner size="lg" />
                </div>
              ) : specialists && specialists.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên</TableHead>
                      <TableHead>Chuyên môn</TableHead>
                      <TableHead>Đánh giá</TableHead>
                      <TableHead>Trạng thái</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {specialists.slice(0, 5).map((specialist) => (
                      <TableRow key={specialist.id}>
                        <TableCell className="font-medium">{specialist.fullName}</TableCell>
                        <TableCell>{specialist.specialization}</TableCell>
                        <TableCell>{specialist.averageRating || "Chưa có đánh giá"}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            specialist.isAvailable 
                              ? "bg-green-100 text-green-800" 
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {specialist.isAvailable ? "Khả dụng" : "Không khả dụng"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Chưa có chuyên gia nào.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="blogs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bài viết gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              {blogsLoading ? (
                <div className="h-48 flex items-center justify-center">
                  <Spinner size="lg" />
                </div>
              ) : recentBlogs && recentBlogs.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tiêu đề</TableHead>
                      <TableHead>Tác giả</TableHead>
                      <TableHead>Lượt xem</TableHead>
                      <TableHead>Trạng thái</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentBlogs.slice(0, 5).map((blog) => (
                      <TableRow key={blog.id}>
                        <TableCell className="font-medium">{blog.title}</TableCell>
                        <TableCell>{blog.author?.username || "Admin"}</TableCell>
                        <TableCell>{blog.viewCount || 0}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            blog.isPublished 
                              ? "bg-green-100 text-green-800" 
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {blog.isPublished ? "Đã xuất bản" : "Nháp"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Chưa có bài viết nào.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
