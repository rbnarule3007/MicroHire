package com.freelancerconnect.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "freelancer_certifications")
public class FreelancerCertification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long freelancerId;
    private String name;
    private String issuer;
    private String link;
}
