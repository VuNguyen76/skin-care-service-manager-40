
package com.skincare.application.dto;

import com.skincare.application.model.Booking;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class BookingDto {
    private Long id;
    private CustomerDto customer;
    private SpecialistDto specialist;
    private LocalDateTime bookingDateTime;
    private Booking.BookingStatus status;
    private BigDecimal totalAmount;
    private Booking.PaymentStatus paymentStatus;
    private String paymentMethod;
    private LocalDateTime checkedInTime;
    private LocalDateTime checkedOutTime;
    private String cancellationReason;
    private String notes;
    private List<BookingDetailDto> bookingDetails;
    private ReviewDto review;
}
