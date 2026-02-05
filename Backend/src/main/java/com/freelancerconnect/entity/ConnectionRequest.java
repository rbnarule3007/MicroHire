package com.freelancerconnect.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "connection_requests")
public class ConnectionRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long clientId;
    private String clientName;
    private String clientEmail;
    private Long freelancerId;
    private String freelancerEmail;

    @Column(columnDefinition = "TEXT")
    private String message;

    private String status; // PENDING, ACCEPTED, REJECTED

    private LocalDateTime createdAt = LocalDateTime.now();
}
