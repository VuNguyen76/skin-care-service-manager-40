
package com.skincare.application.repository;

import com.skincare.application.model.QuizQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizQuestionRepository extends JpaRepository<QuizQuestion, Long> {
    List<QuizQuestion> findByIsActiveTrue();
    List<QuizQuestion> findByQuestionType(QuizQuestion.QuestionType questionType);
}
