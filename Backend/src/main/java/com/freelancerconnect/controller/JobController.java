package com.freelancerconnect.controller;

import com.freelancerconnect.entity.Job;
import com.freelancerconnect.repository.JobRepository;
import com.freelancerconnect.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "http://localhost:5173")
public class JobController {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private JobService jobService;

    @Autowired
    private com.freelancerconnect.service.NotificationService notificationService;

    @Autowired
    private com.freelancerconnect.repository.FreelancerRepository freelancerRepository;

    @GetMapping("/recommended/{freelancerId}")
    public List<Job> getRecommendedJobs(@PathVariable Long freelancerId) {
        return jobService.getRecommendedJobs(freelancerId);
    }

    // Post a new job
    @PostMapping("/post")
    public ResponseEntity<Job> postJob(@RequestBody Job job) {
        // Set default values if not provided
        if (job.getStatus() == null || job.getStatus().trim().isEmpty()) {
            job.setStatus("OPEN");
        }
        if (job.getCreatedAt() == null) {
            job.setCreatedAt(java.time.LocalDateTime.now());
        }

        // Save the job
        Job savedJob = jobRepository.save(job);

        // Return with 201 Created status
        return ResponseEntity.status(org.springframework.http.HttpStatus.CREATED).body(savedJob);
    }

    // Get all jobs for a specific client
    @GetMapping("/client/{clientId}")
    public List<Job> getClientJobs(@PathVariable Long clientId) {
        return jobRepository.findByClientIdAndIsActiveTrueAndIsDeletedFalse(clientId);
    }

    // Get all jobs (for freelancers to see) with match percentage
    @GetMapping("/all")
    public ResponseEntity<?> getAllJobs(@RequestParam(required = false) Long freelancerId) {
        // Only get active, non-deleted jobs
        List<Job> jobs = jobRepository.findByIsActiveTrueAndIsDeletedFalse();

        // If freelancerId is provided, calculate match percentage for each job
        if (freelancerId != null) {
            try {
                com.freelancerconnect.entity.Freelancer freelancer = freelancerRepository.findById(freelancerId)
                        .orElse(null);

                if (freelancer != null) {
                    List<com.freelancerconnect.dto.JobDTO> jobDTOs = jobs.stream()
                            .map(job -> {
                                com.freelancerconnect.dto.JobDTO dto = new com.freelancerconnect.dto.JobDTO();
                                dto.setId(job.getId());
                                dto.setTitle(job.getTitle());
                                dto.setDescription(job.getDescription());
                                dto.setBudget(job.getBudget());
                                dto.setDeadline(job.getDeadline());
                                dto.setCompletionDate(job.getCompletionDate());
                                dto.setClientId(job.getClientId());
                                dto.setClientName(job.getClientName());
                                dto.setClientEmail(job.getClientEmail());
                                dto.setFreelancerId(job.getFreelancerId());
                                dto.setFreelancerName(job.getFreelancerName());
                                dto.setFreelancerEmail(job.getFreelancerEmail());
                                dto.setRequiredSkills(job.getRequiredSkills());
                                dto.setStatus(job.getStatus());
                                dto.setCategory(job.getCategory());
                                dto.setExperienceLevel(job.getExperienceLevel());
                                dto.setCreatedAt(job.getCreatedAt());
                                dto.setActive(job.isActive());
                                dto.setProgress(job.getProgress());
                                dto.setLastUpdateMessage(job.getLastUpdateMessage());

                                // Calculate match percentage (ALWAYS calculated, range 0-100)
                                double matchPercentage = jobService.calculateMatchPercentage(freelancer, job);
                                dto.setMatchPercentage(matchPercentage);

                                return dto;
                            })
                            .collect(java.util.stream.Collectors.toList());

                    return ResponseEntity.ok(jobDTOs);
                }
            } catch (Exception e) {
                // If error, log and return jobs without match percentage
                System.err.println("Error calculating match percentage: " + e.getMessage());
                e.printStackTrace();
            }
        }

        // Return regular jobs if no freelancerId or error occurred
        return ResponseEntity.ok(jobs);
    }

