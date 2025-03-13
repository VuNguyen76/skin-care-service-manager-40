
package com.skincare.application.controller;

import com.skincare.application.dto.CustomerQuizResultDto;
import com.skincare.application.dto.QuizOptionDto;
import com.skincare.application.dto.QuizQuestionDto;
import com.skincare.application.dto.ServiceDto;
import com.skincare.application.exception.ResourceNotFoundException;
import com.skincare.application.model.*;
import com.skincare.application.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/quiz")
public class QuizController {
    @Autowired
    private QuizQuestionRepository questionRepository;

    @Autowired
    private QuizOptionRepository optionRepository;

    @Autowired
    private CustomerQuizResultRepository resultRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    // Get all active quiz questions
    @GetMapping("/questions")
    public List<QuizQuestionDto> getAllActiveQuestions() {
        List<QuizQuestion> questions = questionRepository.findByIsActiveTrue();
        return questions.stream()
                .map(this::convertQuestionToDto)
                .collect(Collectors.toList());
    }

    // Get quiz question by id
    @GetMapping("/questions/{id}")
    public ResponseEntity<QuizQuestionDto> getQuestionById(@PathVariable Long id) {
        QuizQuestion question = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + id));
        
        return ResponseEntity.ok(convertQuestionToDto(question));
    }

    // Create quiz question (admin only)
    @PostMapping("/questions")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<QuizQuestionDto> createQuestion(@Valid @RequestBody QuizQuestionDto questionDto) {
        QuizQuestion question = new QuizQuestion();
        question.setQuestion(questionDto.getQuestion());
        question.setQuestionType(questionDto.getQuestionType());
        question.setIsActive(questionDto.getIsActive());
        
        QuizQuestion savedQuestion = questionRepository.save(question);
        
        // Add recommended services if provided
        if (questionDto.getRecommendedServices() != null) {
            Set<Service> services = new HashSet<>();
            for (ServiceDto serviceDto : questionDto.getRecommendedServices()) {
                Service service = serviceRepository.findById(serviceDto.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + serviceDto.getId()));
                services.add(service);
            }
            savedQuestion.setRecommendedServices(services);
            savedQuestion = questionRepository.save(savedQuestion);
        }
        
        return ResponseEntity.ok(convertQuestionToDto(savedQuestion));
    }

    // Update quiz question
    @PutMapping("/questions/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<QuizQuestionDto> updateQuestion(@PathVariable Long id, @Valid @RequestBody QuizQuestionDto questionDto) {
        QuizQuestion question = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + id));
        
        question.setQuestion(questionDto.getQuestion());
        question.setQuestionType(questionDto.getQuestionType());
        question.setIsActive(questionDto.getIsActive());
        
        // Update recommended services
        if (questionDto.getRecommendedServices() != null) {
            Set<Service> services = new HashSet<>();
            for (ServiceDto serviceDto : questionDto.getRecommendedServices()) {
                Service service = serviceRepository.findById(serviceDto.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + serviceDto.getId()));
                services.add(service);
            }
            question.setRecommendedServices(services);
        }
        
        QuizQuestion updatedQuestion = questionRepository.save(question);
        return ResponseEntity.ok(convertQuestionToDto(updatedQuestion));
    }

    // Add option to question
    @PostMapping("/questions/{questionId}/options")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<QuizOptionDto> addOptionToQuestion(
            @PathVariable Long questionId,
            @Valid @RequestBody QuizOptionDto optionDto) {
        
        QuizQuestion question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + questionId));
        
        QuizOption option = new QuizOption();
        option.setQuestion(question);
        option.setOptionText(optionDto.getOptionText());
        
        // Add recommended services if provided
        if (optionDto.getRecommendedServices() != null) {
            Set<Service> services = new HashSet<>();
            for (ServiceDto serviceDto : optionDto.getRecommendedServices()) {
                Service service = serviceRepository.findById(serviceDto.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + serviceDto.getId()));
                services.add(service);
            }
            option.setRecommendedServices(services);
        }
        
        QuizOption savedOption = optionRepository.save(option);
        return ResponseEntity.ok(convertOptionToDto(savedOption));
    }

    // Submit quiz answers
    @PostMapping("/submit")
    public ResponseEntity<?> submitQuizAnswers(@Valid @RequestBody List<CustomerQuizResultDto> resultsDto) {
        List<CustomerQuizResult> savedResults = new ArrayList<>();
        
        // Get current customer if authenticated
        Customer customer = null;
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && !authentication.getName().equals("anonymousUser")) {
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
            customer = customerRepository.findByUser(user).orElse(null);
        }
        
        // Process each answer
        for (CustomerQuizResultDto resultDto : resultsDto) {
            QuizQuestion question = questionRepository.findById(resultDto.getQuestionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + resultDto.getQuestionId()));
            
            CustomerQuizResult result = new CustomerQuizResult();
            result.setCustomer(customer);
            result.setQuestion(question);
            
            // For option-based questions
            if (resultDto.getOptionId() != null) {
                QuizOption option = optionRepository.findById(resultDto.getOptionId())
                        .orElseThrow(() -> new ResourceNotFoundException("Option not found with id: " + resultDto.getOptionId()));
                result.setSelectedOption(option);
            }
            
            // For text questions
            if (resultDto.getTextAnswer() != null) {
                result.setTextAnswer(resultDto.getTextAnswer());
            }
            
            savedResults.add(resultRepository.save(result));
        }
        
        // Generate service recommendations based on answers
        Set<Service> recommendedServices = new HashSet<>();
        
        for (CustomerQuizResult result : savedResults) {
            // Add services recommended by the question
            if (result.getQuestion().getRecommendedServices() != null) {
                recommendedServices.addAll(result.getQuestion().getRecommendedServices());
            }
            
            // Add services recommended by the selected option
            if (result.getSelectedOption() != null && result.getSelectedOption().getRecommendedServices() != null) {
                recommendedServices.addAll(result.getSelectedOption().getRecommendedServices());
            }
        }
        
        // Convert to DTOs
        List<ServiceDto> recommendationDtos = recommendedServices.stream()
                .map(service -> {
                    ServiceDto dto = new ServiceDto();
                    dto.setId(service.getId());
                    dto.setName(service.getName());
                    dto.setDescription(service.getDescription());
                    dto.setPrice(service.getPrice());
                    dto.setDurationMinutes(service.getDurationMinutes());
                    dto.setIsActive(service.getIsActive());
                    dto.setImageUrl(service.getImageUrl());
                    return dto;
                })
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(recommendationDtos);
    }

    // Get customer's quiz results
    @GetMapping("/results")
    @PreAuthorize("hasRole('CUSTOMER')")
    public List<CustomerQuizResultDto> getCurrentCustomerResults() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        
        Customer customer = customerRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Customer profile not found for user: " + username));
        
        List<CustomerQuizResult> results = resultRepository.findByCustomer(customer);
        
        return results.stream()
                .map(this::convertResultToDto)
                .collect(Collectors.toList());
    }

    // Convert question entity to DTO
    private QuizQuestionDto convertQuestionToDto(QuizQuestion question) {
        QuizQuestionDto dto = new QuizQuestionDto();
        dto.setId(question.getId());
        dto.setQuestion(question.getQuestion());
        dto.setQuestionType(question.getQuestionType());
        dto.setIsActive(question.getIsActive());
        
        // Convert options
        List<QuizOption> options = optionRepository.findByQuestion(question);
        if (!options.isEmpty()) {
            dto.setOptions(options.stream()
                    .map(this::convertOptionToDto)
                    .collect(Collectors.toList()));
        }
        
        // Convert recommended services
        if (question.getRecommendedServices() != null) {
            dto.setRecommendedServices(question.getRecommendedServices().stream()
                    .map(service -> {
                        ServiceDto serviceDto = new ServiceDto();
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

    // Convert option entity to DTO
    private QuizOptionDto convertOptionToDto(QuizOption option) {
        QuizOptionDto dto = new QuizOptionDto();
        dto.setId(option.getId());
        dto.setQuestionId(option.getQuestion().getId());
        dto.setOptionText(option.getOptionText());
        
        // Convert recommended services
        if (option.getRecommendedServices() != null) {
            dto.setRecommendedServices(option.getRecommendedServices().stream()
                    .map(service -> {
                        ServiceDto serviceDto = new ServiceDto();
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

    // Convert result entity to DTO
    private CustomerQuizResultDto convertResultToDto(CustomerQuizResult result) {
        CustomerQuizResultDto dto = new CustomerQuizResultDto();
        dto.setId(result.getId());
        dto.setCustomerId(result.getCustomer() != null ? result.getCustomer().getId() : null);
        dto.setQuestionId(result.getQuestion().getId());
        dto.setOptionId(result.getSelectedOption() != null ? result.getSelectedOption().getId() : null);
        dto.setTextAnswer(result.getTextAnswer());
        return dto;
    }
}
