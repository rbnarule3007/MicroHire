package com.freelancerconnect.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId; // Entity ID (Client or Freelancer)
    private String userRole; // ROLE_CLIENT or ROLE_FREELANCER
    private Long jobId;
    private String message;
    private String status; // Status related to the notification context (e.g., HIRED, SHORTLISTED)
    private boolean isRead = false;

    private LocalDateTime createdAt = LocalDateTime.now();
}
