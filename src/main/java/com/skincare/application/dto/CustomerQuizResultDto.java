
package com.skincare.application.dto;

import lombok.Data;

@Data
public class CustomerQuizResultDto {
    private Long id;
    private Long customerId;
    private QuizQuestionDto question;
    private QuizOptionDto selectedOption;
    private String textAnswer;
}
