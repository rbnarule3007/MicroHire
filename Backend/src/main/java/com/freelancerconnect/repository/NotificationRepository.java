package com.freelancerconnect.repository;

import com.freelancerconnect.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdAndUserRoleOrderByCreatedAtDesc(Long userId, String userRole);
}
