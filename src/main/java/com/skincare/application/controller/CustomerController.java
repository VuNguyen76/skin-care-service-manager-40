
package com.skincare.application.controller;

import com.skincare.application.dto.CustomerDto;
import com.skincare.application.exception.ResourceNotFoundException;
import com.skincare.application.model.Customer;
import com.skincare.application.model.User;
import com.skincare.application.repository.CustomerRepository;
import com.skincare.application.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/customers")
public class CustomerController {
    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private UserRepository userRepository;

    // Get all customers (admin only)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<CustomerDto> getAllCustomers() {
        List<Customer> customers = customerRepository.findAll();
        return customers.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // Get customer by id
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF') or @customerAuthorizationService.isOwner(#id)")
    public ResponseEntity<CustomerDto> getCustomerById(@PathVariable Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
        
        return ResponseEntity.ok(convertToDto(customer));
    }

    // Get current customer profile
    @GetMapping("/me")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<CustomerDto> getCurrentCustomer() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        
        Customer customer = customerRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Customer profile not found for user: " + username));
        
        return ResponseEntity.ok(convertToDto(customer));
    }

    // Create customer profile (for users with ROLE_CUSTOMER)
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER')")
    public ResponseEntity<CustomerDto> createCustomer(@Valid @RequestBody CustomerDto customerDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        
        // Check if customer profile already exists
        if (customerRepository.findByUser(user).isPresent()) {
            throw new RuntimeException("Customer profile already exists for this user");
        }
        
        Customer customer = new Customer();
        customer.setUser(user);
        updateCustomerFromDto(customer, customerDto);
        
        Customer savedCustomer = customerRepository.save(customer);
        return ResponseEntity.ok(convertToDto(savedCustomer));
    }

    // Update customer
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @customerAuthorizationService.isOwner(#id)")
    public ResponseEntity<CustomerDto> updateCustomer(@PathVariable Long id, @Valid @RequestBody CustomerDto customerDto) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
        
        updateCustomerFromDto(customer, customerDto);
        Customer updatedCustomer = customerRepository.save(customer);
        
        return ResponseEntity.ok(convertToDto(updatedCustomer));
    }

    // Convert entity to DTO
    private CustomerDto convertToDto(Customer customer) {
        CustomerDto dto = new CustomerDto();
        dto.setId(customer.getId());
        
        // Set user data
        com.skincare.application.dto.UserDto userDto = new com.skincare.application.dto.UserDto();
        userDto.setId(customer.getUser().getId());
        userDto.setUsername(customer.getUser().getUsername());
        userDto.setEmail(customer.getUser().getEmail());
        userDto.setFullName(customer.getUser().getFullName());
        userDto.setPhoneNumber(customer.getUser().getPhoneNumber());
        userDto.setAddress(customer.getUser().getAddress());
        dto.setUser(userDto);
        
        dto.setSkinType(customer.getSkinType());
        dto.setSkinConcerns(customer.getSkinConcerns());
        dto.setAllergies(customer.getAllergies());
        dto.setMedicalHistory(customer.getMedicalHistory());
        
        return dto;
    }

    // Update entity from DTO
    private void updateCustomerFromDto(Customer customer, CustomerDto dto) {
        customer.setSkinType(dto.getSkinType());
        customer.setSkinConcerns(dto.getSkinConcerns());
        customer.setAllergies(dto.getAllergies());
        customer.setMedicalHistory(dto.getMedicalHistory());
    }
}
