package com.freelancerconnect.repository;

import com.freelancerconnect.entity.FreelancerCertification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FreelancerCertificationRepository extends JpaRepository<FreelancerCertification, Long> {
    List<FreelancerCertification> findByFreelancerId(Long freelancerId);
}
