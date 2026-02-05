package com.freelancerconnect.repository;

import com.freelancerconnect.entity.ConnectionRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ConnectionRequestRepository extends JpaRepository<ConnectionRequest, Long> {
    List<ConnectionRequest> findByFreelancerIdOrderByCreatedAtDesc(Long freelancerId);

    List<ConnectionRequest> findByClientIdOrderByCreatedAtDesc(Long clientId);
}
