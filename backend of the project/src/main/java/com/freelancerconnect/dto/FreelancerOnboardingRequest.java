package com.freelancerconnect.dto;

import lombok.Data;
import java.util.List;

@Data
public class FreelancerOnboardingRequest {
    private Long freelancerId;
    private String displayName;
    private String title;
    private String bio;
    private List<String> skills;
    private String experienceYears;
    private String education;
    private String location;
    private List<ProjectDTO> projects;
    private List<CertificationDTO> certifications;

    @Data
    public static class ProjectDTO {
        private String title;
        private String description;
        private String link;
        private String attachmentUrl;
    }

    @Data
    public static class CertificationDTO {
        private String name;
        private String issuer;
        private String link;
    }
}
