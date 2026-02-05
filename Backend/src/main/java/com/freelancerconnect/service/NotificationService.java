package com.freelancerconnect.service;

import com.freelancerconnect.entity.Notification;
import com.freelancerconnect.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public void createNotification(Long userId, String userRole, String message) {
        createNotification(userId, userRole, message, "INFO");
    }

    public void createNotification(Long userId, String userRole, String message, String status) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setUserRole(userRole);
        notification.setMessage(message);
        notification.setStatus(status);
        notificationRepository.save(notification);
    }

    public List<Notification> getUserNotifications(Long userId, String userRole) {
        return notificationRepository.findByUserIdAndUserRoleOrderByCreatedAtDesc(userId, userRole);
    }

    public void markAllAsRead(Long userId, String userRole) {
        List<Notification> notifications = notificationRepository.findByUserIdAndUserRoleOrderByCreatedAtDesc(userId,
                userRole);
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }

    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }
}
