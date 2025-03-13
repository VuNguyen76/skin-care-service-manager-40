
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi, bookingApi } from "@/services/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import authService from "@/services/authService";
import { Eye, EyeOff, Camera, User, Calendar, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const UserDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Fetch user profile
  const { data: userProfile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["user", "profile"],
    queryFn: profileApi.getUserProfile,
    onError: () => {
      // Redirect to login if not authenticated
      if (!authService.isAuthenticated()) {
        navigate("/login");
      }
    }
  });
  
  // Fetch user's bookings
  const { data: userBookings, isLoading: isBookingsLoading } = useQuery({
    queryKey: ["user", "bookings"],
    queryFn: bookingApi.getMyBookings,
    enabled: authService.isAuthenticated()
  });

  // Form state
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  // Update profile form when data is loaded
  React.useEffect(() => {
    if (userProfile) {
      setProfileData({
        fullName: userProfile.fullName || "",
        email: userProfile.email || "",
        phoneNumber: userProfile.phoneNumber || "",
        address: userProfile.address || "",
        dateOfBirth: userProfile.dateOfBirth ? format(new Date(userProfile.dateOfBirth), 'yyyy-MM-dd') : "",
      });
    }
  }, [userProfile]);

  // Form handling
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Mutations
  const updateProfileMutation = useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
      setIsEditMode(false);
      toast.success("Thông tin cá nhân đã được cập nhật thành công");
    },
    onError: (error) => {
      toast.error("Lỗi cập nhật thông tin cá nhân: " + (error?.message || "Vui lòng thử lại"));
    }
  });
  
  const changePasswordMutation = useMutation({
    mutationFn: profileApi.changePassword,
    onSuccess: () => {
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      toast.success("Mật khẩu đã được thay đổi thành công");
    },
    onError: (error) => {
      toast.error("Lỗi thay đổi mật khẩu: " + (error?.message || "Vui lòng thử lại"));
    }
  });
  
  const uploadAvatarMutation = useMutation({
    mutationFn: profileApi.uploadAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
      toast.success("Ảnh đại diện đã được cập nhật thành công");
    },
    onError: (error) => {
      toast.error("Lỗi cập nhật ảnh đại diện: " + (error?.message || "Vui lòng thử lại"));
    }
  });

  // Submit handlers
  const handleUpdateProfile = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate(profileData);
  };
  
  const handleChangePassword = (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp");
      return;
    }
    
    changePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    });
  };
  
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.includes('image/')) {
      toast.error("Vui lòng chọn tệp hình ảnh");
      return;
    }
    
    const formData = new FormData();
    formData.append('avatar', file);
    uploadAvatarMutation.mutate(formData);
  };

  // Loading state
  if (isProfileLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Tài khoản của tôi</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="mb-6 flex flex-col items-center">
              <div className="relative mb-3 group">
                <Avatar className="w-24 h-24 border-2 border-white shadow">
                  <AvatarImage src={userProfile?.avatar} />
                  <AvatarFallback className="bg-indigo-100 text-indigo-800 text-xl">
                    {userProfile?.fullName?.charAt(0) || userProfile?.username?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <label 
                  htmlFor="avatar-upload" 
                  className="absolute bottom-0 right-0 bg-indigo-600 rounded-full p-2 cursor-pointer group-hover:bg-indigo-700"
                >
                  <Camera className="h-4 w-4 text-white" />
                  <input 
                    id="avatar-upload" 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleAvatarUpload}
                  />
                </label>
              </div>
              <h2 className="text-xl font-semibold">{userProfile?.fullName || userProfile?.username}</h2>
              <p className="text-gray-500">{userProfile?.email}</p>
            </div>
            
            <Card>
              <CardContent className="p-4">
                <ul className="space-y-1">
                  <li className="py-2 px-3 bg-gray-100 font-medium rounded">
                    Thông tin tài khoản
                  </li>
                  <li className="py-2 px-3 hover:bg-gray-50 transition-colors rounded">
                    <a href="/my-bookings">Lịch hẹn của tôi</a>
                  </li>
                  <li className="py-2 px-3 hover:bg-gray-50 transition-colors rounded">
                    <a href="#" onClick={() => authService.logout()}>Đăng xuất</a>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="profile">
              <TabsList className="mb-6">
                <TabsTrigger value="profile">Thông tin cá nhân</TabsTrigger>
                <TabsTrigger value="password">Thay đổi mật khẩu</TabsTrigger>
                <TabsTrigger value="bookings">Lịch hẹn gần đây</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin cá nhân</CardTitle>
                    <CardDescription>
                      Quản lý thông tin cá nhân của bạn và cập nhật khi cần thiết
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdateProfile}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Họ và tên</Label>
                          <Input 
                            id="fullName" 
                            name="fullName" 
                            value={profileData.fullName} 
                            onChange={handleProfileChange}
                            disabled={!isEditMode}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            name="email" 
                            type="email" 
                            value={profileData.email} 
                            disabled
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <Label htmlFor="phoneNumber">Số điện thoại</Label>
                          <Input 
                            id="phoneNumber" 
                            name="phoneNumber" 
                            value={profileData.phoneNumber} 
                            onChange={handleProfileChange}
                            disabled={!isEditMode}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                          <Input 
                            id="dateOfBirth" 
                            name="dateOfBirth" 
                            type="date" 
                            value={profileData.dateOfBirth} 
                            onChange={handleProfileChange}
                            disabled={!isEditMode}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <Label htmlFor="address">Địa chỉ</Label>
                        <Textarea 
                          id="address" 
                          name="address" 
                          value={profileData.address} 
                          onChange={handleProfileChange}
                          disabled={!isEditMode}
                          rows={3}
                        />
                      </div>
                      
                      {isEditMode ? (
                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={() => setIsEditMode(false)}>
                            Hủy
                          </Button>
                          <Button type="submit" disabled={updateProfileMutation.isPending}>
                            {updateProfileMutation.isPending && <Spinner className="mr-2" size="sm" />}
                            Lưu thay đổi
                          </Button>
                        </div>
                      ) : (
                        <Button type="button" onClick={() => setIsEditMode(true)}>
                          Chỉnh sửa thông tin
                        </Button>
                      )}
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="password">
                <Card>
                  <CardHeader>
                    <CardTitle>Thay đổi mật khẩu</CardTitle>
                    <CardDescription>
                      Cập nhật mật khẩu của bạn để bảo mật tài khoản
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleChangePassword}>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                          <div className="relative">
                            <Input 
                              id="currentPassword" 
                              name="currentPassword" 
                              type={showPassword ? "text" : "password"} 
                              value={passwordData.currentPassword} 
                              onChange={handlePasswordChange}
                            />
                            <button 
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">Mật khẩu mới</Label>
                          <div className="relative">
                            <Input 
                              id="newPassword" 
                              name="newPassword" 
                              type={showPassword ? "text" : "password"} 
                              value={passwordData.newPassword} 
                              onChange={handlePasswordChange}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                          <div className="relative">
                            <Input 
                              id="confirmPassword" 
                              name="confirmPassword" 
                              type={showPassword ? "text" : "password"} 
                              value={passwordData.confirmPassword} 
                              onChange={handlePasswordChange}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end mt-6">
                        <Button type="submit" disabled={changePasswordMutation.isPending}>
                          {changePasswordMutation.isPending && <Spinner className="mr-2" size="sm" />}
                          Cập nhật mật khẩu
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="bookings">
                <Card>
                  <CardHeader>
                    <CardTitle>Lịch hẹn gần đây</CardTitle>
                    <CardDescription>
                      Quản lý các lịch hẹn của bạn
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isBookingsLoading ? (
                      <div className="flex justify-center py-6">
                        <Spinner size="lg" />
                      </div>
                    ) : userBookings && userBookings.length > 0 ? (
                      <div className="space-y-4">
                        {userBookings.slice(0, 3).map(booking => (
                          <div key={booking.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold">{booking.services.map(s => s.name).join(", ")}</h3>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                                booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {booking.status === 'CONFIRMED' ? 'Đã xác nhận' :
                                 booking.status === 'PENDING' ? 'Đang chờ' :
                                 booking.status === 'CANCELLED' ? 'Đã hủy' : 
                                 booking.status}
                              </span>
                            </div>
                            
                            <div className="text-gray-600 text-sm space-y-1">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                <span>
                                  {format(new Date(booking.appointmentTime), 'EEEE, dd MMMM, yyyy', { locale: vi })}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2" />
                                <span>{format(new Date(booking.appointmentTime), 'HH:mm')}</span>
                              </div>
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-2" />
                                <span>{booking.specialist?.fullName || 'Chưa có chuyên gia'}</span>
                              </div>
                              {booking.location && (
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-2" />
                                  <span>{booking.location}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        
                        <div className="pt-4 text-center">
                          <Button asChild variant="outline">
                            <a href="/my-bookings">Xem tất cả lịch hẹn</a>
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="mb-4 text-gray-600">Bạn chưa có lịch hẹn nào</p>
                        <Button asChild>
                          <a href="/booking">Đặt lịch ngay</a>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default UserDashboard;
