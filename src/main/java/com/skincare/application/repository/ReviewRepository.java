
package com.skincare.application.repository;

import com.skincare.application.model.Booking;
import com.skincare.application.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    Optional<Review> findByBooking(Booking booking);
    List<Review> findByIsApproved(Boolean isApproved);
    
    @Query("SELECT r FROM Review r JOIN r.booking b WHERE b.specialist.id = :specialistId")
    List<Review> findBySpecialistId(Long specialistId);
    
    @Query("SELECT AVG(r.rating) FROM Review r JOIN r.booking b WHERE b.specialist.id = :specialistId")
    Double calculateAverageRatingForSpecialist(Long specialistId);
    
    @Query("SELECT COUNT(r) FROM Review r JOIN r.booking b WHERE b.specialist.id = :specialistId")
    Long countReviewsForSpecialist(Long specialistId);
}
