package com.freelancerconnect.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "clients")
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;

    @Column(unique = true)
    private String email;

    private String username;

    private String password;
    private String mobileNo;
    private String profileImage;

    private boolean isVerified = false;
    private boolean termsAccepted = false;
    private String role = "CLIENT";
    private boolean isActive = true;
    private boolean isDeleted = false;
    private java.time.LocalDateTime createdAt = java.time.LocalDateTime.now();
    private java.time.LocalDateTime updatedAt = java.time.LocalDateTime.now();
    private Long updatedBy;
}
