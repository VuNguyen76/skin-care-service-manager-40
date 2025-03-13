
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { toast } from "sonner";
import { Save, RefreshCw, Info } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsApi } from "@/services/api";

const SettingsManagement = () => {
  const { isLoading: authLoading, isAdmin } = useAdminAuth();
  const queryClient = useQueryClient();
  
  // Fetch general settings
  const { 
    data: generalSettingsData, 
    isLoading: isGeneralLoading 
  } = useQuery({
    queryKey: ["settings", "general"],
    queryFn: settingsApi.getGeneralSettings
  });
  
  // Fetch booking settings
  const { 
    data: bookingSettingsData, 
    isLoading: isBookingLoading 
  } = useQuery({
    queryKey: ["settings", "booking"],
    queryFn: settingsApi.getBookingSettings
  });
  
  // Fetch notification settings
  const { 
    data: notificationSettingsData, 
    isLoading: isNotificationLoading 
  } = useQuery({
    queryKey: ["settings", "notifications"],
    queryFn: settingsApi.getNotificationSettings
  });
  
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Skincare Specialist",
    siteDescription: "Your trusted partner for skincare services and consultations",
    contactEmail: "contact@skincarespecialist.com",
    contactPhone: "+1 (555) 123-4567",
    address: "123 Beauty Street, Skincare City, SC 12345"
  });
  
  const [bookingSettings, setBookingSettings] = useState({
    allowFutureBookingsDays: 30,
    minAdvanceBookingHours: 24,
    maxServicesPerBooking: 3,
    requiresPayment: true,
    requiresConfirmation: true,
    allowCancellationHours: 48,
    workingHoursStart: "09:00",
    workingHoursEnd: "18:00"
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    sendBookingConfirmations: true,
    sendBookingReminders: true,
    reminderHoursBefore: 24,
    sendCancellationNotifications: true,
    sendAdminNotifications: true,
    adminNotificationEmail: "admin@skincarespecialist.com"
  });

  // Update state when data is fetched
  useState(() => {
    if (generalSettingsData) {
      setGeneralSettings(generalSettingsData);
    }
  }, [generalSettingsData]);
  
  useState(() => {
    if (bookingSettingsData) {
      setBookingSettings(bookingSettingsData);
    }
  }, [bookingSettingsData]);
  
  useState(() => {
    if (notificationSettingsData) {
      setNotificationSettings(notificationSettingsData);
    }
  }, [notificationSettingsData]);

  // Mutations for updating settings
  const generalSettingsMutation = useMutation({
    mutationFn: settingsApi.updateGeneralSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "general"] });
      toast.success("Cài đặt chung đã được lưu thành công");
    },
    onError: () => {
      toast.error("Lỗi khi lưu cài đặt chung");
    }
  });
  
  const bookingSettingsMutation = useMutation({
    mutationFn: settingsApi.updateBookingSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "booking"] });
      toast.success("Cài đặt đặt lịch đã được lưu thành công");
    },
    onError: () => {
      toast.error("Lỗi khi lưu cài đặt đặt lịch");
    }
  });
  
  const notificationSettingsMutation = useMutation({
    mutationFn: settingsApi.updateNotificationSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "notifications"] });
      toast.success("Cài đặt thông báo đã được lưu thành công");
    },
    onError: () => {
      toast.error("Lỗi khi lưu cài đặt thông báo");
    }
  });

  const handleGeneralSettingsChange = (e) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleBookingSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBookingSettings(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };
  
  const handleBookingSwitchChange = (name, checked) => {
    setBookingSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleNotificationSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNotificationSettings(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };
  
  const handleNotificationSwitchChange = (name, checked) => {
    setNotificationSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSaveSettings = async (settingsType) => {
    if (settingsType === "General") {
      generalSettingsMutation.mutate(generalSettings);
    } else if (settingsType === "Booking") {
      bookingSettingsMutation.mutate(bookingSettings);
    } else if (settingsType === "Notification") {
      notificationSettingsMutation.mutate(notificationSettings);
    }
  };

  if (authLoading || isGeneralLoading || isBookingLoading || isNotificationLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAdmin) {
    return null; // The hook will redirect
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cài đặt hệ thống</h1>
        <p className="text-muted-foreground">Quản lý cài đặt và cấu hình ứng dụng của bạn</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Cài đặt chung</TabsTrigger>
          <TabsTrigger value="booking">Đặt lịch</TabsTrigger>
          <TabsTrigger value="notifications">Thông báo</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt chung</CardTitle>
              <CardDescription>Quản lý thông tin cơ bản và thông tin liên hệ của trang web</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Tên trang web</Label>
                  <Input
                    id="siteName"
                    name="siteName"
                    value={generalSettings.siteName}
                    onChange={handleGeneralSettingsChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email liên hệ</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={generalSettings.contactEmail}
                    onChange={handleGeneralSettingsChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Mô tả trang web</Label>
                <Textarea
                  id="siteDescription"
                  name="siteDescription"
                  value={generalSettings.siteDescription}
                  onChange={handleGeneralSettingsChange}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Số điện thoại liên hệ</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    value={generalSettings.contactPhone}
                    onChange={handleGeneralSettingsChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={generalSettings.address}
                  onChange={handleGeneralSettingsChange}
                  rows={2}
                />
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <Button variant="outline" onClick={() => toast.info("Đã đặt lại cài đặt về giá trị mặc định")}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Đặt lại mặc định
              </Button>
              <Button 
                onClick={() => handleSaveSettings("General")} 
                disabled={generalSettingsMutation.isPending}
              >
                {generalSettingsMutation.isPending && <Spinner className="mr-2" size="sm" />}
                <Save className="mr-2 h-4 w-4" />
                Lưu thay đổi
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="booking">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt đặt lịch</CardTitle>
              <CardDescription>Cấu hình cách thức hoạt động của việc đặt lịch trong ứng dụng</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="allowFutureBookingsDays">Cho phép đặt lịch trước (ngày)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="allowFutureBookingsDays"
                        name="allowFutureBookingsDays"
                        type="number"
                        min="1"
                        max="365"
                        value={bookingSettings.allowFutureBookingsDays}
                        onChange={handleBookingSettingsChange}
                      />
                      <span className="text-sm text-muted-foreground">ngày</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Khách hàng có thể đặt lịch trước bao nhiêu ngày.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="minAdvanceBookingHours">Thời gian đặt trước tối thiểu</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="minAdvanceBookingHours"
                        name="minAdvanceBookingHours"
                        type="number"
                        min="0"
                        max="168"
                        value={bookingSettings.minAdvanceBookingHours}
                        onChange={handleBookingSettingsChange}
                      />
                      <span className="text-sm text-muted-foreground">giờ</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Khách hàng phải đặt lịch trước tối thiểu bao nhiêu giờ.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxServicesPerBooking">Số dịch vụ tối đa mỗi lần đặt lịch</Label>
                    <Input
                      id="maxServicesPerBooking"
                      name="maxServicesPerBooking"
                      type="number"
                      min="1"
                      max="10"
                      value={bookingSettings.maxServicesPerBooking}
                      onChange={handleBookingSettingsChange}
                    />
                    <p className="text-xs text-muted-foreground">
                      Số lượng dịch vụ tối đa được phép trong một lần đặt lịch.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="workingHoursStart">Giờ làm việc (Bắt đầu)</Label>
                    <Input
                      id="workingHoursStart"
                      name="workingHoursStart"
                      type="time"
                      value={bookingSettings.workingHoursStart}
                      onChange={handleBookingSettingsChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="workingHoursEnd">Giờ làm việc (Kết thúc)</Label>
                    <Input
                      id="workingHoursEnd"
                      name="workingHoursEnd"
                      type="time"
                      value={bookingSettings.workingHoursEnd}
                      onChange={handleBookingSettingsChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="allowCancellationHours">Chính sách hủy lịch</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="allowCancellationHours"
                        name="allowCancellationHours"
                        type="number"
                        min="0"
                        max="168"
                        value={bookingSettings.allowCancellationHours}
                        onChange={handleBookingSettingsChange}
                      />
                      <span className="text-sm text-muted-foreground">giờ</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Khách hàng có thể hủy lịch trước cuộc hẹn bao nhiêu giờ.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium mb-4">Yêu cầu đặt lịch</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="requiresPayment">Yêu cầu thanh toán</Label>
                      <p className="text-sm text-muted-foreground">
                        Yêu cầu thanh toán tại thời điểm đặt lịch
                      </p>
                    </div>
                    <Switch
                      id="requiresPayment"
                      checked={bookingSettings.requiresPayment}
                      onCheckedChange={(checked) => handleBookingSwitchChange("requiresPayment", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="requiresConfirmation">Yêu cầu xác nhận</Label>
                      <p className="text-sm text-muted-foreground">
                        Đặt lịch cần được xác nhận bởi quản trị viên trước khi hoàn tất
                      </p>
                    </div>
                    <Switch
                      id="requiresConfirmation"
                      checked={bookingSettings.requiresConfirmation}
                      onCheckedChange={(checked) => handleBookingSwitchChange("requiresConfirmation", checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <Button variant="outline" onClick={() => toast.info("Đã đặt lại cài đặt về giá trị mặc định")}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Đặt lại mặc định
              </Button>
              <Button 
                onClick={() => handleSaveSettings("Booking")} 
                disabled={bookingSettingsMutation.isPending}
              >
                {bookingSettingsMutation.isPending && <Spinner className="mr-2" size="sm" />}
                <Save className="mr-2 h-4 w-4" />
                Lưu thay đổi
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt thông báo</CardTitle>
              <CardDescription>Cấu hình thông báo email cho doanh nghiệp và khách hàng</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sendBookingConfirmations">Xác nhận đặt lịch</Label>
                    <p className="text-sm text-muted-foreground">
                      Gửi email xác nhận sau khi đặt lịch thành công
                    </p>
                  </div>
                  <Switch
                    id="sendBookingConfirmations"
                    checked={notificationSettings.sendBookingConfirmations}
                    onCheckedChange={(checked) => handleNotificationSwitchChange("sendBookingConfirmations", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sendBookingReminders">Nhắc nhở cuộc hẹn</Label>
                    <p className="text-sm text-muted-foreground">
                      Gửi email nhắc nhở trước cuộc hẹn
                    </p>
                  </div>
                  <Switch
                    id="sendBookingReminders"
                    checked={notificationSettings.sendBookingReminders}
                    onCheckedChange={(checked) => handleNotificationSwitchChange("sendBookingReminders", checked)}
                  />
                </div>
                
                {notificationSettings.sendBookingReminders && (
                  <div className="ml-8 space-y-2">
                    <Label htmlFor="reminderHoursBefore">Thời gian nhắc nhở</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="reminderHoursBefore"
                        name="reminderHoursBefore"
                        type="number"
                        min="1"
                        max="72"
                        value={notificationSettings.reminderHoursBefore}
                        onChange={handleNotificationSettingsChange}
                      />
                      <span className="text-sm text-muted-foreground">giờ trước cuộc hẹn</span>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sendCancellationNotifications">Thông báo hủy lịch</Label>
                    <p className="text-sm text-muted-foreground">
                      Gửi thông báo khi lịch hẹn bị hủy
                    </p>
                  </div>
                  <Switch
                    id="sendCancellationNotifications"
                    checked={notificationSettings.sendCancellationNotifications}
                    onCheckedChange={(checked) => handleNotificationSwitchChange("sendCancellationNotifications", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sendAdminNotifications">Thông báo cho quản trị viên</Label>
                    <p className="text-sm text-muted-foreground">
                      Gửi thông báo cho quản trị viên về đặt lịch mới và các thay đổi
                    </p>
                  </div>
                  <Switch
                    id="sendAdminNotifications"
                    checked={notificationSettings.sendAdminNotifications}
                    onCheckedChange={(checked) => handleNotificationSwitchChange("sendAdminNotifications", checked)}
                  />
                </div>
                
                {notificationSettings.sendAdminNotifications && (
                  <div className="ml-8 space-y-2">
                    <Label htmlFor="adminNotificationEmail">Email quản trị viên</Label>
                    <Input
                      id="adminNotificationEmail"
                      name="adminNotificationEmail"
                      type="email"
                      value={notificationSettings.adminNotificationEmail}
                      onChange={handleNotificationSettingsChange}
                    />
                  </div>
                )}
              </div>
              
              <div className="flex items-center p-4 border rounded-md bg-amber-50 text-amber-800">
                <Info className="h-5 w-5 mr-2 flex-shrink-0" />
                <p className="text-sm">
                  Các cài đặt thông báo này yêu cầu dịch vụ email được cấu hình đúng cách để hoạt động. Đảm bảo dịch vụ email của bạn được thiết lập chính xác.
                </p>
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <Button variant="outline" onClick={() => toast.info("Đã đặt lại cài đặt về giá trị mặc định")}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Đặt lại mặc định
              </Button>
              <Button 
                onClick={() => handleSaveSettings("Notification")} 
                disabled={notificationSettingsMutation.isPending}
              >
                {notificationSettingsMutation.isPending && <Spinner className="mr-2" size="sm" />}
                <Save className="mr-2 h-4 w-4" />
                Lưu thay đổi
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsManagement;
