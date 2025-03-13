
package com.skincare.application.repository;

import com.skincare.application.model.Booking;
import com.skincare.application.model.BookingDetail;
import com.skincare.application.model.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingDetailRepository extends JpaRepository<BookingDetail, Long> {
    List<BookingDetail> findByBooking(Booking booking);
    List<BookingDetail> findByService(Service service);
    List<BookingDetail> findByStatus(BookingDetail.Status status);
    
    @Query("SELECT bd FROM BookingDetail bd WHERE bd.booking.specialist.id = :specialistId AND bd.status = :status")
    List<BookingDetail> findBySpecialistIdAndStatus(Long specialistId, BookingDetail.Status status);
    
    @Query("SELECT COUNT(bd) FROM BookingDetail bd WHERE bd.service.id = :serviceId AND bd.booking.bookingDateTime BETWEEN :start AND :end")
    Long countBookingDetailsByServiceIdAndDateRange(Long serviceId, LocalDateTime start, LocalDateTime end);
}
