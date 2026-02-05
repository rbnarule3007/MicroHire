package com.freelancerconnect.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "freelancers")
public class Freelancer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;

    @Column(unique = true)
    private String email;

    private String username;
    private String password;
    private String mobileNo;

    @Column(columnDefinition = "TEXT")
    private String skills;

    @Column(columnDefinition = "TEXT")
    private String bio;
    private String title;
    private String location;
    private String category;
    private String experienceLevel;
    private String experienceYears;
    private String education;
    private String profileImage;
    private Double avgRating = 0.0;
    private Integer profileCompleteness = 0; // percentage 0-100

    private boolean isVerified = false;
    private boolean termsAccepted = false;
    private String role = "FREELANCER";
    private boolean isActive = true;
    private boolean isDeleted = false;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
    private Long updatedBy;
}
