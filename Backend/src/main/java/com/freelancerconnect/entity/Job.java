package com.freelancerconnect.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "jobs")
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Double budget;
    private String deadline;
    private java.time.LocalDate completionDate;

    // The client who posted the job
    private Long clientId;
    private String clientName;
    private String clientEmail;

    // The freelancer hired for the job
    @Column(name = "freelancer_id")
    private Long freelancerId;
    private String freelancerName;
    private String freelancerEmail;

    @Column(columnDefinition = "TEXT")
    private String requiredSkills;

    private String status = "OPEN"; // OPEN, IN_PROGRESS, COMPLETED
    private String category;
    private String experienceLevel; // BEGINNER, INTERMEDIATE, EXPERT

    // Progress Tracking
    private Integer progress = 0; // 0-100
    private String lastUpdateMessage;

    private LocalDateTime createdAt = LocalDateTime.now();
    private boolean isActive = true;
    private boolean isDeleted = false;
}
