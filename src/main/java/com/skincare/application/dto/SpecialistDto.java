
package com.skincare.application.dto;

import lombok.Data;

import java.util.List;

@Data
public class SpecialistDto {
    private Long id;
    private UserDto user;
    private String specialization;
    private String bio;
    private String experience;
    private String certifications;
    private Double ratingAverage;
    private Integer ratingCount;
    private List<ServiceDto> services;
}
