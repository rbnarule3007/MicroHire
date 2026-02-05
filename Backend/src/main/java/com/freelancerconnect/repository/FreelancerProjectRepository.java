package com.freelancerconnect.repository;

import com.freelancerconnect.entity.FreelancerProject;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FreelancerProjectRepository extends JpaRepository<FreelancerProject, Long> {
    List<FreelancerProject> findByFreelancerId(Long freelancerId);
}
