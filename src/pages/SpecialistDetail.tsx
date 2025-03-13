
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { specialistApi, bookingApi, reviewApi } from "@/services/api";
import MainLayout from "@/components/layout/MainLayout";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Star, Calendar as CalendarIcon, Clock, Award, CheckCircle2 } from "lucide-react";

const SpecialistDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedService, setSelectedService] = useState<number | null>(null);

  // Fetch specialist data
  const { data: specialist, isLoading, error } = useQuery({
    queryKey: ["specialist", id],
    queryFn: () => specialistApi.getById(Number(id)),
  });

  // Fetch specialist schedules
  const { data: schedules } = useQuery({
    queryKey: ["specialist", id, "schedules"],
    queryFn: () => specialistApi.getSchedule(Number(id)),
    enabled: !!id,
  });

  // Fetch specialist reviews
  const { data: reviews } = useQuery({
    queryKey: ["specialist", id, "reviews"],
    queryFn: () => reviewApi.getBySpecialist(Number(id)),
    enabled: !!id,
  });

  const handleBooking = () => {
    if (!selectedService) {
      toast.error("Please select a service");
      return;
    }

    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }

    // Navigate to booking page with pre-filled data
    navigate(`/booking`, {
      state: {
        specialistId: id,
        serviceId: selectedService,
        date: selectedDate
      }
    });
  };

  if (isLoading) return (
    <MainLayout>
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner />
      </div>
    </MainLayout>
  );

  if (error || !specialist) return (
    <MainLayout>
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Specialist not found</h2>
        <p className="mt-2 text-gray-600">The specialist you're looking for doesn't exist or has been removed.</p>
        <Button 
          className="mt-4" 
          onClick={() => navigate('/specialists')}
        >
          Back to Specialists
        </Button>
      </div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Specialist Profile */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{specialist.user.fullName}</CardTitle>
                    <CardDescription>{specialist.specialization}</CardDescription>
                  </div>
                  {specialist.ratingAverage > 0 && (
                    <Badge className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      {specialist.ratingAverage.toFixed(1)}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">About</h3>
                    <p className="text-sm text-gray-600">{specialist.bio}</p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-2">Experience</h3>
                    <p className="text-sm text-gray-600">{specialist.experience}</p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-2">Certifications</h3>
                    <p className="text-sm text-gray-600">{specialist.certifications}</p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-2">Contact</h3>
                    <p className="text-sm text-gray-600">Email: {specialist.user.email}</p>
                    {specialist.user.phoneNumber && (
                      <p className="text-sm text-gray-600">Phone: {specialist.user.phoneNumber}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Services and Booking */}
          <div className="md:col-span-2">
            <Tabs defaultValue="services">
              <TabsList className="mb-6">
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="services" className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Available Services</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {specialist.services && specialist.services.map((service) => (
                    <Card 
                      key={service.id} 
                      className={`cursor-pointer transition ${selectedService === service.id ? 'ring-2 ring-primary' : ''}`}
                      onClick={() => setSelectedService(service.id)}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{service.name}</CardTitle>
                        <div className="flex justify-between items-center">
                          <CardDescription>${service.price}</CardDescription>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            {service.durationMinutes} mins
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <p className="text-sm text-gray-600">{service.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">Select a Date</h2>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border w-full pointer-events-auto"
                    disabled={(date) => date < new Date()}
                  />
                </div>

                <Button onClick={handleBooking} className="w-full mt-6">
                  Book Appointment
                </Button>
              </TabsContent>

              <TabsContent value="schedule">
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Schedule</CardTitle>
                    <CardDescription>Specialist's availability</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {schedules && schedules.length > 0 ? (
                      <div className="space-y-3">
                        {schedules.map((schedule) => (
                          <div key={schedule.id} className="flex justify-between items-center border-b pb-2">
                            <div className="font-medium">{schedule.dayOfWeek}</div>
                            <div className="text-sm">
                              {schedule.isAvailable ? (
                                <span>{schedule.startTime} - {schedule.endTime}</span>
                              ) : (
                                <span className="text-gray-500">Not available</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No schedule information available</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle>Client Reviews</CardTitle>
                    <CardDescription>
                      {specialist.ratingCount} reviews · {specialist.ratingAverage?.toFixed(1)} average rating
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {reviews && reviews.length > 0 ? (
                      <div className="space-y-6">
                        {reviews.map((review) => (
                          <div key={review.id} className="border-b pb-4">
                            <div className="flex justify-between mb-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                                <span className="ml-2 text-sm text-gray-600">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm mb-3">{review.comment}</p>
                            {review.adminResponse && (
                              <div className="bg-gray-50 p-3 rounded-md">
                                <p className="text-xs font-medium mb-1">Response:</p>
                                <p className="text-sm">{review.adminResponse}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No reviews yet</p>
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

export default SpecialistDetail;
