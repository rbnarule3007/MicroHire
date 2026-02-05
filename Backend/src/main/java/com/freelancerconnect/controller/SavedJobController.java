package com.freelancerconnect.controller;

import com.freelancerconnect.service.SavedJobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/saved-jobs")
@CrossOrigin(origins = "http://localhost:5173")
public class SavedJobController {

    @Autowired
    private SavedJobService savedJobService;

    @PostMapping("/{freelancerId}/{jobId}")
    public ResponseEntity<?> saveJob(@PathVariable Long freelancerId, @PathVariable Long jobId) {
        try {
            savedJobService.saveJob(freelancerId, jobId);
            // Return structured JSON response
            return ResponseEntity.ok(new java.util.HashMap<String, Object>() {
                {
                    put("success", true);
                    put("message", "Job saved successfully");
                    put("freelancerId", freelancerId);
                    put("jobId", jobId);
                }
            });
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new java.util.HashMap<String, Object>() {
                {
                    put("success", false);
                    put("message", "Failed to save job: " + e.getMessage());
                }
            });
        }
    }

    @DeleteMapping("/{freelancerId}/{jobId}")
    public ResponseEntity<?> unsaveJob(@PathVariable Long freelancerId, @PathVariable Long jobId) {
        try {
            savedJobService.unsaveJob(freelancerId, jobId);
            // Return structured JSON response
            return ResponseEntity.ok(new java.util.HashMap<String, Object>() {
                {
                    put("success", true);
                    put("message", "Job removed from saved list");
                    put("freelancerId", freelancerId);
                    put("jobId", jobId);
                }
            });
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new java.util.HashMap<String, Object>() {
                {
                    put("success", false);
                    put("message", "Failed to remove saved job: " + e.getMessage());
                }
            });
        }
    }

    @GetMapping("/{freelancerId}")
    public ResponseEntity<?> getSavedJobs(@PathVariable Long freelancerId) {
        return ResponseEntity.ok(savedJobService.getSavedJobs(freelancerId));
    }
}
