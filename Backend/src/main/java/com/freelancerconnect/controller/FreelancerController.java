package com.freelancerconnect.controller;

import com.freelancerconnect.entity.Freelancer;
import com.freelancerconnect.repository.FreelancerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/freelancers")
@CrossOrigin(origins = "http://localhost:5173")
public class FreelancerController {

    @Autowired
    private FreelancerRepository freelancerRepository;

    @Autowired
    private com.freelancerconnect.repository.FreelancerProjectRepository projectRepository;

    @Autowired
    private com.freelancerconnect.repository.FreelancerCertificationRepository certificationRepository;

    @PutMapping("/{id}")
    public ResponseEntity<?> updateFreelancer(@PathVariable Long id, @RequestBody Freelancer updatedFreelancer) {
        return freelancerRepository.findById(id).map(freelancer -> {
            if (updatedFreelancer.getFullName() != null) {
                freelancer.setFullName(updatedFreelancer.getFullName());
            }
            if (updatedFreelancer.getSkills() != null) {
                freelancer.setSkills(updatedFreelancer.getSkills());
            }
            if (updatedFreelancer.getBio() != null) {
                freelancer.setBio(updatedFreelancer.getBio());
            }
            if (updatedFreelancer.getLocation() != null) {
                freelancer.setLocation(updatedFreelancer.getLocation());
            }
            if (updatedFreelancer.getCategory() != null) {
                freelancer.setCategory(updatedFreelancer.getCategory());
            }
            if (updatedFreelancer.getEducation() != null) {
                freelancer.setEducation(updatedFreelancer.getEducation());
            }
            if (updatedFreelancer.getProfileImage() != null) {
                freelancer.setProfileImage(updatedFreelancer.getProfileImage());
            }
            freelancerRepository.save(freelancer);
            return ResponseEntity.ok(freelancer);
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Freelancer> getFreelancer(@PathVariable Long id) {
        return freelancerRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get detailed freelancer profile with projects and certifications
     * Used by clients to view applicant profiles
     */
    @GetMapping("/{id}/profile")
    public ResponseEntity<com.freelancerconnect.dto.FreelancerProfileDTO> getFreelancerProfile(@PathVariable Long id) {
        return freelancerRepository.findById(id).map(freelancer -> {
            com.freelancerconnect.dto.FreelancerProfileDTO profileDTO = new com.freelancerconnect.dto.FreelancerProfileDTO();

            // Basic info
            profileDTO.setId(freelancer.getId());
            profileDTO.setFullName(freelancer.getFullName());
            profileDTO.setEmail(freelancer.getEmail());
            profileDTO.setUsername(freelancer.getUsername());
            profileDTO.setMobileNo(freelancer.getMobileNo());
            profileDTO.setSkills(freelancer.getSkills());
            profileDTO.setBio(freelancer.getBio());
            profileDTO.setTitle(freelancer.getTitle());
            profileDTO.setLocation(freelancer.getLocation());
            profileDTO.setCategory(freelancer.getCategory());
            profileDTO.setExperienceLevel(freelancer.getExperienceLevel());
            profileDTO.setExperienceYears(freelancer.getExperienceYears());
            profileDTO.setEducation(freelancer.getEducation());
            // Hourly rate removed
            profileDTO.setProfileImage(freelancer.getProfileImage());
            profileDTO.setAvgRating(freelancer.getAvgRating());
            profileDTO.setProfileCompleteness(freelancer.getProfileCompleteness());
            profileDTO.setCreatedAt(freelancer.getCreatedAt());

            // Get projects
            java.util.List<com.freelancerconnect.dto.FreelancerProfileDTO.ProjectDTO> projects = projectRepository
                    .findByFreelancerId(id).stream()
                    .map(p -> {
                        com.freelancerconnect.dto.FreelancerProfileDTO.ProjectDTO dto = new com.freelancerconnect.dto.FreelancerProfileDTO.ProjectDTO();
                        dto.setId(p.getId());
                        dto.setTitle(p.getTitle());
                        dto.setDescription(p.getDescription());
                        dto.setLink(p.getLink());
                        dto.setAttachmentUrl(p.getAttachmentUrl());
                        return dto;
                    })
                    .collect(java.util.stream.Collectors.toList());
            profileDTO.setProjects(projects);

            // Get certifications
            java.util.List<com.freelancerconnect.dto.FreelancerProfileDTO.CertificationDTO> certifications = certificationRepository
                    .findByFreelancerId(id).stream()
                    .map(c -> {
                        com.freelancerconnect.dto.FreelancerProfileDTO.CertificationDTO dto = new com.freelancerconnect.dto.FreelancerProfileDTO.CertificationDTO();
                        dto.setId(c.getId());
                        dto.setName(c.getName());
                        dto.setIssuer(c.getIssuer());
                        dto.setLink(c.getLink());
                        return dto;
                    })
                    .collect(java.util.stream.Collectors.toList());
            profileDTO.setCertifications(certifications);

            return ResponseEntity.ok(profileDTO);
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/all")
    public java.util.List<Freelancer> getAllFreelancers() {
        return freelancerRepository.findAll();
    }

    @PostMapping("/onboarding")
    public ResponseEntity<?> onboarding(@RequestBody com.freelancerconnect.dto.FreelancerOnboardingRequest request) {
        try {
            if (request.getFreelancerId() == null) {
                return ResponseEntity.badRequest().body("Freelancer ID is required");
            }

            return freelancerRepository.findById(request.getFreelancerId()).map(freelancer -> {
                freelancer.setFullName(request.getDisplayName());
                freelancer.setTitle(request.getTitle());
                freelancer.setBio(request.getBio());

                if (request.getSkills() != null) {
                    freelancer.setSkills(String.join(", ", request.getSkills()));
                }

                freelancer.setExperienceYears(request.getExperienceYears());
                freelancer.setEducation(request.getEducation());
                freelancer.setLocation(request.getLocation());
                freelancer.setProfileCompleteness(100);
                freelancer.setUpdatedAt(java.time.LocalDateTime.now());

                freelancerRepository.save(freelancer);

                // Save projects
                if (request.getProjects() != null) {
                    request.getProjects().forEach(p -> {
                        com.freelancerconnect.entity.FreelancerProject project = new com.freelancerconnect.entity.FreelancerProject();
                        project.setFreelancerId(freelancer.getId());
                        project.setTitle(p.getTitle());
                        project.setDescription(p.getDescription());
                        project.setLink(p.getLink());
                        project.setAttachmentUrl(p.getAttachmentUrl());
                        projectRepository.save(project);
                    });
                }

                // Save certifications
                if (request.getCertifications() != null) {
                    request.getCertifications().forEach(c -> {
                        com.freelancerconnect.entity.FreelancerCertification cert = new com.freelancerconnect.entity.FreelancerCertification();
                        cert.setFreelancerId(freelancer.getId());
                        cert.setName(c.getName());
                        cert.setIssuer(c.getIssuer());
                        cert.setLink(c.getLink());
                        certificationRepository.save(cert);
                    });
                }

                return ResponseEntity.ok("Onboarding completed successfully!");
            }).orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error saving profile: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/certifications")
    public ResponseEntity<?> addCertification(@PathVariable Long id,
            @RequestBody com.freelancerconnect.entity.FreelancerCertification cert) {
        return freelancerRepository.findById(id).map(freelancer -> {
            cert.setFreelancerId(id);
            com.freelancerconnect.entity.FreelancerCertification saved = certificationRepository.save(cert);
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}/certifications/{certId}")
    public ResponseEntity<?> deleteCertification(@PathVariable Long id, @PathVariable Long certId) {
        return certificationRepository.findById(certId).map(cert -> {
            if (!cert.getFreelancerId().equals(id)) {
                return ResponseEntity.status(403).build();
            }
            certificationRepository.delete(cert);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/projects")
    public ResponseEntity<?> addProject(@PathVariable Long id,
            @RequestBody com.freelancerconnect.entity.FreelancerProject project) {
        return freelancerRepository.findById(id).map(freelancer -> {
            project.setFreelancerId(id);
            com.freelancerconnect.entity.FreelancerProject saved = projectRepository.save(project);
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}/projects/{projectId}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id, @PathVariable Long projectId) {
        return projectRepository.findById(projectId).map(project -> {
            if (!project.getFreelancerId().equals(id)) {
                return ResponseEntity.status(403).build();
            }
            projectRepository.delete(project);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/projects/{projectId}")
    public ResponseEntity<?> updateProject(@PathVariable Long id, @PathVariable Long projectId,
            @RequestBody com.freelancerconnect.entity.FreelancerProject updatedProject) {
        return projectRepository.findById(projectId).map(project -> {
            if (!project.getFreelancerId().equals(id)) {
                return ResponseEntity.status(403).build();
            }
            if (updatedProject.getTitle() != null)
                project.setTitle(updatedProject.getTitle());
            if (updatedProject.getDescription() != null)
                project.setDescription(updatedProject.getDescription());
            if (updatedProject.getLink() != null)
                project.setLink(updatedProject.getLink());
            if (updatedProject.getAttachmentUrl() != null)
                project.setAttachmentUrl(updatedProject.getAttachmentUrl());
            projectRepository.save(project);
            return ResponseEntity.ok(project);
        }).orElse(ResponseEntity.notFound().build());
    }
}
