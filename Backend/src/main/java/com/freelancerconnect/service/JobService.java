package com.freelancerconnect.service;

import com.freelancerconnect.entity.Freelancer;
import com.freelancerconnect.entity.Job;
import com.freelancerconnect.repository.FreelancerRepository;
import com.freelancerconnect.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private FreelancerRepository freelancerRepository;

    public List<Job> getRecommendedJobs(Long freelancerId) {
        Freelancer freelancer = freelancerRepository.findById(freelancerId)
                .orElseThrow(() -> new RuntimeException("Freelancer not found"));

        List<Job> allJobs = jobRepository.findAll().stream()
                .filter(job -> "OPEN".equals(job.getStatus()))
                .collect(Collectors.toList());

        List<JobScore> scoredJobs = allJobs.stream().map(job -> {
            double score = 0;

            // Skill Score (Weight 50)
            double skillMatch = calculateSkillMatch(freelancer.getSkills(), job.getRequiredSkills());
            score += skillMatch * 0.5;

            // Experience Score (Weight 25)
            if (freelancer.getExperienceLevel() != null
                    && freelancer.getExperienceLevel().equals(job.getExperienceLevel())) {
                score += 25;
            } else if (freelancer.getExperienceLevel() != null && job.getExperienceLevel() != null) {
                // Partial match if levels are adjacent? For simplicity, just exact for now.
            }

            // Category Score (Weight 25)
            if (freelancer.getCategory() != null && freelancer.getCategory().equalsIgnoreCase(job.getCategory())) {
                score += 25;
            }

            return new JobScore(job, score);
        })
                .filter(js -> js.score > 0)
                .sorted(Comparator.comparingDouble((JobScore js) -> js.score).reversed())
                .collect(Collectors.toList());

        return scoredJobs.stream().map(js -> js.job).collect(Collectors.toList());
    }

    public long countMatchingFreelancers(Job job) {
        return freelancerRepository.findAll().stream()
                .filter(f -> calculateSkillMatch(f.getSkills(), job.getRequiredSkills()) >= 30) // At least 30% match
                .count();
    }

    private double calculateSkillMatch(String fSkills, String jSkills) {
        if (fSkills == null || jSkills == null)
            return 0;
        String[] fArray = fSkills.toLowerCase().split("[,;|\\n]+");
        String[] jArray = jSkills.toLowerCase().split("[,;|\\n]+");

        int matchCount = 0;
        int totalJobSkills = 0;

        for (String j : jArray) {
            String trimmed = j.trim();
            if (trimmed.isEmpty())
                continue;
            totalJobSkills++;
            for (String f : fArray) {
                if (f.trim().equals(trimmed)) {
                    matchCount++;
                    break;
                }
            }
        }
        if (totalJobSkills == 0)
            return 0;
        return ((double) matchCount / totalJobSkills) * 100;
    }

    private static class JobScore {
        Job job;
        double score;

        JobScore(Job job, double score) {
            this.job = job;
            this.score = score;
        }
    }

    /**
     * Calculate comprehensive match percentage for a freelancer and a job
     * 
     * @param freelancer The freelancer to match
     * @param job        The job to match against
     * @return Match percentage (0-100)
     */
    public double calculateMatchPercentage(Freelancer freelancer, Job job) {
        if (freelancer == null || job == null) {
            return 0.0;
        }

        double totalScore = 0.0;

        // 1. Skills Match (70% weight) - Based on Required Skills
        double skillMatch = calculateSkillMatch(freelancer.getSkills(), job.getRequiredSkills());
        totalScore += skillMatch * 0.7;

        // 2. Experience Level Match (30% weight)
        double experienceScore = 0.0;
        if (freelancer.getExperienceLevel() != null && job.getExperienceLevel() != null) {
            String fExp = freelancer.getExperienceLevel().toUpperCase();
            String jExp = job.getExperienceLevel().toUpperCase();

            if (fExp.equals(jExp)) {
                experienceScore = 100.0;
            } else if ((fExp.equals("INTERMEDIATE") && (jExp.equals("BEGINNER") || jExp.equals("EXPERT"))) ||
                    (fExp.equals("BEGINNER") && jExp.equals("INTERMEDIATE")) ||
                    (fExp.equals("EXPERT") && jExp.equals("INTERMEDIATE"))) {
                experienceScore = 50.0;
            }
        }
        totalScore += experienceScore * 0.3;

        // 3. Keyword Match (Bonus) - Adds up to 10% extra if skills match is low
        // This helps if the job description has skills not listed in 'requiredSkills'
        if (totalScore < 90) {
            double keywordScore = calculateKeywordMatch(freelancer, job);
            totalScore += (keywordScore * 0.1);
        }

        // Cap at 100
        totalScore = Math.min(totalScore, 100.0);

        // Round to 2 decimal places
        return Math.round(totalScore * 100.0) / 100.0;
    }

    private double calculateKeywordMatch(Freelancer freelancer, Job job) {
        if (freelancer.getSkills() == null || freelancer.getSkills().trim().isEmpty()) {
            return 0.0;
        }

        String[] freelancerSkills = freelancer.getSkills().toLowerCase().split("[,;|\\n]+");
        String jobText = (job.getTitle() + " " + (job.getDescription() != null ? job.getDescription() : ""))
                .toLowerCase();

        int matchCount = 0;
        for (String skill : freelancerSkills) {
            String trimmedSkill = skill.trim();
            if (!trimmedSkill.isEmpty() && jobText.contains(trimmedSkill)) {
                matchCount++;
            }
        }

        // Divide by 5 (we consider 5 keyword matches to be a "full" keyword match)
        // rather than dividing by total freelancer skills (which penalizes broad
        // profiles)
        return Math.min(((double) matchCount / 5.0) * 100.0, 100.0);
    }
}
