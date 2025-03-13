
package com.skincare.application.controller;

import com.skincare.application.dto.BookingDetailDto;
import com.skincare.application.dto.BookingDto;
import com.skincare.application.exception.ResourceNotFoundException;
import com.skincare.application.model.*;
import com.skincare.application.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private BookingDetailRepository bookingDetailRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private SpecialistRepository specialistRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private UserRepository userRepository;

    // Get all bookings (for admins and staff)
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public List<BookingDto> getAllBookings(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) LocalDateTime startDate,
            @RequestParam(required = false) LocalDateTime endDate) {
        
        List<Booking> bookings;
        
        if (status != null && startDate != null && endDate != null) {
            // Filter by status and date range
            bookings = bookingRepository.findByStatusAndBookingTimeBetween(
                    Booking.BookingStatus.valueOf(status), startDate, endDate);
        } else if (status != null) {
            // Filter by status only
            bookings = bookingRepository.findByStatus(Booking.BookingStatus.valueOf(status));
        } else if (startDate != null && endDate != null) {
            // Filter by date range only
            bookings = bookingRepository.findByBookingTimeBetween(startDate, endDate);
        } else {
            // No filters
            bookings = bookingRepository.findAll();
        }
        
        return bookings.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // Get booking by id
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'SPECIALIST') or @bookingAuthorizationService.isOwner(#id)")
    public ResponseEntity<BookingDto> getBookingById(@PathVariable Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
        
        return ResponseEntity.ok(convertToDto(booking));
    }

    // Get current customer's bookings
    @GetMapping("/my-bookings")
    @PreAuthorize("hasRole('CUSTOMER')")
    public List<BookingDto> getCurrentCustomerBookings() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        
        Customer customer = customerRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Customer profile not found for user: " + username));
        
        List<Booking> bookings = bookingRepository.findByCustomer(customer);
        
        return bookings.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // Get specialist's bookings
    @GetMapping("/specialist-bookings")
    @PreAuthorize("hasRole('SPECIALIST')")
    public List<BookingDto> getSpecialistBookings() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        
        Specialist specialist = specialistRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Specialist profile not found for user: " + username));
        
        List<Booking> bookings = bookingRepository.findBySpecialist(specialist);
        
        return bookings.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // Create booking (customer)
    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<BookingDto> createBooking(@Valid @RequestBody BookingDto bookingDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        
        Customer customer = customerRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Customer profile not found for user: " + username));
        
        Booking booking = new Booking();
        booking.setCustomer(customer);
        booking.setBookingTime(bookingDto.getBookingTime());
        booking.setNotes(bookingDto.getNotes());
        booking.setStatus(Booking.BookingStatus.PENDING);
        
        // Set specialist if provided
        if (bookingDto.getSpecialistId() != null) {
            Specialist specialist = specialistRepository.findById(bookingDto.getSpecialistId())
                    .orElseThrow(() -> new ResourceNotFoundException("Specialist not found with id: " + bookingDto.getSpecialistId()));
            booking.setSpecialist(specialist);
        }
        
        Booking savedBooking = bookingRepository.save(booking);
        
        // Create booking details for services
        if (bookingDto.getBookingDetails() != null) {
            for (BookingDetailDto detailDto : bookingDto.getBookingDetails()) {
                BookingDetail detail = new BookingDetail();
                detail.setBooking(savedBooking);
                
                Service service = serviceRepository.findById(detailDto.getServiceId())
                        .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + detailDto.getServiceId()));
                detail.setService(service);
                detail.setPrice(service.getPrice());
                detail.setDuration(service.getDurationMinutes());
                
                bookingDetailRepository.save(detail);
            }
        }
        
        // Reload booking with details
        savedBooking = bookingRepository.findById(savedBooking.getId()).orElseThrow();
        
        return ResponseEntity.ok(convertToDto(savedBooking));
    }

    // Update booking status (staff, specialist)
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'SPECIALIST')")
    public ResponseEntity<BookingDto> updateBookingStatus(
            @PathVariable Long id,
            @RequestParam Booking.BookingStatus status) {
        
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
        
        booking.setStatus(status);
        Booking updatedBooking = bookingRepository.save(booking);
        
        return ResponseEntity.ok(convertToDto(updatedBooking));
    }

    // Assign specialist to booking (staff, admin)
    @PutMapping("/{id}/assign-specialist")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<BookingDto> assignSpecialist(
            @PathVariable Long id,
            @RequestParam Long specialistId) {
        
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
        
        Specialist specialist = specialistRepository.findById(specialistId)
                .orElseThrow(() -> new ResourceNotFoundException("Specialist not found with id: " + specialistId));
        
        booking.setSpecialist(specialist);
        Booking updatedBooking = bookingRepository.save(booking);
        
        return ResponseEntity.ok(convertToDto(updatedBooking));
    }

    // Cancel booking (customer, staff, admin)
    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF') or @bookingAuthorizationService.isOwner(#id)")
    public ResponseEntity<BookingDto> cancelBooking(@PathVariable Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
        
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        Booking updatedBooking = bookingRepository.save(booking);
        
        return ResponseEntity.ok(convertToDto(updatedBooking));
    }

    // Convert entity to DTO
    private BookingDto convertToDto(Booking booking) {
        BookingDto dto = new BookingDto();
        dto.setId(booking.getId());
        dto.setCustomerId(booking.getCustomer().getId());
        dto.setCustomerName(booking.getCustomer().getUser().getFullName());
        
        if (booking.getSpecialist() != null) {
            dto.setSpecialistId(booking.getSpecialist().getId());
            dto.setSpecialistName(booking.getSpecialist().getUser().getFullName());
        }
        
        dto.setBookingTime(booking.getBookingTime());
        dto.setStatus(booking.getStatus());
        dto.setNotes(booking.getNotes());
        dto.setCreatedAt(booking.getCreatedAt());
        
        // Convert booking details
        List<BookingDetail> details = bookingDetailRepository.findByBooking(booking);
        if (!details.isEmpty()) {
            List<BookingDetailDto> detailDtos = new ArrayList<>();
            for (BookingDetail detail : details) {
                BookingDetailDto detailDto = new BookingDetailDto();
                detailDto.setId(detail.getId());
                detailDto.setBookingId(detail.getBooking().getId());
                detailDto.setServiceId(detail.getService().getId());
                detailDto.setServiceName(detail.getService().getName());
                detailDto.setPrice(detail.getPrice());
                detailDto.setDuration(detail.getDuration());
                detailDto.setNotes(detail.getNotes());
                detailDtos.add(detailDto);
            }
            dto.setBookingDetails(detailDtos);
        }
        
        return dto;
    }
}
