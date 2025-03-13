
package com.skincare.application.repository;

import com.skincare.application.model.Booking;
import com.skincare.application.model.Customer;
import com.skincare.application.model.Specialist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomer(Customer customer);
    List<Booking> findBySpecialist(Specialist specialist);
    List<Booking> findByStatus(Booking.BookingStatus status);
    List<Booking> findByPaymentStatus(Booking.PaymentStatus paymentStatus);
    
    @Query("SELECT b FROM Booking b WHERE b.bookingDateTime BETWEEN :start AND :end")
    List<Booking> findBookingsBetweenDates(LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT b FROM Booking b WHERE b.specialist.id = :specialistId AND b.bookingDateTime BETWEEN :start AND :end")
    List<Booking> findBookingsBySpecialistIdAndDateRange(Long specialistId, LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = :status AND b.bookingDateTime BETWEEN :start AND :end")
    Long countBookingsByStatusAndDateRange(Booking.BookingStatus status, LocalDateTime start, LocalDateTime end);
}
