
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingApi, reviewApi } from "@/services/api";
import MainLayout from "@/components/layout/MainLayout";
import { Spinner } from "@/components/ui/spinner";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  CalendarDays,
  User,
  Clock,
  Star,
  ArrowRight,
  XCircle,
  CheckCircle
} from "lucide-react";

// Review form schema
const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(5, "Please provide a comment with at least 5 characters").max(500),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

const MyBookings = () => {
  const queryClient = useQueryClient();
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // Fetch user bookings
  const { data: bookings, isLoading } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: () => bookingApi.getMyBookings(),
  });

  // Initialize review form
  const reviewForm = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 5,
      comment: "",
    },
  });

  // Cancel booking mutation
  const cancelMutation = useMutation({
    mutationFn: (bookingId: number) => bookingApi.cancelBooking(bookingId),
    onSuccess: () => {
      toast.success("Booking cancelled successfully");
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
    },
    onError: () => {
      toast.error("Failed to cancel booking");
    },
  });

  // Submit review mutation
  const reviewMutation = useMutation({
    mutationFn: ({ bookingId, data }: { bookingId: number; data: ReviewFormValues }) =>
      reviewApi.submitReview(bookingId, data),
    onSuccess: () => {
      toast.success("Review submitted successfully");
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      setIsReviewOpen(false);
      reviewForm.reset();
    },
    onError: () => {
      toast.error("Failed to submit review");
    },
  });

  const handleCancelBooking = (bookingId: number) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      cancelMutation.mutate(bookingId);
    }
  };

  const handleOpenReview = (booking: any) => {
    setSelectedBooking(booking);
    setIsReviewOpen(true);
  };

  const onSubmitReview = (data: ReviewFormValues) => {
    if (selectedBooking) {
      reviewMutation.mutate({ bookingId: selectedBooking.id, data });
    }
  };

  // Filter bookings by status
  const activeBookings = bookings?.filter(booking => 
    ["PENDING", "CONFIRMED", "CHECKED_IN", "IN_PROGRESS"].includes(booking.status)
  ) || [];
  
  const completedBookings = bookings?.filter(booking => 
    booking.status === "COMPLETED"
  ) || [];
  
  const cancelledBookings = bookings?.filter(booking => 
    ["CANCELLED", "NO_SHOW"].includes(booking.status)
  ) || [];

  // Helper function to get badge color based on status
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string, icon: JSX.Element }> = {
      "PENDING": { color: "bg-yellow-100 text-yellow-800", icon: <Clock className="h-3 w-3 mr-1" /> },
      "CONFIRMED": { color: "bg-blue-100 text-blue-800", icon: <CheckCircle className="h-3 w-3 mr-1" /> },
      "CHECKED_IN": { color: "bg-green-100 text-green-800", icon: <User className="h-3 w-3 mr-1" /> },
      "IN_PROGRESS": { color: "bg-purple-100 text-purple-800", icon: <ArrowRight className="h-3 w-3 mr-1" /> },
      "COMPLETED": { color: "bg-green-100 text-green-800", icon: <CheckCircle className="h-3 w-3 mr-1" /> },
      "CANCELLED": { color: "bg-red-100 text-red-800", icon: <XCircle className="h-3 w-3 mr-1" /> },
      "NO_SHOW": { color: "bg-gray-100 text-gray-800", icon: <XCircle className="h-3 w-3 mr-1" /> },
    };

    const statusInfo = statusMap[status] || { color: "bg-gray-100 text-gray-800", icon: null };
    
    return (
      <Badge className={`flex items-center ${statusInfo.color}`}>
        {statusInfo.icon}
        {status}
      </Badge>
    );
  };

  // Helper function for rendering booking cards
  const renderBookingCard = (booking: any) => (
    <Card key={booking.id} className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div>
            <CardTitle className="text-lg">
              {booking.bookingDetails?.[0]?.service?.name || "Service"}
            </CardTitle>
            <CardDescription className="flex items-center mt-1">
              <User className="h-4 w-4 mr-1" />
              {booking.specialist?.user?.fullName || "Specialist"}
            </CardDescription>
          </div>
          {getStatusBadge(booking.status)}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center text-sm">
            <CalendarDays className="h-4 w-4 mr-2 text-gray-500" />
            {format(new Date(booking.bookingDateTime), "PPP")}
          </div>
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2 text-gray-500" />
            {format(new Date(booking.bookingDateTime), "p")}
          </div>
        </div>
        
        {booking.notes && (
          <div className="mt-2 text-sm text-gray-600">
            <p className="font-medium">Notes:</p>
            <p>{booking.notes}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <div className="text-sm font-medium">
          ${booking.totalAmount}
        </div>
        <div className="flex gap-2">
          {booking.status === "PENDING" && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleCancelBooking(booking.id)}
            >
              Cancel
            </Button>
          )}
          
          {booking.status === "COMPLETED" && !booking.review && (
            <Button 
              size="sm"
              onClick={() => handleOpenReview(booking)}
            >
              Leave Review
            </Button>
          )}
          
          {booking.review && (
            <div className="flex items-center">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < booking.review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-1 text-xs text-gray-500">Reviewed</span>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );

  if (isLoading) {
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
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
        
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList>
            <TabsTrigger value="active">
              Active ({activeBookings.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedBookings.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled ({cancelledBookings.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            {activeBookings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">You don't have any active bookings</p>
                <Button className="mt-4" onClick={() => window.location.href = "/services"}>
                  Book a Service
                </Button>
              </div>
            ) : (
              activeBookings.map(renderBookingCard)
            )}
          </TabsContent>
          
          <TabsContent value="completed">
            {completedBookings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">You don't have any completed bookings</p>
              </div>
            ) : (
              completedBookings.map(renderBookingCard)
            )}
          </TabsContent>
          
          <TabsContent value="cancelled">
            {cancelledBookings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">You don't have any cancelled bookings</p>
              </div>
            ) : (
              cancelledBookings.map(renderBookingCard)
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Review Dialog */}
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Leave a Review</DialogTitle>
            <DialogDescription>
              Share your experience with {selectedBooking?.specialist?.user?.fullName}
            </DialogDescription>
          </DialogHeader>
          <Form {...reviewForm}>
            <form onSubmit={reviewForm.handleSubmit(onSubmitReview)} className="space-y-4">
              <FormField
                control={reviewForm.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Star
                          key={rating}
                          className={`h-6 w-6 cursor-pointer ${
                            rating <= field.value
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                          onClick={() => field.onChange(rating)}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={reviewForm.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Review</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Share details of your experience"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit">Submit Review</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default MyBookings;
