package com.freelancerconnect.repository;

import com.freelancerconnect.entity.SavedJob;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {
    List<SavedJob> findByFreelancerId(Long freelancerId);

    boolean existsByFreelancerIdAndJobId(Long freelancerId, Long jobId);

    void deleteByFreelancerIdAndJobId(Long freelancerId, Long jobId);
}
