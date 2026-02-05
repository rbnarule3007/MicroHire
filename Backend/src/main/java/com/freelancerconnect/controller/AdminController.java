package com.freelancerconnect.controller;

import com.freelancerconnect.entity.Admin;
import com.freelancerconnect.entity.Client;
import com.freelancerconnect.entity.Freelancer;
import com.freelancerconnect.entity.Job;
import com.freelancerconnect.entity.Application;
import com.freelancerconnect.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private FreelancerRepository freelancerRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    // --- Stats ---
    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        long freelancers = freelancerRepository.count();
        long clients = clientRepository.count();
        long jobs = jobRepository.count();
        long applications = applicationRepository.count();
        return ResponseEntity.ok(Map.of(
                "totalFreelancers", freelancers,
                "totalClients", clients,
                "activeJobs", jobs,
                "totalApplications", applications));
    }

    @PutMapping("/profile/{id}")
    public ResponseEntity<?> updateAdmin(@PathVariable Long id, @RequestBody Admin details) {
        return adminRepository.findById(id).map(a -> {
            a.setFullName(details.getFullName());
            a.setMobileNo(details.getMobileNo());
            adminRepository.save(a);
            return ResponseEntity.ok(a);
        }).orElse(ResponseEntity.notFound().build());
    }

    // --- Freelancer Management ---
    @GetMapping("/freelancers")
    public List<Freelancer> getAllFreelancers() {
        return freelancerRepository.findAll();
    }

    @GetMapping("/freelancers/{id}")
    public ResponseEntity<Freelancer> getFreelancer(@PathVariable Long id) {
        return freelancerRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/freelancers/{id}")
    public ResponseEntity<?> updateFreelancer(@PathVariable Long id, @RequestBody Freelancer details) {
        return freelancerRepository.findById(id).map(f -> {
            f.setFullName(details.getFullName());
            f.setEmail(details.getEmail());
            f.setSkills(details.getSkills());
            f.setExperienceLevel(details.getExperienceLevel());
            f.setUpdatedAt(LocalDateTime.now());
            freelancerRepository.save(f);
            return ResponseEntity.ok(f);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/freelancers/{id}/status")
    public ResponseEntity<?> updateFreelancerStatus(@PathVariable Long id, @RequestBody Map<String, Boolean> status) {
        return freelancerRepository.findById(id).map(f -> {
            if (status.containsKey("isActive"))
                f.setActive(status.get("isActive"));
            if (status.containsKey("isDeleted"))
                f.setDeleted(status.get("isDeleted"));
            f.setUpdatedAt(LocalDateTime.now());
            freelancerRepository.save(f);
            return ResponseEntity.ok(f);
        }).orElse(ResponseEntity.notFound().build());
    }

    // --- Client Management ---
    @GetMapping("/clients")
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    @PutMapping("/clients/{id}")
    public ResponseEntity<?> updateClient(@PathVariable Long id, @RequestBody Client details) {
        return clientRepository.findById(id).map(c -> {
            c.setFullName(details.getFullName());
            c.setEmail(details.getEmail());
            c.setUpdatedAt(LocalDateTime.now());
            clientRepository.save(c);
            return ResponseEntity.ok(c);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/clients/{id}/status")
    public ResponseEntity<?> updateClientStatus(@PathVariable Long id, @RequestBody Map<String, Boolean> status) {
        return clientRepository.findById(id).map(c -> {
            if (status.containsKey("isActive"))
                c.setActive(status.get("isActive"));
            if (status.containsKey("isDeleted"))
                c.setDeleted(status.get("isDeleted"));
            c.setUpdatedAt(LocalDateTime.now());
            clientRepository.save(c);
            return ResponseEntity.ok(c);
        }).orElse(ResponseEntity.notFound().build());
    }

    // --- Job Management ---
    @GetMapping("/jobs")
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    @PutMapping("/jobs/{id}")
    public ResponseEntity<?> updateJob(@PathVariable Long id, @RequestBody Job details) {
        return jobRepository.findById(id).map(j -> {
            j.setTitle(details.getTitle());
            j.setDescription(details.getDescription());
            j.setBudget(details.getBudget());
            j.setDeadline(details.getDeadline());
            j.setRequiredSkills(details.getRequiredSkills());
            j.setCategory(details.getCategory());
            j.setExperienceLevel(details.getExperienceLevel());
            jobRepository.save(j);
            return ResponseEntity.ok(j);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/jobs/{id}/status")
    public ResponseEntity<?> updateJobStatus(@PathVariable Long id, @RequestBody Map<String, String> status) {
        return jobRepository.findById(id).map(j -> {
            if (status.containsKey("status"))
                j.setStatus(status.get("status"));
            jobRepository.save(j);
            return ResponseEntity.ok(j);
        }).orElse(ResponseEntity.notFound().build());
    }

    // --- Application Management ---
    @GetMapping("/applications")
    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }
}