    // Get jobs assigned to a specific freelancer
    @GetMapping("/freelancer/{freelancerId}")
    public List<Job> getFreelancerJobs(@PathVariable Long freelancerId) {
        return jobRepository.findByFreelancerId(freelancerId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getJobById(@PathVariable Long id,
            @RequestParam(required = false) Long freelancerId) {
        return jobRepository.findById(id)
                .map(job -> {
                    // If freelancerId is provided, return JobDTO with match percentage
                    if (freelancerId != null) {
                        try {
                            com.freelancerconnect.entity.Freelancer freelancer = freelancerRepository
                                    .findById(freelancerId).orElse(null);

                            if (freelancer != null) {
                                com.freelancerconnect.dto.JobDTO dto = new com.freelancerconnect.dto.JobDTO();
                                dto.setId(job.getId());
                                dto.setTitle(job.getTitle());
                                dto.setDescription(job.getDescription());
                                dto.setBudget(job.getBudget());
                                dto.setDeadline(job.getDeadline());
                                dto.setCompletionDate(job.getCompletionDate());
                                dto.setClientId(job.getClientId());
                                dto.setClientName(job.getClientName());
                                dto.setClientEmail(job.getClientEmail());
                                dto.setFreelancerId(job.getFreelancerId());
                                dto.setFreelancerName(job.getFreelancerName());
                                dto.setFreelancerEmail(job.getFreelancerEmail());
                                dto.setRequiredSkills(job.getRequiredSkills());
                                dto.setStatus(job.getStatus());
                                dto.setCategory(job.getCategory());
                                dto.setExperienceLevel(job.getExperienceLevel());
                                dto.setCreatedAt(job.getCreatedAt());
                                dto.setActive(job.isActive());
                                dto.setProgress(job.getProgress());
                                dto.setLastUpdateMessage(job.getLastUpdateMessage());

                                // Calculate match percentage
                                double matchPercentage = jobService.calculateMatchPercentage(freelancer, job);
                                dto.setMatchPercentage(matchPercentage);

                                return ResponseEntity.ok(dto);
                            }
                        } catch (Exception e) {
                            System.err.println("Error calculating match percentage: " + e.getMessage());
                        }
                    }

                    // Return regular job if no freelancerId or error
                    return ResponseEntity.ok(job);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Mark job as completed
    @PostMapping("/{jobId}/complete")
    public ResponseEntity<?> markJobCompleted(@PathVariable Long jobId) {
        try {
            return jobRepository.findById(jobId).map(job -> {
                job.setStatus("COMPLETED");
                job.setProgress(100);
                job.setLastUpdateMessage("Project completed successfully!");
                Job updatedJob = jobRepository.save(job);

                // Notify client
                notificationService.createNotification(job.getClientId(), "CLIENT",
                        "Project '" + job.getTitle() + "' has been marked as COMPLETED by the freelancer.",
                        "COMPLETED");

                return ResponseEntity.ok(new java.util.HashMap<String, Object>() {
                    {
                        put("success", true);
                        put("message", "Job marked as completed");
                        put("job", updatedJob);
                    }
                });
            }).orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new java.util.HashMap<String, Object>() {
                {
                    put("success", false);
                    put("message", "Failed to mark job as completed: " + e.getMessage());
                }
            });
        }
    }

    // Update job details
    @PutMapping("/{id}")
    public ResponseEntity<Job> updateJob(@PathVariable Long id, @RequestBody Job jobDetails) {
        return jobRepository.findById(id)
                .map(job -> {
                    // Update fields
                    if (jobDetails.getTitle() != null)
                        job.setTitle(jobDetails.getTitle());
                    if (jobDetails.getDescription() != null)
                        job.setDescription(jobDetails.getDescription());
                    if (jobDetails.getBudget() != null)
                        job.setBudget(jobDetails.getBudget());
                    if (jobDetails.getDeadline() != null)
                        job.setDeadline(jobDetails.getDeadline());
                    if (jobDetails.getCompletionDate() != null)
                        job.setCompletionDate(jobDetails.getCompletionDate());
                    if (jobDetails.getRequiredSkills() != null)
                        job.setRequiredSkills(jobDetails.getRequiredSkills());
                    if (jobDetails.getCategory() != null)
                        job.setCategory(jobDetails.getCategory());
                    if (jobDetails.getExperienceLevel() != null)
                        job.setExperienceLevel(jobDetails.getExperienceLevel());

                    Job updatedJob = jobRepository.save(job);
                    return ResponseEntity.ok(updatedJob);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Close a job (set status to CLOSED)
    @PatchMapping("/{id}/close")
    public ResponseEntity<Job> closeJob(@PathVariable Long id) {
        return jobRepository.findById(id)
                .map(job -> {
                    job.setStatus("CLOSED");
                    job.setActive(false);
                    Job closedJob = jobRepository.save(job);
                    return ResponseEntity.ok(closedJob);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete a job (soft delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable Long id) {
        return jobRepository.findById(id)
                .map(job -> {
                    job.setDeleted(true);
                    job.setActive(false);
                    jobRepository.save(job);
                    return ResponseEntity.ok().body("Job deleted successfully");
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Update progress
    @PatchMapping("/{id}/progress")
    public ResponseEntity<?> updateProgress(@PathVariable Long id, @RequestBody java.util.Map<String, Object> updates) {
        return jobRepository.findById(id).map(job -> {
            if (updates.containsKey("progress")) {
                job.setProgress((Integer) updates.get("progress"));
            }
            if (updates.containsKey("lastUpdateMessage")) {
                job.setLastUpdateMessage((String) updates.get("lastUpdateMessage"));
            }
            Job saved = jobRepository.save(job);

            // Notify client of progress update
            notificationService.createNotification(job.getClientId(), "CLIENT",
                    "Progress update for '" + job.getTitle() + "' : " + job.getProgress() + "% - "
                            + job.getLastUpdateMessage(),
                    "PROGRESS_UPDATE");

            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }
}
