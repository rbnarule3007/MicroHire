package com.freelancerconnect.controller;

import com.freelancerconnect.entity.ConnectionRequest;
import com.freelancerconnect.repository.ConnectionRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/connections")
@CrossOrigin(origins = "http://localhost:5173")
public class ConnectionRequestController {

    @Autowired
    private ConnectionRequestRepository repository;

    @Autowired
    private com.freelancerconnect.service.NotificationService notificationService;

    @PostMapping("/send")
    public ResponseEntity<?> sendRequest(@RequestBody ConnectionRequest request) {
        request.setStatus("PENDING");
        repository.save(request);

        // Notify freelancer
        notificationService.createNotification(request.getFreelancerId(), "FREELANCER",
                "New connection request from client: " + request.getClientName(), "CONNECTION");

        return ResponseEntity.ok("Connection request sent successfully!");
    }

    @GetMapping("/freelancer/{id}")
    public List<ConnectionRequest> getFreelancerRequests(@PathVariable Long id) {
        return repository.findByFreelancerIdOrderByCreatedAtDesc(id);
    }

    @PostMapping("/{id}/respond")
    public ResponseEntity<?> respondToRequest(@PathVariable Long id, @RequestParam String status) {
        return repository.findById(id).map(request -> {
            request.setStatus(status);
            repository.save(request);

            // Notify client
            String message = "Freelancer has " + status.toLowerCase() + " your connection request.";
            notificationService.createNotification(request.getClientId(), "CLIENT", message, status);

            return ResponseEntity.ok("Request " + status.toLowerCase());
        }).orElse(ResponseEntity.notFound().build());
    }
}
