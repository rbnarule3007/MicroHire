package com.freelancerconnect.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "otp_verifications")
public class OtpVerification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String otp;
    private String role; // CLIENT or FREELANCER

    // Temporary storage for other details until verification
    private String fullName;
    private String username;
    private String password;
    private String mobileNo;
    private boolean termsAccepted;

    private LocalDateTime expiryTime;
}
