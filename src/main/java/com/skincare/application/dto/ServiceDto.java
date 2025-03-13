
package com.skincare.application.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ServiceDto {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer durationMinutes;
    private Boolean isActive;
    private String imageUrl;
    private List<CategoryDto> categories;
}
