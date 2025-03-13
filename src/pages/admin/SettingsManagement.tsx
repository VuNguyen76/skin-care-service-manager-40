
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

const SettingsManagement = () => {
  const { isLoading: authLoading, isAdmin } = useAdminAuth();
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`${settingsType} settings saved successfully`);
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error(`Failed to save ${settingsType.toLowerCase()} settings`);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
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
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your application settings and configurations</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="booking">Booking</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your site's basic information and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    name="siteName"
                    value={generalSettings.siteName}
                    onChange={handleGeneralSettingsChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
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
                <Label htmlFor="siteDescription">Site Description</Label>
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
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    value={generalSettings.contactPhone}
                    onChange={handleGeneralSettingsChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
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
              <Button variant="outline" onClick={() => toast.info("Settings reset to default values")}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset to Default
              </Button>
              <Button onClick={() => handleSaveSettings("General")} disabled={loading}>
                {loading && <Spinner className="mr-2" size="sm" />}
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="booking">
          <Card>
            <CardHeader>
              <CardTitle>Booking Settings</CardTitle>
              <CardDescription>Configure how bookings work in your application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="allowFutureBookingsDays">Allow Future Bookings (days)</Label>
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
                      <span className="text-sm text-muted-foreground">days</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      How far in advance customers can book appointments.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="minAdvanceBookingHours">Minimum Booking Notice</Label>
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
                      <span className="text-sm text-muted-foreground">hours</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Minimum hours in advance customers must book.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxServicesPerBooking">Maximum Services Per Booking</Label>
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
                      Maximum number of services allowed in a single booking.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="workingHoursStart">Working Hours (Start)</Label>
                    <Input
                      id="workingHoursStart"
                      name="workingHoursStart"
                      type="time"
                      value={bookingSettings.workingHoursStart}
                      onChange={handleBookingSettingsChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="workingHoursEnd">Working Hours (End)</Label>
                    <Input
                      id="workingHoursEnd"
                      name="workingHoursEnd"
                      type="time"
                      value={bookingSettings.workingHoursEnd}
                      onChange={handleBookingSettingsChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="allowCancellationHours">Cancellation Policy</Label>
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
                      <span className="text-sm text-muted-foreground">hours</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      How many hours before the appointment customers can cancel.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium mb-4">Booking Requirements</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="requiresPayment">Require Payment</Label>
                      <p className="text-sm text-muted-foreground">
                        Require payment at the time of booking
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
                      <Label htmlFor="requiresConfirmation">Require Confirmation</Label>
                      <p className="text-sm text-muted-foreground">
                        Bookings require admin confirmation before they're finalized
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
              <Button variant="outline" onClick={() => toast.info("Settings reset to default values")}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset to Default
              </Button>
              <Button onClick={() => handleSaveSettings("Booking")} disabled={loading}>
                {loading && <Spinner className="mr-2" size="sm" />}
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure email notifications for your business and customers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sendBookingConfirmations">Booking Confirmations</Label>
                    <p className="text-sm text-muted-foreground">
                      Send confirmation emails after a booking is made
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
                    <Label htmlFor="sendBookingReminders">Booking Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Send reminder emails before appointments
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
                    <Label htmlFor="reminderHoursBefore">Reminder Time</Label>
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
                      <span className="text-sm text-muted-foreground">hours before appointment</span>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sendCancellationNotifications">Cancellation Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send notifications when bookings are cancelled
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
                    <Label htmlFor="sendAdminNotifications">Admin Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send notifications to admin for new bookings and changes
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
                    <Label htmlFor="adminNotificationEmail">Admin Email</Label>
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
                  These notification settings require a properly configured email service to work. Make sure your email service is set up correctly.
                </p>
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <Button variant="outline" onClick={() => toast.info("Settings reset to default values")}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset to Default
              </Button>
              <Button onClick={() => handleSaveSettings("Notification")} disabled={loading}>
                {loading && <Spinner className="mr-2" size="sm" />}
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsManagement;
