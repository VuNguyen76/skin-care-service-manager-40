
package com.skincare.application.dto;

import lombok.Data;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Data
public class SpecialistScheduleDto {
    private Long id;
    private Long specialistId;
    private DayOfWeek dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
    private Boolean isAvailable;
}
