
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "@/services/api";
import authService from "@/services/authService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import MainLayout from "@/components/layout/MainLayout";
import { Spinner } from "@/components/ui/spinner";
import { useForm } from "react-hook-form";

interface ProfileFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const UserDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("profile");

  // Get user profile
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["userProfile"],
    queryFn: profileApi.getUserProfile,
  });

  // Setup forms
  const profileForm = useForm<ProfileFormData>({
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      address: "",
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Update form when data is loaded
  React.useEffect(() => {
    if (user) {
      profileForm.reset({
        fullName: user.fullName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
      });
    }
  }, [user, profileForm]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      toast.success("Cập nhật thông tin thành công");
    },
    onError: (error: any) => {
      toast.error(`Lỗi khi cập nhật: ${error.message}`);
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: profileApi.changePassword,
    onSuccess: () => {
      passwordForm.reset();
      toast.success("Đổi mật khẩu thành công");
    },
    onError: (error: any) => {
      toast.error(`Lỗi khi đổi mật khẩu: ${error.message}`);
    },
  });

  const onProfileSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  const onPasswordSubmit = (data: PasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Mật khẩu mới không khớp");
      return;
    }

    changePasswordMutation.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Đã xảy ra lỗi</h1>
          <p className="text-gray-600 mb-6">
            Không thể tải thông tin tài khoản. Vui lòng thử lại sau.
          </p>
          <Button onClick={() => navigate("/")}>Quay lại trang chủ</Button>
        </div>
      </MainLayout>
    );
  }

  if (!authService.isAuthenticated()) {
    return (
      <MainLayout>
        <div className="container p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Bạn chưa đăng nhập</h1>
          <p className="text-gray-600 mb-6">
            Vui lòng đăng nhập để xem thông tin tài khoản.
          </p>
          <Button onClick={() => navigate("/login")}>Đăng nhập</Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container p-6">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-3/12 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tài khoản của tôi</CardTitle>
                <CardDescription>Quản lý thông tin cá nhân</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 flex items-center justify-center overflow-hidden">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl text-gray-500">
                      {user?.fullName?.charAt(0) || "U"}
                    </span>
                  )}
                </div>
                <h3 className="font-medium text-lg">{user?.fullName}</h3>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <p className="text-sm text-gray-500">{user?.phoneNumber}</p>
                <p className="text-sm text-gray-500">{user?.address}</p>

                <Separator className="my-4" />
                
                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={handleLogout}
                >
                  Đăng xuất
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="w-full md:w-9/12">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">Thông tin cá nhân</TabsTrigger>
                <TabsTrigger value="password">Đổi mật khẩu</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin cá nhân</CardTitle>
                    <CardDescription>
                      Cập nhật thông tin cá nhân của bạn
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form
                      onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Họ và tên</Label>
                        <Input
                          id="fullName"
                          {...profileForm.register("fullName")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          {...profileForm.register("email")}
                          disabled
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Số điện thoại</Label>
                        <Input
                          id="phoneNumber"
                          {...profileForm.register("phoneNumber")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Địa chỉ</Label>
                        <Input
                          id="address"
                          {...profileForm.register("address")}
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button type="submit">Lưu thay đổi</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="password" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Đổi mật khẩu</CardTitle>
                    <CardDescription>
                      Thay đổi mật khẩu đăng nhập của bạn
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form
                      onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          {...passwordForm.register("currentPassword")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">Mật khẩu mới</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          {...passwordForm.register("newPassword")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          {...passwordForm.register("confirmPassword")}
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button type="submit">Đổi mật khẩu</Button>
                      </div>
                    </form>
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
