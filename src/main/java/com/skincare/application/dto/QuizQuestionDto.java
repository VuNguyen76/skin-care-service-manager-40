
package com.skincare.application.dto;

import com.skincare.application.model.QuizQuestion;
import lombok.Data;

import java.util.List;

@Data
public class QuizQuestionDto {
    private Long id;
    private String question;
    private QuizQuestion.QuestionType questionType;
    private Boolean isActive;
    private List<QuizOptionDto> options;
    private List<ServiceDto> recommendedServices;
}
