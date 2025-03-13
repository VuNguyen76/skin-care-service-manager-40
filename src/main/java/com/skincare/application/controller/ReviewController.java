
package com.skincare.application.controller;

import com.skincare.application.dto.ReviewDto;
import com.skincare.application.exception.ResourceNotFoundException;
import com.skincare.application.model.Booking;
import com.skincare.application.model.Review;
import com.skincare.application.model.Specialist;
import com.skincare.application.repository.BookingRepository;
import com.skincare.application.repository.ReviewRepository;
import com.skincare.application.repository.SpecialistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private SpecialistRepository specialistRepository;

    // Get all reviews
    @GetMapping
    public List<ReviewDto> getAllReviews(@RequestParam(required = false) Boolean approved) {
        List<Review> reviews;
        if (approved != null) {
            reviews = reviewRepository.findByIsApproved(approved);
        } else {
            reviews = reviewRepository.findAll();
        }
        
        return reviews.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // Get review by id
    @GetMapping("/{id}")
    public ResponseEntity<ReviewDto> getReviewById(@PathVariable Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + id));
        
        return ResponseEntity.ok(convertToDto(review));
    }

    // Get reviews by specialist
    @GetMapping("/specialist/{specialistId}")
    public List<ReviewDto> getReviewsBySpecialist(@PathVariable Long specialistId) {
        List<Review> reviews = reviewRepository.findBySpecialistId(specialistId);
        
        return reviews.stream()
                .filter(review -> review.getIsApproved())
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // Submit review for booking
    @PostMapping("/booking/{bookingId}")
    @PreAuthorize("@bookingAuthorizationService.isOwner(#bookingId)")
    public ResponseEntity<ReviewDto> submitReview(
            @PathVariable Long bookingId,
            @Valid @RequestBody ReviewDto reviewDto) {
        
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));
        
        // Check if booking is completed
        if (booking.getStatus() != Booking.BookingStatus.COMPLETED) {
            return ResponseEntity.badRequest().build();
        }
        
        // Check if review already exists
        if (reviewRepository.findByBooking(booking).isPresent()) {
            return ResponseEntity.badRequest().build();
        }
        
        Review review = new Review();
        review.setBooking(booking);
        review.setRating(reviewDto.getRating());
        review.setComment(reviewDto.getComment());
        review.setIsApproved(false); // Reviews need approval
        
        Review savedReview = reviewRepository.save(review);
        
        return ResponseEntity.ok(convertToDto(savedReview));
    }

    // Approve review (admin only)
    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReviewDto> approveReview(@PathVariable Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + id));
        
        review.setIsApproved(true);
        Review updatedReview = reviewRepository.save(review);
        
        // Update specialist rating
        Specialist specialist = updatedReview.getBooking().getSpecialist();
        if (specialist != null) {
            Double avgRating = reviewRepository.calculateAverageRatingForSpecialist(specialist.getId());
            Long reviewCount = reviewRepository.countReviewsForSpecialist(specialist.getId());
            
            specialist.setRatingAverage(avgRating);
            specialist.setRatingCount(reviewCount.intValue());
            specialistRepository.save(specialist);
        }
        
        return ResponseEntity.ok(convertToDto(updatedReview));
    }

    // Add admin response to review
    @PutMapping("/{id}/respond")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReviewDto> respondToReview(
            @PathVariable Long id,
            @RequestParam String response) {
        
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + id));
        
        review.setAdminResponse(response);
        Review updatedReview = reviewRepository.save(review);
        
        return ResponseEntity.ok(convertToDto(updatedReview));
    }

    // Convert entity to DTO
    private ReviewDto convertToDto(Review review) {
        ReviewDto dto = new ReviewDto();
        dto.setId(review.getId());
        dto.setBookingId(review.getBooking().getId());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setIsApproved(review.getIsApproved());
        dto.setAdminResponse(review.getAdminResponse());
        dto.setCreatedAt(review.getCreatedAt());
        return dto;
    }
}
