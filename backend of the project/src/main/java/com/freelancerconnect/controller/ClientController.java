package com.freelancerconnect.controller;

import com.freelancerconnect.entity.Client;
import com.freelancerconnect.entity.Job;
import com.freelancerconnect.repository.ClientRepository;
import com.freelancerconnect.repository.JobRepository;
import com.freelancerconnect.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/clients")
@CrossOrigin(origins = "http://localhost:5173")
public class ClientController {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping("/{clientId}/stats")
    public ResponseEntity<?> getClientStats(@PathVariable Long clientId) {
        List<Job> allJobs = jobRepository.findByClientId(clientId);
        long activeJobs = allJobs.stream()
                .filter(j -> "OPEN".equalsIgnoreCase(j.getStatus()) || "IN_PROGRESS".equalsIgnoreCase(j.getStatus()))
                .count();
        long unreadNotifications = notificationRepository
                .findByUserIdAndUserRoleOrderByCreatedAtDesc(clientId, "CLIENT").stream()
                .filter(n -> !n.isRead()).count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("activeJobs", activeJobs);
        stats.put("unreadMessages", unreadNotifications); // Mapping notifications to "messages" for the UI
        stats.put("avgRating", 5.0); // Placeholder for now

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/{clientId}/recent-activity")
    public ResponseEntity<?> getRecentActivity(@PathVariable Long clientId) {
        return ResponseEntity
                .ok(notificationRepository.findByUserIdAndUserRoleOrderByCreatedAtDesc(clientId, "CLIENT"));
    }

    @GetMapping("/{clientId}/active-projects")
    public ResponseEntity<?> getActiveProjects(@PathVariable Long clientId) {
        List<String> activeStatuses = List.of("IN_PROGRESS", "REVIEW", "PENDING_COMPLETION");
        return ResponseEntity.ok(jobRepository.findByClientIdAndStatusIn(clientId, activeStatuses));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateClient(@PathVariable Long id, @RequestBody Client updatedClient) {
        return clientRepository.findById(id).map(client -> {
            if (updatedClient.getFullName() != null) {
                client.setFullName(updatedClient.getFullName());
            }
            if (updatedClient.getMobileNo() != null) {
                client.setMobileNo(updatedClient.getMobileNo());
            }
            if (updatedClient.getProfileImage() != null) {
                client.setProfileImage(updatedClient.getProfileImage());
            }
            clientRepository.save(client);
            return ResponseEntity.ok(client);
        }).orElse(ResponseEntity.notFound().build());
    }
}
