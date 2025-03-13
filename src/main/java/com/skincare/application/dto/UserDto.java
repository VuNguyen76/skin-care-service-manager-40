
package com.skincare.application.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.Set;

@Data
public class UserDto {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String phoneNumber;
    private String address;
    private String avatar;
    private LocalDateTime dateOfBirth;
    private Boolean isActive;
    private Set<String> roles;
}
