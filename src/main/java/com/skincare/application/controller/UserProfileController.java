
package com.skincare.application.controller;

import com.skincare.application.dto.PasswordChangeRequest;
import com.skincare.application.dto.ProfileUpdateRequest;
import com.skincare.application.dto.UserDto;
import com.skincare.application.model.User;
import com.skincare.application.repository.UserRepository;
import com.skincare.application.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user")
public class UserProfileController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile() {
        User user = getCurrentUser();
        if (user == null) {
            return ResponseEntity.status(401).body("User not authenticated");
        }
        
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setUsername(user.getUsername());
        userDto.setEmail(user.getEmail());
        userDto.setFullName(user.getFullName());
        userDto.setPhoneNumber(user.getPhoneNumber());
        userDto.setAddress(user.getAddress());
        userDto.setAvatar(user.getAvatar());
        userDto.setDateOfBirth(user.getDateOfBirth());
        userDto.setIsActive(user.getIsActive());
        userDto.setRoles(user.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toSet()));
        
        return ResponseEntity.ok(userDto);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody ProfileUpdateRequest profileUpdateRequest) {
        User user = getCurrentUser();
        if (user == null) {
            return ResponseEntity.status(401).body("User not authenticated");
        }
        
        // Update user profile
        if (profileUpdateRequest.getFullName() != null) {
            user.setFullName(profileUpdateRequest.getFullName());
        }
        
        if (profileUpdateRequest.getPhoneNumber() != null) {
            user.setPhoneNumber(profileUpdateRequest.getPhoneNumber());
        }
        
        if (profileUpdateRequest.getAddress() != null) {
            user.setAddress(profileUpdateRequest.getAddress());
        }
        
        if (profileUpdateRequest.getDateOfBirth() != null) {
            try {
                user.setDateOfBirth(LocalDateTime.parse(
                        profileUpdateRequest.getDateOfBirth() + "T00:00:00", 
                        DateTimeFormatter.ISO_LOCAL_DATE_TIME
                ));
            } catch (Exception e) {
                return ResponseEntity.badRequest().body("Invalid date format");
            }
        }
        
        userRepository.save(user);
        
        return ResponseEntity.ok("Profile updated successfully");
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody PasswordChangeRequest passwordChangeRequest) {
        User user = getCurrentUser();
        if (user == null) {
            return ResponseEntity.status(401).body("User not authenticated");
        }
        
        // Verify current password
        if (!passwordEncoder.matches(passwordChangeRequest.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Current password is incorrect");
        }
        
        // Update password
        user.setPassword(passwordEncoder.encode(passwordChangeRequest.getNewPassword()));
        userRepository.save(user);
        
        return ResponseEntity.ok("Password changed successfully");
    }

    @PostMapping(value = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadAvatar(@RequestParam("avatar") MultipartFile file) {
        User user = getCurrentUser();
        if (user == null) {
            return ResponseEntity.status(401).body("User not authenticated");
        }
        
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Please select a file to upload");
        }
        
        try {
            // Create uploads directory if it doesn't exist
            String uploadsDir = "./uploads/avatars/";
            Path uploadPath = Paths.get(uploadsDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            // Generate unique filename
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(filename);
            
            // Save file
            Files.copy(file.getInputStream(), filePath);
            
            // Update user avatar
            user.setAvatar("/uploads/avatars/" + filename);
            userRepository.save(user);
            
            Map<String, String> response = new HashMap<>();
            response.put("avatar", user.getAvatar());
            
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to upload avatar: " + e.getMessage());
        }
    }
    
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = userDetails.getId();
        
        Optional<User> userOpt = userRepository.findById(userId);
        return userOpt.orElse(null);
    }
}
