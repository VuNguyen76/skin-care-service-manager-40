
package com.skincare.application.service;

import com.skincare.application.model.Specialist;
import com.skincare.application.model.User;
import com.skincare.application.repository.SpecialistRepository;
import com.skincare.application.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class SpecialistAuthorizationService {
    @Autowired
    private SpecialistRepository specialistRepository;

    @Autowired
    private UserRepository userRepository;

    public boolean isOwner(Long specialistId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        // Get the user
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (!userOpt.isPresent()) {
            return false;
        }
        
        // Get the specialist
        Optional<Specialist> specialistOpt = specialistRepository.findByUser(userOpt.get());
        if (!specialistOpt.isPresent()) {
            return false;
        }
        
        // Check if the specialist is the owner
        return specialistOpt.get().getId().equals(specialistId);
    }
}
