
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { specialistApi, serviceApi, bookingApi } from "@/services/api";
import MainLayout from "@/components/layout/MainLayout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Clock } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  specialistId: z.string(),
  serviceId: z.string(),
  bookingDate: z.date(),
  bookingTime: z.string(),
  notes: z.string().optional(),
  paymentMethod: z.enum(["CREDIT_CARD", "CASH", "BANK_TRANSFER"]),
});

type BookingFormValues = z.infer<typeof formSchema>;

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const preselectedData = location.state || {};
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch specialists
  const { data: specialists, isLoading: specialistsLoading } = useQuery({
    queryKey: ["specialists"],
    queryFn: () => specialistApi.getAll(),
  });

  // Fetch services
  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ["services"],
    queryFn: () => serviceApi.getAll(true),
  });

  // Form setup with default values from navigation state
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      specialistId: preselectedData.specialistId?.toString() || "",
      serviceId: preselectedData.serviceId?.toString() || "",
      bookingDate: preselectedData.date ? new Date(preselectedData.date) : new Date(),
      bookingTime: "",
      notes: "",
      paymentMethod: "CREDIT_CARD",
    },
  });

  // Fetch selected specialist's schedule
  const selectedSpecialistId = form.watch("specialistId");
  const { data: specialistSchedules } = useQuery({
    queryKey: ["specialist", selectedSpecialistId, "schedules"],
    queryFn: () => specialistApi.getSchedule(Number(selectedSpecialistId)),
    enabled: !!selectedSpecialistId,
  });

  // Find the selected service
  const selectedServiceId = form.watch("serviceId");
  const selectedService = services?.find(service => service.id.toString() === selectedServiceId);

  // Calculate available time slots based on specialist schedule
  const selectedDate = form.watch("bookingDate");
  const dayOfWeek = selectedDate?.getDay();
  const availableSchedule = specialistSchedules?.find(schedule => 
    schedule.dayOfWeek === ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"][dayOfWeek || 0]
  );

  // Create time slots if schedule is available
  const timeSlots = [];
  if (availableSchedule?.isAvailable && availableSchedule.startTime && availableSchedule.endTime) {
    const startHour = parseInt(availableSchedule.startTime.split(':')[0]);
    const endHour = parseInt(availableSchedule.endTime.split(':')[0]);
    
    for (let hour = startHour; hour < endHour; hour++) {
      timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < endHour - 1) { // Don't add 30 minutes to the last hour
        timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
  }

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: (bookingData: any) => bookingApi.createBooking(bookingData),
    onSuccess: () => {
      toast.success("Booking created successfully!");
      navigate("/my-bookings");
    },
    onError: (error) => {
      toast.error("Failed to create booking. Please try again.");
      setIsSubmitting(false);
    }
  });

  const onSubmit = (data: BookingFormValues) => {
    setIsSubmitting(true);
    
    // Combine date and time
    const [hours, minutes] = data.bookingTime.split(':');
    const bookingDateTime = new Date(data.bookingDate);
    bookingDateTime.setHours(parseInt(hours), parseInt(minutes), 0);
    
    // Prepare booking data
    const bookingData = {
      specialistId: parseInt(data.specialistId),
      bookingDateTime: bookingDateTime.toISOString(),
      paymentMethod: data.paymentMethod,
      notes: data.notes,
      bookingDetails: [
        {
          serviceId: parseInt(data.serviceId)
        }
      ]
    };
    
    createBookingMutation.mutate(bookingData);
  };

  if (specialistsLoading || servicesLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Spinner />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Book an Appointment</h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Details</CardTitle>
                <CardDescription>
                  Fill in the details to book your skincare session
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="specialistId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Specialist</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a specialist" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {specialists?.map((specialist) => (
                                  <SelectItem 
                                    key={specialist.id} 
                                    value={specialist.id.toString()}
                                  >
                                    {specialist.user.fullName} - {specialist.specialization}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="serviceId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Service</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a service" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {services?.map((service) => (
                                  <SelectItem 
                                    key={service.id} 
                                    value={service.id.toString()}
                                  >
                                    {service.name} - ${service.price}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="bookingDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date < new Date()}
                                  initialFocus
                                  className="p-3 pointer-events-auto"
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bookingTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Time</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a time" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {timeSlots.length > 0 ? (
                                  timeSlots.map((time) => (
                                    <SelectItem key={time} value={time}>
                                      {time}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <SelectItem value="unavailable" disabled>
                                    No available times
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Please select a specialist and date first to see available times
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Method</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select payment method" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="CREDIT_CARD">Credit Card</SelectItem>
                              <SelectItem value="CASH">Cash</SelectItem>
                              <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Special Requests or Notes</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Any special requests or information for your appointment"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" disabled={isSubmitting} className="w-full">
                      {isSubmitting ? <Spinner size="sm" className="mr-2" /> : null}
                      Confirm Booking
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedSpecialistId && specialists && (
                    <div>
                      <h3 className="text-sm font-medium">Specialist</h3>
                      <p className="text-sm">
                        {specialists.find(s => s.id.toString() === selectedSpecialistId)?.user.fullName}
                      </p>
                    </div>
                  )}

                  {selectedServiceId && services && (
                    <div>
                      <h3 className="text-sm font-medium">Service</h3>
                      <p className="text-sm">
                        {selectedService?.name}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {selectedService?.durationMinutes} mins
                      </div>
                    </div>
                  )}

                  {selectedDate && (
                    <div>
                      <h3 className="text-sm font-medium">Date</h3>
                      <p className="text-sm">{format(selectedDate, "PPP")}</p>
                    </div>
                  )}

                  <Separator />

                  {selectedService && (
                    <div className="pt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total</span>
                        <span className="font-bold">${selectedService.price}</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex-col space-y-2 text-sm text-gray-500">
                <p>Your booking will be confirmed upon successful payment.</p>
                <p>Cancellation policy: Free cancellation up to 24 hours before your appointment.</p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default BookingPage;
