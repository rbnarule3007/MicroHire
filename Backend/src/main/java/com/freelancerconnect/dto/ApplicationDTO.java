package com.freelancerconnect.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ApplicationDTO {
    private Long id;
    private Long jobId;
    private Long freelancerId;
    private String freelancerName;
    private String freelancerSkills;
    private String freelancerEmail;
    private String freelancerExperience;
    private String freelancerTitle;
    private Double freelancerRating;
    private String clientName;
    private String clientEmail;
    private Double matchPercentage;
    private String coverMessage;
    private String freelancerBio;
    private String jobTitle;
    private Double jobBudget;
    private Long clientId;
    private String status;
    private LocalDateTime appliedAt;
}
