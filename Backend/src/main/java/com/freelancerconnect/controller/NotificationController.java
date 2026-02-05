package com.freelancerconnect.controller;

import com.freelancerconnect.entity.Notification;
import com.freelancerconnect.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @PostMapping
    public ResponseEntity<?> createNotification(@RequestBody Notification notification) {
        notificationService.createNotification(notification.getUserId(), notification.getUserRole(),
                notification.getMessage(), notification.getStatus());
        return ResponseEntity.ok("Notification created");
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Notification>> getUserNotifications(@PathVariable Long userId,
            @RequestParam String role) {
        return ResponseEntity.ok(notificationService.getUserNotifications(userId, role));
    }

    @PostMapping("/{userId}/mark-read")
    public ResponseEntity<?> markAllAsRead(@PathVariable Long userId, @RequestParam String role) {
        notificationService.markAllAsRead(userId, role);
        return ResponseEntity.ok("All notifications marked as read");
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok("Notification marked as read");
    }
}
