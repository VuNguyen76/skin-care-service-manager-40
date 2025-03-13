
import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Search, Filter, RefreshCw, CheckSquare, XSquare, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { bookingApi } from "@/services/api";
import { toast } from "sonner";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const statusColors = {
  CONFIRMED: "bg-green-100 text-green-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  CANCELLED: "bg-red-100 text-red-800",
  COMPLETED: "bg-blue-100 text-blue-800",
  RESCHEDULED: "bg-purple-100 text-purple-800"
};

const statusIcons = {
  CONFIRMED: <CheckSquare className="h-4 w-4 mr-1" />,
  PENDING: <Clock className="h-4 w-4 mr-1" />,
  CANCELLED: <XSquare className="h-4 w-4 mr-1" />
};

const BookingManagement = () => {
  const { isLoading: authLoading, isAdmin } = useAdminAuth();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null
  });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await bookingApi.getAllBookings();
        setBookings(data);
        setFilteredBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      fetchBookings();
    }
  }, [isAdmin]);

  // Apply filters
  useEffect(() => {
    let result = [...bookings];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(booking => 
        booking.customer.user.fullName.toLowerCase().includes(term) ||
        booking.specialist.user.fullName.toLowerCase().includes(term) ||
        booking.id.toString().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter) {
      result = result.filter(booking => booking.status === statusFilter);
    }

    // Apply date range filter
    if (dateRange.startDate && dateRange.endDate) {
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      end.setHours(23, 59, 59);

      result = result.filter(booking => {
        const bookingDate = new Date(booking.appointmentDate);
        return bookingDate >= start && bookingDate <= end;
      });
    }

    setFilteredBookings(result);
  }, [searchTerm, statusFilter, dateRange, bookings]);

  const handleOpenDetails = (booking) => {
    setSelectedBooking(booking);
    setIsDetailDialogOpen(true);
  };

  const handleStatusChange = (booking) => {
    setSelectedBooking(booking);
    setNewStatus(booking.status);
    setIsStatusDialogOpen(true);
  };

  const updateBookingStatus = async () => {
    try {
      setLoading(true);
      await bookingApi.updateBookingStatus(selectedBooking.id, newStatus);
      
      // Update local state
      const updatedBookings = bookings.map(booking => 
        booking.id === selectedBooking.id ? { ...booking, status: newStatus } : booking
      );
      
      setBookings(updatedBookings);
      setIsStatusDialogOpen(false);
      toast.success(`Booking status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast.error("Failed to update booking status");
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setDateRange({ startDate: null, endDate: null });
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
        <h1 className="text-3xl font-bold tracking-tight">Booking Management</h1>
        <p className="text-muted-foreground">Manage and track all customer bookings</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by customer or specialist name..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <Filter className="h-4 w-4" />
                Status
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0" align="end">
              <div className="p-2">
                <div className="space-y-2">
                  <Label>Booking Status</Label>
                  <div className="grid grid-cols-1 gap-2">
                    <Button 
                      variant={statusFilter === "CONFIRMED" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setStatusFilter(statusFilter === "CONFIRMED" ? "" : "CONFIRMED")}
                    >
                      Confirmed
                    </Button>
                    <Button 
                      variant={statusFilter === "PENDING" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setStatusFilter(statusFilter === "PENDING" ? "" : "PENDING")}
                    >
                      Pending
                    </Button>
                    <Button 
                      variant={statusFilter === "CANCELLED" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setStatusFilter(statusFilter === "CANCELLED" ? "" : "CANCELLED")}
                    >
                      Cancelled
                    </Button>
                    <Button 
                      variant={statusFilter === "COMPLETED" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setStatusFilter(statusFilter === "COMPLETED" ? "" : "COMPLETED")}
                    >
                      Completed
                    </Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <CalendarIcon className="h-4 w-4" />
                Date
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                selected={{
                  from: dateRange.startDate,
                  to: dateRange.endDate
                }}
                onSelect={(range) => {
                  setDateRange({ 
                    startDate: range?.from || null, 
                    endDate: range?.to || null 
                  });
                }}
                numberOfMonths={2}
                className="rounded-md border"
              />
            </PopoverContent>
          </Popover>
          
          <Button variant="ghost" size="icon" onClick={resetFilters}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Date range display */}
      {(dateRange.startDate || dateRange.endDate) && (
        <div className="flex items-center text-sm text-muted-foreground">
          <span>Filtering by date: </span>
          <span className="font-medium ml-1">
            {dateRange.startDate ? format(dateRange.startDate, "PPP") : "Start date"} 
            {" to "} 
            {dateRange.endDate ? format(dateRange.endDate, "PPP") : "End date"}
          </span>
        </div>
      )}

      {/* Booking Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Bookings</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {renderBookingsTable(filteredBookings)}
        </TabsContent>

        <TabsContent value="today">
          {renderBookingsTable(filteredBookings.filter(booking => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            const bookingDate = new Date(booking.appointmentDate);
            return bookingDate >= today && bookingDate < tomorrow;
          }))}
        </TabsContent>

        <TabsContent value="upcoming">
          {renderBookingsTable(filteredBookings.filter(booking => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const bookingDate = new Date(booking.appointmentDate);
            return bookingDate > today;
          }))}
        </TabsContent>

        <TabsContent value="past">
          {renderBookingsTable(filteredBookings.filter(booking => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const bookingDate = new Date(booking.appointmentDate);
            return bookingDate < today;
          }))}
        </TabsContent>
      </Tabs>

      {/* Booking Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">Booking ID</h3>
                  <p>#{selectedBooking.id}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">Status</h3>
                  <Badge className={statusColors[selectedBooking.status]}>
                    {statusIcons[selectedBooking.status]}
                    {selectedBooking.status}
                  </Badge>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground">Date & Time</h3>
                <p>{format(new Date(selectedBooking.appointmentDate), "PPP")} at {format(new Date(selectedBooking.appointmentDate), "p")}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">Customer</h3>
                  <p>{selectedBooking.customer.user.fullName}</p>
                  <p className="text-sm text-muted-foreground">{selectedBooking.customer.user.email}</p>
                  <p className="text-sm text-muted-foreground">{selectedBooking.customer.user.phoneNumber}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">Specialist</h3>
                  <p>{selectedBooking.specialist.user.fullName}</p>
                  <p className="text-sm text-muted-foreground">{selectedBooking.specialist.specialization}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground">Services Booked</h3>
                <ul className="list-disc pl-5 mt-1">
                  {selectedBooking.bookingDetails.map(detail => (
                    <li key={detail.id}>
                      {detail.service.name} - ${detail.price.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">Total Price</h3>
                  <p className="font-bold">${selectedBooking.totalPrice.toFixed(2)}</p>
                </div>
                {selectedBooking.paymentStatus && (
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">Payment Status</h3>
                    <p>{selectedBooking.paymentStatus}</p>
                  </div>
                )}
              </div>
              
              {selectedBooking.notes && (
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">Notes</h3>
                  <p>{selectedBooking.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setIsDetailDialogOpen(false);
              handleStatusChange(selectedBooking);
            }}>
              Change Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Booking Status</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4 py-4">
              <div>
                <Label>Current Status</Label>
                <div className="mt-1">
                  <Badge className={statusColors[selectedBooking.status]}>
                    {statusIcons[selectedBooking.status]}
                    {selectedBooking.status}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>New Status</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant={newStatus === "CONFIRMED" ? "default" : "outline"} 
                    onClick={() => setNewStatus("CONFIRMED")}
                    className="justify-start"
                  >
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Confirmed
                  </Button>
                  <Button 
                    variant={newStatus === "PENDING" ? "default" : "outline"} 
                    onClick={() => setNewStatus("PENDING")}
                    className="justify-start"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Pending
                  </Button>
                  <Button 
                    variant={newStatus === "CANCELLED" ? "default" : "outline"} 
                    onClick={() => setNewStatus("CANCELLED")}
                    className="justify-start"
                  >
                    <XSquare className="h-4 w-4 mr-2" />
                    Cancelled
                  </Button>
                  <Button 
                    variant={newStatus === "COMPLETED" ? "default" : "outline"} 
                    onClick={() => setNewStatus("COMPLETED")}
                    className="justify-start"
                  >
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Completed
                  </Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={updateBookingStatus} 
              disabled={loading || selectedBooking?.status === newStatus}
            >
              {loading && <Spinner className="mr-2" size="sm" />}
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

  function renderBookingsTable(bookings) {
    if (loading) {
      return (
        <div className="h-96 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      );
    }

    if (bookings.length === 0) {
      return (
        <div className="rounded-md border p-8 text-center">
          <h3 className="font-semibold text-lg">No bookings found</h3>
          <p className="text-muted-foreground mt-1">
            {searchTerm || statusFilter || dateRange.startDate ? 
              "Try adjusting your filters" : 
              "Bookings will appear here once customers make appointments"}
          </p>
        </div>
      );
    }

    return (
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Specialist</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Services</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>#{booking.id}</TableCell>
                <TableCell>{booking.customer.user.fullName}</TableCell>
                <TableCell>{booking.specialist.user.fullName}</TableCell>
                <TableCell>
                  <div>
                    {format(new Date(booking.appointmentDate), "PP")}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(booking.appointmentDate), "p")}
                  </div>
                </TableCell>
                <TableCell>
                  {booking.bookingDetails.length} service(s)
                </TableCell>
                <TableCell>${booking.totalPrice.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge className={statusColors[booking.status]}>
                    {statusIcons[booking.status]}
                    {booking.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleOpenDetails(booking)}
                  >
                    Details
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleStatusChange(booking)}
                  >
                    Status
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
};

export default BookingManagement;
