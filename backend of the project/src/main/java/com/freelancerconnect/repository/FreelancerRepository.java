package com.freelancerconnect.repository;

import com.freelancerconnect.entity.Freelancer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface FreelancerRepository extends JpaRepository<Freelancer, Long> {
    Optional<Freelancer> findByEmail(String email);

    Optional<Freelancer> findByUsername(String username);
}
