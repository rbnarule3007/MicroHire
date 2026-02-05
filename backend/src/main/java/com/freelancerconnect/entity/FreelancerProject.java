package com.freelancerconnect.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "freelancer_projects")
public class FreelancerProject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long freelancerId;
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String link;
    private String attachmentUrl;
}
