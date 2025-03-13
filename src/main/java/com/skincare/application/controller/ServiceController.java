
package com.skincare.application.controller;

import com.skincare.application.dto.ServiceDto;
import com.skincare.application.exception.ResourceNotFoundException;
import com.skincare.application.model.Category;
import com.skincare.application.model.Service;
import com.skincare.application.repository.CategoryRepository;
import com.skincare.application.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/services")
public class ServiceController {
    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    // Get all services
    @GetMapping
    public List<ServiceDto> getAllServices(@RequestParam(required = false) Boolean active) {
        List<Service> services;
        if (active != null && active) {
            services = serviceRepository.findByIsActiveTrue();
        } else {
            services = serviceRepository.findAll();
        }
        
        return services.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // Get service by id
    @GetMapping("/{id}")
    public ResponseEntity<ServiceDto> getServiceById(@PathVariable Long id) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + id));
        
        return ResponseEntity.ok(convertToDto(service));
    }

    // Create service
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ServiceDto> createService(@Valid @RequestBody ServiceDto serviceDto) {
        Service service = new Service();
        updateServiceFromDto(service, serviceDto);
        
        Service savedService = serviceRepository.save(service);
        return ResponseEntity.ok(convertToDto(savedService));
    }

    // Update service
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ServiceDto> updateService(@PathVariable Long id, @Valid @RequestBody ServiceDto serviceDto) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + id));
        
        updateServiceFromDto(service, serviceDto);
        Service updatedService = serviceRepository.save(service);
        
        return ResponseEntity.ok(convertToDto(updatedService));
    }

    // Delete service
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteService(@PathVariable Long id) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + id));
        
        // Instead of deleting, mark as inactive
        service.setIsActive(false);
        serviceRepository.save(service);
        
        return ResponseEntity.ok().build();
    }

    // Get services by category
    @GetMapping("/category/{categoryId}")
    public List<ServiceDto> getServicesByCategory(@PathVariable Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));
        
        List<Service> services = serviceRepository.findByCategoriesContaining(category);
        
        return services.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // Get services by specialist
    @GetMapping("/specialist/{specialistId}")
    public List<ServiceDto> getServicesBySpecialist(@PathVariable Long specialistId) {
        List<Service> services = serviceRepository.findAllBySpecialistId(specialistId);
        
        return services.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // Convert entity to DTO
    private ServiceDto convertToDto(Service service) {
        ServiceDto dto = new ServiceDto();
        dto.setId(service.getId());
        dto.setName(service.getName());
        dto.setDescription(service.getDescription());
        dto.setPrice(service.getPrice());
        dto.setDurationMinutes(service.getDurationMinutes());
        dto.setIsActive(service.getIsActive());
        dto.setImageUrl(service.getImageUrl());
        
        // Convert categories
        if (service.getCategories() != null) {
            dto.setCategories(service.getCategories().stream()
                    .map(category -> {
                        com.skincare.application.dto.CategoryDto categoryDto = new com.skincare.application.dto.CategoryDto();
                        categoryDto.setId(category.getId());
                        categoryDto.setName(category.getName());
                        categoryDto.setDescription(category.getDescription());
                        return categoryDto;
                    })
                    .collect(Collectors.toList()));
        }
        
        return dto;
    }

    // Update entity from DTO
    private void updateServiceFromDto(Service service, ServiceDto dto) {
        service.setName(dto.getName());
        service.setDescription(dto.getDescription());
        service.setPrice(dto.getPrice());
        service.setDurationMinutes(dto.getDurationMinutes());
        service.setIsActive(dto.getIsActive());
        service.setImageUrl(dto.getImageUrl());
        
        // Update categories
        if (dto.getCategories() != null) {
            Set<Category> categories = new HashSet<>();
            for (com.skincare.application.dto.CategoryDto categoryDto : dto.getCategories()) {
                Category category = categoryRepository.findById(categoryDto.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryDto.getId()));
                categories.add(category);
            }
            service.setCategories(categories);
        }
    }
}
