
package com.skincare.application.dto;

import lombok.Data;

import java.util.List;

@Data
public class QuizOptionDto {
    private Long id;
    private Long questionId;
    private String optionText;
    private List<ServiceDto> recommendedServices;
}
