
package com.skincare.application.dto;

import lombok.Data;

@Data
public class CustomerDto {
    private Long id;
    private UserDto user;
    private String skinType;
    private String skinConcerns;
    private String allergies;
    private String medicalHistory;
}
