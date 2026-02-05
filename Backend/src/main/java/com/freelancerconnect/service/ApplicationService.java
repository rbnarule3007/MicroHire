package com.freelancerconnect.service;

import com.freelancerconnect.dto.ApplicationDTO;
import com.freelancerconnect.dto.ApplicationRequest;
import com.freelancerconnect.entity.Application;
import com.freelancerconnect.entity.Freelancer;
import com.freelancerconnect.entity.Job;
import com.freelancerconnect.repository.ApplicationRepository;
import com.freelancerconnect.repository.FreelancerRepository;
import com.freelancerconnect.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private FreelancerRepository freelancerRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private JobService jobService;

    public void applyForJob(ApplicationRequest request) {
        if (applicationRepository.existsByJobIdAndFreelancerId(request.getJobId(), request.getFreelancerId())) {
            throw new RuntimeException("You have already applied for this job.");
        }

        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found"));

        Freelancer freelancer = freelancerRepository.findById(request.getFreelancerId())
                .orElseThrow(() -> new RuntimeException("Freelancer not found"));

        // Use comprehensive match calculation from JobService
        double matchPercentage = jobService.calculateMatchPercentage(freelancer, job);

        Application application = new Application();
        application.setJobId(request.getJobId());
        application.setFreelancerId(request.getFreelancerId());
        application.setMatchPercentage(matchPercentage);
        application.setCoverMessage(request.getCoverMessage());
        application.setStatus("APPLIED");

        applicationRepository.save(application);

        // Notify Client
        String message = "Freelancer " + freelancer.getFullName() + " applied for your job: " + job.getTitle();
        notificationService.createNotification(job.getClientId(), "CLIENT", message, "APPLIED");

        // Notify Freelancer (New)
        String freelancerMsg = "You successfully applied for: " + job.getTitle();
        notificationService.createNotification(freelancer.getId(), "FREELANCER", freelancerMsg, "APPLIED");
    }

    public List<ApplicationDTO> getApplicationsForJob(Long jobId) {
        List<Application> applications = applicationRepository.findByJobIdOrderByMatchPercentageDesc(jobId);

        return applications.stream().map(app -> {
            Freelancer freelancer = freelancerRepository.findById(app.getFreelancerId()).orElse(null);
            ApplicationDTO dto = new ApplicationDTO();
            dto.setId(app.getId());
            dto.setJobId(app.getJobId());
            dto.setFreelancerId(app.getFreelancerId());
            dto.setMatchPercentage(app.getMatchPercentage());
            dto.setStatus(app.getStatus());
            dto.setAppliedAt(app.getAppliedAt());

            if (freelancer != null) {
                dto.setFreelancerName(freelancer.getFullName());
                dto.setFreelancerSkills(freelancer.getSkills());
                dto.setFreelancerEmail(freelancer.getEmail());
                dto.setFreelancerExperience(freelancer.getExperienceLevel());
                dto.setFreelancerTitle(freelancer.getTitle());
                // hourlyRate removed
                dto.setFreelancerRating(freelancer.getAvgRating());
                dto.setFreelancerBio(freelancer.getBio());
                dto.setCoverMessage(app.getCoverMessage());
            }
            return dto;
        }).collect(Collectors.toList());
    }

    public List<ApplicationDTO> getApplicationsByFreelancer(Long freelancerId) {
        List<Application> applications = applicationRepository.findByFreelancerId(freelancerId);
        return applications.stream().map(app -> {
            Job job = jobRepository.findById(app.getJobId()).orElse(null);
            ApplicationDTO dto = new ApplicationDTO();
            dto.setId(app.getId());
            dto.setJobId(app.getJobId());
            dto.setFreelancerId(app.getFreelancerId());
            dto.setMatchPercentage(app.getMatchPercentage());
            dto.setStatus(app.getStatus());
            dto.setAppliedAt(app.getAppliedAt());

            if (job != null) {
                dto.setJobTitle(job.getTitle());
                dto.setJobBudget(job.getBudget());
                dto.setClientId(job.getClientId());
                dto.setClientName(job.getClientName());
                dto.setClientEmail(job.getClientEmail());
                dto.setCoverMessage(app.getCoverMessage()); // Add this back if needed
            }
            return dto;
        }).collect(Collectors.toList());
    }

    public void updateApplicationStatus(Long applicationId, String status) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        Job job = jobRepository.findById(application.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found"));

        application.setStatus(status);
        applicationRepository.save(application);

        String message = "";
        switch (status) {
            case "SHORTLISTED":
                message = "Your application for '" + job.getTitle() + "' has been shortlisted.";
                break;
            case "INTERVIEW":
                message = "You are invited for an interview for '" + job.getTitle() + "'.";
                break;
            case "ACCEPTED":
                Freelancer freelancer = freelancerRepository.findById(application.getFreelancerId())
                        .orElseThrow(() -> new RuntimeException("Freelancer not found"));
                message = "Congratulations! You have been hired for '" + job.getTitle() + "'.";
                job.setStatus("IN_PROGRESS");
                job.setFreelancerId(application.getFreelancerId());
                job.setFreelancerName(freelancer.getFullName());
                job.setFreelancerEmail(freelancer.getEmail());
                jobRepository.save(job);
                // Reject others
                rejectOtherApplications(job.getId(), applicationId);
                break;
            case "REJECTED":
                message = "Your application for '" + job.getTitle() + "' was rejected.";
                break;
        }

        if (!message.isEmpty()) {
            notificationService.createNotification(application.getFreelancerId(), "FREELANCER", message, status);
        }
    }

    private void rejectOtherApplications(Long jobId, Long acceptedAppId) {
        List<Application> otherApps = applicationRepository.findByJobIdOrderByMatchPercentageDesc(jobId);
        for (Application otherApp : otherApps) {
            if (!otherApp.getId().equals(acceptedAppId)) {
                otherApp.setStatus("REJECTED");
                applicationRepository.save(otherApp);
            }
        }
    }

    public void acceptApplication(Long applicationId) {
        updateApplicationStatus(applicationId, "ACCEPTED");
    }

}
