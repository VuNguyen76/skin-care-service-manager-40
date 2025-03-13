
package com.skincare.application.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReviewDto {
    private Long id;
    private Long bookingId;
    private Integer rating;
    private String comment;
    private Boolean isApproved;
    private String adminResponse;
    private LocalDateTime createdAt;
}
