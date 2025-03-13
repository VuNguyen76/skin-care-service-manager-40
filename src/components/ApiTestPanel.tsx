
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  blogApi, 
  serviceApi, 
  specialistApi, 
  bookingApi, 
  reviewApi, 
  categoryApi, 
  userApi, 
  statsApi,
  profileApi,
  settingsApi
} from "@/services/api";

const ApiTestPanel = () => {
  const [selectedApi, setSelectedApi] = useState<string>("blog");
  const [responseData, setResponseData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const apiMap: Record<string, any> = {
    blog: blogApi,
    service: serviceApi,
    specialist: specialistApi,
    booking: bookingApi,
    review: reviewApi,
    category: categoryApi,
    user: userApi,
    stats: statsApi,
    profile: profileApi,
    settings: settingsApi
  };
  
  const methodOptions: Record<string, any> = {
    blog: [
      { label: "Tất cả bài viết", method: "getAll", params: { published: true } },
      { label: "Bài viết theo ID", method: "getById", params: 1 }
    ],
    service: [
      { label: "Tất cả dịch vụ", method: "getAll" },
      { label: "Dịch vụ theo ID", method: "getById", params: 1 },
      { label: "Dịch vụ theo danh mục", method: "getByCategory", params: 1 },
      { label: "Dịch vụ theo chuyên gia", method: "getBySpecialist", params: 1 }
    ],
    specialist: [
      { label: "Tất cả chuyên gia", method: "getAll" },
      { label: "Chuyên gia theo ID", method: "getById", params: 1 },
      { label: "Chuyên gia theo dịch vụ", method: "getByService", params: 1 },
      { label: "Chuyên gia đánh giá cao", method: "getTopRated" },
      { label: "Lịch làm việc của chuyên gia", method: "getSchedule", params: 1 }
    ],
    booking: [
      { label: "Lịch đặt của tôi", method: "getMyBookings" },
      { label: "Chi tiết lịch đặt", method: "getBookingDetails", params: 1 },
      { label: "Kiểm tra khả dụng", method: "checkAvailability", params: { specialistId: 1, date: new Date().toISOString().split('T')[0] } }
    ],
    review: [
      { label: "Đánh giá theo chuyên gia", method: "getBySpecialist", params: 1 },
      { label: "Đánh giá theo dịch vụ", method: "getByService", params: 1 },
      { label: "Đánh giá của tôi", method: "getMyReviews" }
    ],
    category: [
      { label: "Tất cả danh mục", method: "getAll" },
      { label: "Danh mục theo ID", method: "getById", params: 1 },
      { label: "Dịch vụ trong danh mục", method: "getServices", params: 1 }
    ],
    user: [
      { label: "Thông tin người dùng hiện tại", method: "getCurrentUser" },
      { label: "Kiểm tra trạng thái đăng nhập", method: "checkAuth" }
    ],
    profile: [
      { label: "Thông tin cá nhân", method: "getUserProfile" },
      { label: "Cập nhật thông tin cá nhân", method: "updateProfile", params: { fullName: "Nguyễn Văn A", phoneNumber: "0123456789" } }
    ],
    stats: [
      { label: "Thống kê tổng quan", method: "getOverview" },
      { label: "Thống kê đặt lịch", method: "getBookingStats" },
      { label: "Thống kê doanh thu", method: "getRevenueStats" }
    ],
    settings: [
      { label: "Cài đặt chung", method: "getGeneralSettings" },
      { label: "Cài đặt liên hệ", method: "getContactSettings" },
      { label: "Cài đặt mạng xã hội", method: "getSocialSettings" },
      { label: "Cài đặt đặt lịch", method: "getBookingSettings" }
    ]
  };
  
  const [selectedMethod, setSelectedMethod] = useState<string>(
    methodOptions[selectedApi]?.[0]?.method || ""
  );
  
  const handleApiChange = (api: string) => {
    setSelectedApi(api);
    setSelectedMethod(methodOptions[api]?.[0]?.method || "");
    setResponseData(null);
    setError(null);
  };
  
  const handleMethodChange = (method: string) => {
    setSelectedMethod(method);
    setResponseData(null);
    setError(null);
  };
  
  const executeApiCall = async () => {
    setIsLoading(true);
    setResponseData(null);
    setError(null);
    
    try {
      const api = apiMap[selectedApi];
      const methodConfig = methodOptions[selectedApi].find((m: any) => m.method === selectedMethod);
      
      if (!api || !methodConfig) {
        throw new Error("Lựa chọn API hoặc phương thức không hợp lệ");
      }
      
      let result;
      if (methodConfig.params) {
        result = await api[methodConfig.method](methodConfig.params);
      } else {
        result = await api[methodConfig.method]();
      }
      
      setResponseData(result);
    } catch (err: any) {
      console.error("Error fetching API:", err);
      setError(err.message || "Đã xảy ra lỗi khi gọi API");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Kiểm thử API</CardTitle>
        <CardDescription>Kiểm tra chức năng và kết nối API</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Chọn API</label>
            <Select value={selectedApi} onValueChange={handleApiChange}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn API" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blog">API Bài viết</SelectItem>
                <SelectItem value="service">API Dịch vụ</SelectItem>
                <SelectItem value="specialist">API Chuyên gia</SelectItem>
                <SelectItem value="booking">API Đặt lịch</SelectItem>
                <SelectItem value="category">API Danh mục</SelectItem>
                <SelectItem value="review">API Đánh giá</SelectItem>
                <SelectItem value="user">API Người dùng</SelectItem>
                <SelectItem value="profile">API Hồ sơ</SelectItem>
                <SelectItem value="stats">API Thống kê</SelectItem>
                <SelectItem value="settings">API Cài đặt</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Chọn phương thức</label>
            <Select value={selectedMethod} onValueChange={handleMethodChange}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn phương thức" />
              </SelectTrigger>
              <SelectContent>
                {methodOptions[selectedApi]?.map((option: any) => (
                  <SelectItem key={option.method} value={option.method}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button 
          onClick={executeApiCall} 
          disabled={isLoading || !selectedApi || !selectedMethod}
          className="w-full"
        >
          {isLoading ? "Đang tải..." : "Thực hiện gọi API"}
        </Button>
        
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Lỗi</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {responseData && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Kết quả:</h3>
            <div className="p-4 bg-gray-50 rounded-md overflow-auto max-h-60">
              <pre className="text-xs">{JSON.stringify(responseData, null, 2)}</pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiTestPanel;
