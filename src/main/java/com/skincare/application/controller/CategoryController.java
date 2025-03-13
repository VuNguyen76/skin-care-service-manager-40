
package com.skincare.application.controller;

import com.skincare.application.dto.CategoryDto;
import com.skincare.application.exception.ResourceNotFoundException;
import com.skincare.application.model.Category;
import com.skincare.application.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    @Autowired
    private CategoryRepository categoryRepository;

    // Get all categories
    @GetMapping
    public List<CategoryDto> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // Get category by id
    @GetMapping("/{id}")
    public ResponseEntity<CategoryDto> getCategoryById(@PathVariable Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        
        return ResponseEntity.ok(convertToDto(category));
    }

    // Create category
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryDto> createCategory(@Valid @RequestBody CategoryDto categoryDto) {
        // Check if name already exists
        if (categoryRepository.existsByName(categoryDto.getName())) {
            return ResponseEntity.badRequest().build();
        }
        
        Category category = new Category();
        category.setName(categoryDto.getName());
        category.setDescription(categoryDto.getDescription());
        
        Category savedCategory = categoryRepository.save(category);
        return ResponseEntity.ok(convertToDto(savedCategory));
    }

    // Update category
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryDto> updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryDto categoryDto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        
        // Check if name already exists and is not the current category
        if (!category.getName().equals(categoryDto.getName()) && categoryRepository.existsByName(categoryDto.getName())) {
            return ResponseEntity.badRequest().build();
        }
        
        category.setName(categoryDto.getName());
        category.setDescription(categoryDto.getDescription());
        
        Category updatedCategory = categoryRepository.save(category);
        return ResponseEntity.ok(convertToDto(updatedCategory));
    }

    // Delete category
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        
        categoryRepository.delete(category);
        return ResponseEntity.ok().build();
    }

    // Convert entity to DTO
    private CategoryDto convertToDto(Category category) {
        CategoryDto dto = new CategoryDto();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        return dto;
    }
}
