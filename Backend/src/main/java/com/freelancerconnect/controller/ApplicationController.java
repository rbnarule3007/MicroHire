package com.freelancerconnect.controller;

import com.freelancerconnect.dto.ApplicationDTO;
import com.freelancerconnect.dto.ApplicationRequest;
import com.freelancerconnect.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:5173")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @PostMapping("/apply")
    public ResponseEntity<?> applyForJob(@RequestBody ApplicationRequest request) {
        try {
            applicationService.applyForJob(request);
            // Return structured JSON response with success details
            return ResponseEntity.ok(new java.util.HashMap<String, Object>() {
                {
                    put("success", true);
                    put("message", "Application submitted successfully!");
                    put("jobId", request.getJobId());
                    put("freelancerId", request.getFreelancerId());
                }
            });
        } catch (RuntimeException e) {
            // Return structured error response
            return ResponseEntity.badRequest().body(new java.util.HashMap<String, Object>() {
                {
                    put("success", false);
                    put("message", e.getMessage());
                }
            });
        }
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<ApplicationDTO>> getApplicationsForJob(@PathVariable Long jobId) {
        return ResponseEntity.ok(applicationService.getApplicationsForJob(jobId));
    }

    @GetMapping("/freelancer/{freelancerId}")
    public ResponseEntity<List<ApplicationDTO>> getFreelancerApplications(@PathVariable Long freelancerId) {
        return ResponseEntity.ok(applicationService.getApplicationsByFreelancer(freelancerId));
    }

    @PostMapping("/{id}/accept")
    public ResponseEntity<?> acceptApplication(@PathVariable Long id) {
        try {
            applicationService.acceptApplication(id);
            return ResponseEntity.ok(new java.util.HashMap<String, Object>() {
                {
                    put("success", true);
                    put("message", "Application accepted successfully!");
                    put("applicationId", id);
                }
            });
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new java.util.HashMap<String, Object>() {
                {
                    put("success", false);
                    put("message", e.getMessage());
                }
            });
        }
    }

    @PostMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            applicationService.updateApplicationStatus(id, status);
            return ResponseEntity.ok(new java.util.HashMap<String, Object>() {
                {
                    put("success", true);
                    put("message", "Status updated to " + status);
                    put("applicationId", id);
                    put("newStatus", status);
                }
            });
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new java.util.HashMap<String, Object>() {
                {
                    put("success", false);
                    put("message", e.getMessage());
                }
            });
        }
    }
}
