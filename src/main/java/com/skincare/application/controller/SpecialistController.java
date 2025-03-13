
package com.skincare.application.controller;

import com.skincare.application.dto.SpecialistDto;
import com.skincare.application.dto.SpecialistScheduleDto;
import com.skincare.application.exception.ResourceNotFoundException;
import com.skincare.application.model.Service;
import com.skincare.application.model.Specialist;
import com.skincare.application.model.SpecialistSchedule;
import com.skincare.application.model.User;
import com.skincare.application.repository.ServiceRepository;
import com.skincare.application.repository.SpecialistRepository;
import com.skincare.application.repository.SpecialistScheduleRepository;
import com.skincare.application.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.DayOfWeek;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/specialists")
public class SpecialistController {
    @Autowired
    private SpecialistRepository specialistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private SpecialistScheduleRepository scheduleRepository;

    // Get all specialists
    @GetMapping
    public List<SpecialistDto> getAllSpecialists() {
        List<Specialist> specialists = specialistRepository.findAll();
        return specialists.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // Get specialist by id
    @GetMapping("/{id}")
    public ResponseEntity<SpecialistDto> getSpecialistById(@PathVariable Long id) {
        Specialist specialist = specialistRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Specialist not found with id: " + id));
        
        return ResponseEntity.ok(convertToDto(specialist));
    }

    // Create specialist profile (for users with ROLE_SPECIALIST)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SpecialistDto> createSpecialist(@Valid @RequestBody SpecialistDto specialistDto) {
        User user = userRepository.findById(specialistDto.getUser().getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + specialistDto.getUser().getId()));
        
        Specialist specialist = new Specialist();
        specialist.setUser(user);
        updateSpecialistFromDto(specialist, specialistDto);
        
