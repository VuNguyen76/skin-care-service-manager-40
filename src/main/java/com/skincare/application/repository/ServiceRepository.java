
package com.skincare.application.repository;

import com.skincare.application.model.Category;
import com.skincare.application.model.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {
    List<Service> findByIsActiveTrue();
    List<Service> findByCategoriesContaining(Category category);
    
    @Query("SELECT s FROM Service s JOIN s.specialists sp WHERE sp.id = :specialistId")
    List<Service> findAllBySpecialistId(Long specialistId);
    
    @Query("SELECT DISTINCT s FROM Service s JOIN s.quizQuestions q WHERE q.id = :questionId")
    List<Service> findByQuizQuestionId(Long questionId);
}
