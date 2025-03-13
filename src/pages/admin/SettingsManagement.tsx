
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { settingsApi } from "@/services/api";
import { Spinner } from "@/components/ui/spinner";

const SettingsManagement = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("general");

  // Get settings
  const {
    data: generalSettings,
    isLoading: isLoadingGeneral,
    error: generalError,
  } = useQuery({
    queryKey: ["settings", "general"],
    queryFn: () => settingsApi.getGeneralSettings(),
  });

  const {
    data: contactSettings,
    isLoading: isLoadingContact,
    error: contactError,
  } = useQuery({
    queryKey: ["settings", "contact"],
    queryFn: () => settingsApi.getContactSettings(),
  });

  const {
    data: socialSettings,
    isLoading: isLoadingSocial,
    error: socialError,
  } = useQuery({
    queryKey: ["settings", "social"],
    queryFn: () => settingsApi.getSocialSettings(),
  });

  // Setting up forms
  const generalForm = useForm({
    defaultValues: {
      siteName: "",
      siteDescription: "",
      footerText: "",
      copyright: "",
    },
  });

  const contactForm = useForm({
    defaultValues: {
      address: "",
      phone: "",
      email: "",
      workingHours: "",
    },
  });

  const socialForm = useForm({
    defaultValues: {
      facebook: "",
      instagram: "",
      twitter: "",
      youtube: "",
    },
  });

  // Update forms when data is loaded
  React.useEffect(() => {
    if (generalSettings) {
      generalForm.reset({
        siteName: generalSettings.siteName || "",
        siteDescription: generalSettings.siteDescription || "",
        footerText: generalSettings.footerText || "",
        copyright: generalSettings.copyright || "",
      });
    }
  }, [generalSettings, generalForm]);

  React.useEffect(() => {
    if (contactSettings) {
      contactForm.reset({
        address: contactSettings.address || "",
        phone: contactSettings.phone || "",
        email: contactSettings.email || "",
        workingHours: contactSettings.workingHours || "",
      });
    }
  }, [contactSettings, contactForm]);

  React.useEffect(() => {
    if (socialSettings) {
      socialForm.reset({
        facebook: socialSettings.facebook || "",
        instagram: socialSettings.instagram || "",
        twitter: socialSettings.twitter || "",
        youtube: socialSettings.youtube || "",
      });
    }
  }, [socialSettings, socialForm]);

  // Update settings mutations
  const updateSettingsMutation = useMutation({
    mutationFn: settingsApi.updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Cài đặt đã được cập nhật");
    },
    onError: (error: any) => {
      toast.error("Lỗi khi cập nhật cài đặt: " + error.message);
    },
  });

  const onGeneralSubmit = (data: any) => {
    updateSettingsMutation.mutate({
      category: "general",
      settings: data,
    });
  };

  const onContactSubmit = (data: any) => {
    updateSettingsMutation.mutate({
      category: "contact",
      settings: data,
    });
  };

  const onSocialSubmit = (data: any) => {
    updateSettingsMutation.mutate({
      category: "social",
      settings: data,
    });
  };

  const isLoading = isLoadingGeneral || isLoadingContact || isLoadingSocial;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  const error = generalError || contactError || socialError;
  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Lỗi khi tải cài đặt: {(error as Error).message}</p>
        <Button
          className="mt-4"
          onClick={() => {
            queryClient.invalidateQueries({ queryKey: ["settings"] });
          }}
        >
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="container p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Quản lý cài đặt</h1>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">Cài đặt chung</TabsTrigger>
          <TabsTrigger value="contact">Thông tin liên hệ</TabsTrigger>
          <TabsTrigger value="social">Mạng xã hội</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt chung</CardTitle>
              <CardDescription>
                Quản lý các cài đặt cơ bản của trang web
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={generalForm.handleSubmit(onGeneralSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="siteName">Tên trang web</Label>
                  <Input
                    id="siteName"
                    {...generalForm.register("siteName")}
                    placeholder="BEAUTYCARE"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Mô tả trang web</Label>
                  <Textarea
                    id="siteDescription"
                    {...generalForm.register("siteDescription")}
                    placeholder="Chăm sóc da chuyên nghiệp"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="footerText">Văn bản chân trang</Label>
                  <Textarea
                    id="footerText"
                    {...generalForm.register("footerText")}
                    placeholder="BEAUTYCARE cung cấp các dịch vụ chăm sóc da chuyên nghiệp."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="copyright">Bản quyền</Label>
                  <Input
                    id="copyright"
                    {...generalForm.register("copyright")}
                    placeholder="© 2023 BEAUTYCARE. Đã đăng ký Bản quyền."
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit">Lưu thay đổi</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin liên hệ</CardTitle>
              <CardDescription>
                Quản lý thông tin liên hệ hiển thị trên trang web
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={contactForm.handleSubmit(onContactSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ</Label>
                  <Input
                    id="address"
                    {...contactForm.register("address")}
                    placeholder="123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    id="phone"
                    {...contactForm.register("phone")}
                    placeholder="+84 123 456 789"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...contactForm.register("email")}
                    placeholder="contact@beautycare.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workingHours">Giờ làm việc</Label>
                  <Input
                    id="workingHours"
                    {...contactForm.register("workingHours")}
                    placeholder="Thứ 2 - Thứ 7: 9:00 - 18:00"
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit">Lưu thay đổi</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Mạng xã hội</CardTitle>
              <CardDescription>
                Quản lý liên kết mạng xã hội của trang web
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={socialForm.handleSubmit(onSocialSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    {...socialForm.register("facebook")}
                    placeholder="https://facebook.com/beautycare"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    {...socialForm.register("instagram")}
                    placeholder="https://instagram.com/beautycare"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    {...socialForm.register("twitter")}
                    placeholder="https://twitter.com/beautycare"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtube">YouTube</Label>
                  <Input
                    id="youtube"
                    {...socialForm.register("youtube")}
                    placeholder="https://youtube.com/beautycare"
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit">Lưu thay đổi</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsManagement;
