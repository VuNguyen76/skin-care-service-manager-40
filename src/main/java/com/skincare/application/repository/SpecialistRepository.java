
package com.skincare.application.repository;

import com.skincare.application.model.Service;
import com.skincare.application.model.Specialist;
import com.skincare.application.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SpecialistRepository extends JpaRepository<Specialist, Long> {
    Optional<Specialist> findByUser(User user);
    
    @Query("SELECT s FROM Specialist s JOIN s.services srv WHERE srv.id = :serviceId")
    List<Specialist> findAllByServiceId(Long serviceId);
    
    @Query("SELECT s FROM Specialist s WHERE s.ratingAverage >= :minRating")
    List<Specialist> findAllWithMinimumRating(Double minRating);
}