        Specialist savedSpecialist = specialistRepository.save(specialist);
        return ResponseEntity.ok(convertToDto(savedSpecialist));
    }

    // Update specialist
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SPECIALIST')")
    public ResponseEntity<SpecialistDto> updateSpecialist(@PathVariable Long id, @Valid @RequestBody SpecialistDto specialistDto) {
        Specialist specialist = specialistRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Specialist not found with id: " + id));
        
        updateSpecialistFromDto(specialist, specialistDto);
        Specialist updatedSpecialist = specialistRepository.save(specialist);
        
        return ResponseEntity.ok(convertToDto(updatedSpecialist));
    }

    // Get specialists by service
    @GetMapping("/service/{serviceId}")
    public List<SpecialistDto> getSpecialistsByService(@PathVariable Long serviceId) {
        List<Specialist> specialists = specialistRepository.findAllByServiceId(serviceId);
        
        return specialists.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // Get specialists by minimum rating
    @GetMapping("/rating/{minRating}")
    public List<SpecialistDto> getSpecialistsByMinimumRating(@PathVariable Double minRating) {
        List<Specialist> specialists = specialistRepository.findAllWithMinimumRating(minRating);
        
        return specialists.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // Get specialist schedules
    @GetMapping("/{id}/schedules")
    public List<SpecialistScheduleDto> getSpecialistSchedules(@PathVariable Long id) {
        Specialist specialist = specialistRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Specialist not found with id: " + id));
        
        List<SpecialistSchedule> schedules = scheduleRepository.findBySpecialist(specialist);
        
        return schedules.stream()
                .map(this::convertScheduleToDto)
                .collect(Collectors.toList());
    }

    // Add schedule for specialist
    @PostMapping("/{id}/schedules")
    @PreAuthorize("hasAnyRole('ADMIN', 'SPECIALIST')")
    public ResponseEntity<SpecialistScheduleDto> addSpecialistSchedule(
            @PathVariable Long id, 
            @Valid @RequestBody SpecialistScheduleDto scheduleDto) {
        
        Specialist specialist = specialistRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Specialist not found with id: " + id));
        
        SpecialistSchedule schedule = new SpecialistSchedule();
        schedule.setSpecialist(specialist);
        updateScheduleFromDto(schedule, scheduleDto);
        
        SpecialistSchedule savedSchedule = scheduleRepository.save(schedule);
        return ResponseEntity.ok(convertScheduleToDto(savedSchedule));
    }

    // Update specialist schedule
    @PutMapping("/schedules/{scheduleId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SPECIALIST')")
    public ResponseEntity<SpecialistScheduleDto> updateSpecialistSchedule(
            @PathVariable Long scheduleId, 
            @Valid @RequestBody SpecialistScheduleDto scheduleDto) {
        
        SpecialistSchedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with id: " + scheduleId));
        
        updateScheduleFromDto(schedule, scheduleDto);
        SpecialistSchedule updatedSchedule = scheduleRepository.save(schedule);
        
        return ResponseEntity.ok(convertScheduleToDto(updatedSchedule));
    }

    // Delete specialist schedule
    @DeleteMapping("/schedules/{scheduleId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SPECIALIST')")
    public ResponseEntity<?> deleteSpecialistSchedule(@PathVariable Long scheduleId) {
        SpecialistSchedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with id: " + scheduleId));
        
        scheduleRepository.delete(schedule);
        return ResponseEntity.ok().build();
    }

    // Convert entity to DTO
    private SpecialistDto convertToDto(Specialist specialist) {
        SpecialistDto dto = new SpecialistDto();
        dto.setId(specialist.getId());
        
        // Set user data
        com.skincare.application.dto.UserDto userDto = new com.skincare.application.dto.UserDto();
        userDto.setId(specialist.getUser().getId());
        userDto.setUsername(specialist.getUser().getUsername());
        userDto.setEmail(specialist.getUser().getEmail());
        userDto.setFullName(specialist.getUser().getFullName());
        userDto.setPhoneNumber(specialist.getUser().getPhoneNumber());
        userDto.setAddress(specialist.getUser().getAddress());
        dto.setUser(userDto);
        
        dto.setSpecialization(specialist.getSpecialization());
        dto.setBio(specialist.getBio());
        dto.setExperience(specialist.getExperience());
        dto.setCertifications(specialist.getCertifications());
        dto.setRatingAverage(specialist.getRatingAverage());
        dto.setRatingCount(specialist.getRatingCount());
        
        // Convert services
        if (specialist.getServices() != null) {
            dto.setServices(specialist.getServices().stream()
                    .map(service -> {
                        com.skincare.application.dto.ServiceDto serviceDto = new com.skincare.application.dto.ServiceDto();
                        serviceDto.setId(service.getId());
                        serviceDto.setName(service.getName());
                        serviceDto.setDescription(service.getDescription());
                        serviceDto.setPrice(service.getPrice());
                        serviceDto.setDurationMinutes(service.getDurationMinutes());
                        serviceDto.setIsActive(service.getIsActive());
                        serviceDto.setImageUrl(service.getImageUrl());
                        return serviceDto;
                    })
                    .collect(Collectors.toList()));
        }
        
        return dto;
    }

    // Update entity from DTO
    private void updateSpecialistFromDto(Specialist specialist, SpecialistDto dto) {
        specialist.setSpecialization(dto.getSpecialization());
        specialist.setBio(dto.getBio());
        specialist.setExperience(dto.getExperience());
        specialist.setCertifications(dto.getCertifications());
        
        // Update services
        if (dto.getServices() != null) {
            Set<Service> services = new HashSet<>();
            for (com.skincare.application.dto.ServiceDto serviceDto : dto.getServices()) {
                Service service = serviceRepository.findById(serviceDto.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + serviceDto.getId()));
                services.add(service);
            }
            specialist.setServices(services);
        }
    }

    // Convert schedule entity to DTO
    private SpecialistScheduleDto convertScheduleToDto(SpecialistSchedule schedule) {
        SpecialistScheduleDto dto = new SpecialistScheduleDto();
        dto.setId(schedule.getId());
        dto.setSpecialistId(schedule.getSpecialist().getId());
        dto.setDayOfWeek(schedule.getDayOfWeek());
        dto.setStartTime(schedule.getStartTime());
        dto.setEndTime(schedule.getEndTime());
        dto.setIsAvailable(schedule.getIsAvailable());
        return dto;
    }

    // Update schedule entity from DTO
    private void updateScheduleFromDto(SpecialistSchedule schedule, SpecialistScheduleDto dto) {
        schedule.setDayOfWeek(dto.getDayOfWeek());
        schedule.setStartTime(dto.getStartTime());
        schedule.setEndTime(dto.getEndTime());
        schedule.setIsAvailable(dto.getIsAvailable());
    }
}
