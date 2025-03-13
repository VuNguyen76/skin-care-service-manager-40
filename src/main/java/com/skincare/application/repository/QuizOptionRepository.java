
package com.skincare.application.repository;

import com.skincare.application.model.QuizOption;
import com.skincare.application.model.QuizQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizOptionRepository extends JpaRepository<QuizOption, Long> {
    List<QuizOption> findByQuestion(QuizQuestion question);
}
