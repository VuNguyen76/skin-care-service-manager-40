
package com.skincare.application.dto;

import com.skincare.application.model.BookingDetail;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class BookingDetailDto {
    private Long id;
    private Long bookingId;
    private ServiceDto service;
    private BigDecimal price;
    private BookingDetail.Status status;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String specialistNotes;
    private String recommendedFollowup;
}
