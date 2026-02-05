package com.freelancerconnect.dto;

import lombok.Data;

@Data
public class SignupRequest {
    private String fullName;
    private String email;
    private String username;
    private String password;
    private String mobileNo;
    private String role; // CLIENT or FREELANCER
    private boolean termsAccepted;
}
