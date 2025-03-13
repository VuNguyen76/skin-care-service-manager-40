
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import MainLayout from "@/components/layout/MainLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { userApi } from "@/services/api";
import { Spinner } from "@/components/ui/spinner";

const UserDashboard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  // Get user profile
  const { data: userProfile, isLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: userApi.getUserProfile,
    // Remove the onError property as it's not supported in this version
  });

  // Profile Update Form
  const profileFormSchema = z.object({
    fullName: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    phone: z.string().optional(),
    address: z.string().optional(),
  });

  const profileForm = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  // Update form values when user profile is loaded
  React.useEffect(() => {
    if (userProfile) {
      profileForm.reset({
        fullName: userProfile.fullName || "",
        email: userProfile.email || "",
        phone: userProfile.phone || "",
        address: userProfile.address || "",
      });
    }
  }, [userProfile, profileForm]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: userApi.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      setIsEditing(false);
      toast.success("Cập nhật thông tin thành công");
    },
    onError: (error) => {
      toast.error("Cập nhật thông tin thất bại: " + error.message);
    },
  });

  const onProfileSubmit = (data) => {
    updateProfileMutation.mutate(data);
  };

  // Password Change Form
  const passwordFormSchema = z
    .object({
      currentPassword: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
      newPassword: z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
      confirmPassword: z.string().min(6, "Xác nhận mật khẩu phải có ít nhất 6 ký tự"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Mật khẩu không khớp",
      path: ["confirmPassword"],
    });

  const passwordForm = useForm({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: userApi.changePassword,
    onSuccess: () => {
      passwordForm.reset();
      toast.success("Đổi mật khẩu thành công");
    },
    onError: (error) => {
      toast.error("Đổi mật khẩu thất bại: " + error.message);
    },
  });

  const onPasswordSubmit = (data) => {
    changePasswordMutation.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container max-w-4xl py-10 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container max-w-4xl py-10">
        <h1 className="text-3xl font-bold mb-8">Quản lý tài khoản</h1>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Thông tin cá nhân</TabsTrigger>
            <TabsTrigger value="security">Bảo mật</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cá nhân</CardTitle>
                <CardDescription>
                  Quản lý thông tin cá nhân của bạn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Họ và tên</Label>
                        <Input
                          id="fullName"
                          disabled={!isEditing}
                          {...profileForm.register("fullName")}
                        />
                        {profileForm.formState.errors.fullName && (
                          <p className="text-red-500 text-sm">
                            {profileForm.formState.errors.fullName.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          disabled={!isEditing}
                          {...profileForm.register("email")}
                        />
                        {profileForm.formState.errors.email && (
                          <p className="text-red-500 text-sm">
                            {profileForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Số điện thoại</Label>
                        <Input
                          id="phone"
                          disabled={!isEditing}
                          {...profileForm.register("phone")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Địa chỉ</Label>
                        <Input
                          id="address"
                          disabled={!isEditing}
                          {...profileForm.register("address")}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      {!isEditing ? (
                        <Button
                          type="button"
                          onClick={() => setIsEditing(true)}
                        >
                          Chỉnh sửa
                        </Button>
                      ) : (
                        <>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setIsEditing(false);
                              profileForm.reset({
                                fullName: userProfile.fullName || "",
                                email: userProfile.email || "",
                                phone: userProfile.phone || "",
                                address: userProfile.address || "",
                              });
                            }}
                          >
                            Hủy
                          </Button>
                          <Button type="submit">Lưu thay đổi</Button>
                        </>
                      )}
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Bảo mật</CardTitle>
                <CardDescription>
                  Thay đổi mật khẩu để bảo vệ tài khoản
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        {...passwordForm.register("currentPassword")}
                      />
                      {passwordForm.formState.errors.currentPassword && (
                        <p className="text-red-500 text-sm">
                          {
                            passwordForm.formState.errors.currentPassword
                              .message
                          }
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Mật khẩu mới</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        {...passwordForm.register("newPassword")}
                      />
                      {passwordForm.formState.errors.newPassword && (
                        <p className="text-red-500 text-sm">
                          {passwordForm.formState.errors.newPassword.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Xác nhận mật khẩu mới
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        {...passwordForm.register("confirmPassword")}
                      />
                      {passwordForm.formState.errors.confirmPassword && (
                        <p className="text-red-500 text-sm">
                          {
                            passwordForm.formState.errors.confirmPassword
                              .message
                          }
                        </p>
                      )}
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit">Đổi mật khẩu</Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default UserDashboard;
