package com.freelancerconnect.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class FreelancerProfileDTO {
    private Long id;
    private String fullName;
    private String email;
    private String username;
    private String mobileNo;
    private String skills;
    private String bio;
    private String title;
    private String location;
    private String category;
    private String experienceLevel;
    private String experienceYears;
    private String education;
    private String profileImage;
    private Double avgRating;
    private Integer profileCompleteness;
    private LocalDateTime createdAt;

    // Related data
    private List<ProjectDTO> projects;
    private List<CertificationDTO> certifications;

    @Data
    public static class ProjectDTO {
        private Long id;
        private String title;
        private String description;
        private String link;
        private String attachmentUrl;
    }

    @Data
    public static class CertificationDTO {
        private Long id;
        private String name;
        private String issuer;
        private String link;
    }
}
