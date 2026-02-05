package com.freelancerconnect.repository;

import com.freelancerconnect.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    // Find all jobs posted by a specific client
    List<Job> findByClientId(Long clientId);

    // Find all jobs assigned to a specific freelancer
    List<Job> findByFreelancerId(Long freelancerId);

    List<Job> findByClientIdAndStatusIn(Long clientId, List<String> statuses);

    // Find only active, non-deleted jobs
    List<Job> findByIsActiveTrueAndIsDeletedFalse();

    // Find active jobs by client
    List<Job> findByClientIdAndIsActiveTrueAndIsDeletedFalse(Long clientId);
}
