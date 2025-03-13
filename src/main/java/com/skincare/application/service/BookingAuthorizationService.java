
package com.skincare.application.service;

import com.skincare.application.model.Booking;
import com.skincare.application.model.Customer;
import com.skincare.application.model.User;
import com.skincare.application.repository.BookingRepository;
import com.skincare.application.repository.CustomerRepository;
import com.skincare.application.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class BookingAuthorizationService {
    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private UserRepository userRepository;

    public boolean isOwner(Long bookingId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        // Get the user
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (!userOpt.isPresent()) {
            return false;
        }
        
        // Get the customer
        Optional<Customer> customerOpt = customerRepository.findByUser(userOpt.get());
        if (!customerOpt.isPresent()) {
            return false;
        }
        
        // Get the booking
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (!bookingOpt.isPresent()) {
            return false;
        }
        
        // Check if the customer is the owner of the booking
        return bookingOpt.get().getCustomer().getId().equals(customerOpt.get().getId());
    }
}
