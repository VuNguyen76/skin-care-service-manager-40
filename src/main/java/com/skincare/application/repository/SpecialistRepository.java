
package com.skincare.application.repository;

import com.skincare.application.model.Specialist;
import com.skincare.application.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SpecialistRepository extends JpaRepository<Specialist, Long> {
    @Query("SELECT s FROM Specialist s JOIN s.services srv WHERE srv.id = :serviceId")
    List<Specialist> findAllByServiceId(Long serviceId);
    
    @Query("SELECT s FROM Specialist s WHERE s.ratingAverage >= :minRating")
    List<Specialist> findAllWithMinimumRating(Double minRating);
    
    @Query("SELECT s FROM Specialist s WHERE s.specialization LIKE %:keyword%")
    List<Specialist> findBySpecializationContaining(String keyword);
    
    @Query("SELECT s FROM Specialist s WHERE s.user.fullName LIKE %:name%")
    List<Specialist> findByNameContaining(String name);
    
    Optional<Specialist> findByUser(User user);
    
    // Add new queries for admin features
    
    @Query("SELECT COUNT(s) FROM Specialist s")
    Long countSpecialists();
    
    @Query("SELECT s FROM Specialist s ORDER BY s.ratingAverage DESC")
    List<Specialist> findAllOrderByRatingDesc();
    
    @Query("SELECT s FROM Specialist s WHERE s.ratingCount > :minReviews ORDER BY s.ratingAverage DESC")
    List<Specialist> findTopRatedSpecialists(Integer minReviews);
    
    @Query("SELECT s FROM Specialist s JOIN s.user u WHERE u.isActive = true")
    List<Specialist> findAllActiveSpecialists();
    
    @Query(value = "SELECT s.* FROM specialists s " +
           "JOIN specialist_schedules ss ON s.id = ss.specialist_id " +
           "WHERE ss.schedule_date BETWEEN :startDate AND :endDate " +
           "GROUP BY s.id", nativeQuery = true)
    List<Specialist> findAllAvailableBetweenDates(String startDate, String endDate);
}
