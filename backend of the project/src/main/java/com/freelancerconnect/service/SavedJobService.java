package com.freelancerconnect.service;

import com.freelancerconnect.entity.Job;
import com.freelancerconnect.entity.SavedJob;
import com.freelancerconnect.repository.JobRepository;
import com.freelancerconnect.repository.SavedJobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SavedJobService {

    @Autowired
    private SavedJobRepository savedJobRepository;

    @Autowired
    private JobRepository jobRepository;

    public void saveJob(Long freelancerId, Long jobId) {
        if (!savedJobRepository.existsByFreelancerIdAndJobId(freelancerId, jobId)) {
            SavedJob savedJob = new SavedJob();
            savedJob.setFreelancerId(freelancerId);
            savedJob.setJobId(jobId);
            savedJobRepository.save(savedJob);
        }
    }

    @Transactional
    public void unsaveJob(Long freelancerId, Long jobId) {
        savedJobRepository.deleteByFreelancerIdAndJobId(freelancerId, jobId);
    }

    public List<Job> getSavedJobs(Long freelancerId) {
        List<SavedJob> savedJobs = savedJobRepository.findByFreelancerId(freelancerId);
        return savedJobs.stream()
                .map(sj -> jobRepository.findById(sj.getJobId()).orElse(null))
                .filter(job -> job != null)
                .collect(Collectors.toList());
    }
}
