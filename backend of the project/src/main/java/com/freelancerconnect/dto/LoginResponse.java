package com.freelancerconnect.dto;

import lombok.Data;

@Data
public class LoginResponse {
    private String message;
    private Long userId;
    private String role;
    private String fullName;
    private String email;
    private Integer profileCompleteness;

    public LoginResponse(String message, Long userId, String role, String fullName, String email,
            Integer profileCompleteness) {
        this.message = message;
        this.userId = userId;
        this.role = role;
        this.fullName = fullName;
        this.email = email;
        this.profileCompleteness = profileCompleteness;
    }
}
