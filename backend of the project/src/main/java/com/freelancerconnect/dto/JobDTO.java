package com.freelancerconnect.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class JobDTO {
    private Long id;
    private String title;
    private String description;
    private Double budget;
    private String deadline;
    private java.time.LocalDate completionDate;
    private Long clientId;
    private String clientName;
    private String clientEmail;
    private Long freelancerId;
    private String freelancerName;
    private String freelancerEmail;
    private String requiredSkills;
    private String status;
    private String category;
    private String experienceLevel;
    private LocalDateTime createdAt;
    private boolean isActive;
    private Integer progress;
    private String lastUpdateMessage;

    // Match percentage for freelancer view
    private Double matchPercentage;
}
