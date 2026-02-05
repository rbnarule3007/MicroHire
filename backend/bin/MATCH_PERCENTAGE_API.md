# Backend Match Percentage Implementation - API Documentation

## Overview
This document describes the backend implementation for the intelligent job matching feature that calculates match percentages for freelancers viewing jobs.

## Features Implemented

### 1. Match Percentage Calculation (Freelancer Side)

#### Endpoint: GET /api/jobs/all?freelancerId={id}

**Description**: Returns all jobs with personalized match percentages for a specific freelancer.

**Request Parameters**:
- `freelancerId` (optional): The ID of the freelancer viewing jobs

**Response** (when freelancerId is provided):
```json
[
  {
    "id": 1,
    "title": "React Developer Needed",
    "description": "Build a modern web application...",
    "budget": 1500.0,
    "deadline": "2026-02-15",
    "clientId": 2,
    "clientName": "John Client",
    "clientEmail": "john@example.com",
    "requiredSkills": "React, Node.js, MongoDB",
    "status": "OPEN",
    "category": "Web Development",
    "experienceLevel": "INTERMEDIATE",
    "createdAt": "2026-01-29T10:30:00",
    "active": true,
    "matchPercentage": 75.5
  }
]
```

**Response** (when freelancerId is NOT provided):
Returns regular Job entities without matchPercentage field.

#### Match Percentage Calculation Logic

The match percentage is calculated using a weighted formula:

1. **Skills Match (60% weight)**
   - Compares freelancer skills with job required skills
   - Exact string matching (case-insensitive)
   - Formula: (matched skills / total job skills) * 100 * 0.6

2. **Experience Level Match (20% weight)**
   - Perfect match (same level): 100 points
   - Adjacent level match: 50 points
   - No match: 0 points
   - Multiplied by 0.2

3. **Keyword Match (20% weight)**
   - Checks if freelancer skills appear in job title/description
   - Formula: (skills found in text / total freelancer skills) * 100 * 0.2

**Total Score**: Sum of all three components, rounded to 2 decimal places (0-100)

### 2. Match Percentage Storage During Application

#### Endpoint: POST /api/applications

**Description**: When a freelancer applies to a job, the match percentage is calculated and stored.

**Request Body**:
```json
{
  "jobId": 1,
  "freelancerId": 3,
  "coverMessage": "I am perfect for this role..."
}
```

**Response**:
```json
{
  "message": "Application submitted successfully"
}
```

**Database Storage**:
The `applications` table stores:
- `matchPercentage`: The calculated match score at time of application (snapshot)
- This percentage is NOT recalculated after submission

#### Endpoint: GET /api/applications/job/{jobId}

**Description**: Returns all applications for a job, sorted by match percentage (highest first).

**Response**:
```json
[
  {
    "id": 1,
    "jobId": 1,
    "freelancerId": 3,
    "freelancerName": "Jane Freelancer",
    "freelancerEmail": "jane@example.com",
    "freelancerSkills": "React, Node.js, MongoDB, Express",
    "freelancerExperience": "INTERMEDIATE",
    "freelancerTitle": "Full Stack Developer",
    "freelancerRate": 50.0,
    "freelancerRating": 4.8,
    "freelancerBio": "Experienced developer...",
    "matchPercentage": 85.5,
    "status": "APPLIED",
    "appliedAt": "2026-01-29T12:00:00",
    "coverMessage": "I am perfect for this role..."
  }
]
```

### 3. Blank Page Fix - Job Posting

#### Endpoint: POST /api/jobs/post

**Previous Issue**: 
- Returned plain Job object without proper HTTP status
- Missing default values caused frontend crashes
- No validation of required fields

**Fix Applied**:
1. Returns `ResponseEntity<Job>` with HTTP 201 Created status
2. Sets default values:
   - `status = "OPEN"` if not provided
   - `createdAt = LocalDateTime.now()` if not provided
3. Returns complete job object in response body

**Request Body**:
```json
{
  "title": "React Developer",
  "description": "Build a web app",
  "budget": 1500.0,
  "clientId": 2,
  "clientName": "John Client",
  "clientEmail": "john@example.com",
  "requiredSkills": "React, Node.js",
  "category": "Web Development",
  "experienceLevel": "INTERMEDIATE"
}
```

**Response** (HTTP 201 Created):
```json
{
  "id": 5,
  "title": "React Developer",
  "description": "Build a web app",
  "budget": 1500.0,
  "deadline": null,
  "clientId": 2,
  "clientName": "John Client",
  "clientEmail": "john@example.com",
  "freelancerId": null,
  "freelancerName": null,
  "freelancerEmail": null,
  "requiredSkills": "React, Node.js",
  "status": "OPEN",
  "category": "Web Development",
  "experienceLevel": "INTERMEDIATE",
  "createdAt": "2026-01-29T14:30:00",
  "active": true,
  "isDeleted": false
}
```

## Database Schema Changes

### Application Entity
```java
@Entity
@Table(name = "applications")
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long jobId;
    private Long freelancerId;
    private Double matchPercentage;  // ← Stores snapshot at application time
    
    @Column(columnDefinition = "TEXT")
    private String coverMessage;
    
    private String status;
    private LocalDateTime appliedAt;
}
```

### No Schema Changes Required
The `matchPercentage` field already existed in the Application entity.

## Service Layer Changes

### JobService.java
**New Methods**:

1. `calculateMatchPercentage(Freelancer freelancer, Job job)`: Double
   - Comprehensive match calculation
   - Considers skills, experience, and keywords
   - Returns 0-100 score

2. `calculateKeywordMatch(Freelancer freelancer, Job job)`: Double (private)
   - Checks if freelancer skills appear in job text
   - Used for contextual matching

### ApplicationService.java
**Updated Methods**:

1. `applyForJob(ApplicationRequest request)`: void
   - Now uses `jobService.calculateMatchPercentage()` instead of simple skill matching
   - Ensures consistency between displayed and stored percentages

## Frontend Integration Notes

### For Freelancer Dashboard
The frontend should call:
```javascript
fetch(`http://localhost:8080/api/jobs/all?freelancerId=${user.userId}`)
```

This will return jobs with `matchPercentage` field included.

### Backward Compatibility
If `freelancerId` is not provided, the endpoint returns regular Job entities (no matchPercentage), ensuring backward compatibility with existing code.

## Testing Recommendations

1. **Test Match Calculation**:
   - Create freelancer with skills: "React, Node.js, MongoDB"
   - Create job requiring: "React, Node.js, Express"
   - Expected match: ~60-70% (2/3 skills match)

2. **Test Application Storage**:
   - Apply to job and verify matchPercentage is stored
   - Update freelancer skills
   - Verify stored matchPercentage doesn't change

3. **Test Job Posting**:
   - Post job without status field
   - Verify response has status="OPEN"
   - Verify HTTP 201 status code
   - Verify frontend doesn't show blank page

## Error Handling

All endpoints include proper error handling:
- Invalid freelancerId: Returns jobs without match percentage
- Missing job/freelancer: Returns 404 with error message
- Duplicate application: Returns 400 with "Already applied" message

## Performance Considerations

- Match calculation is O(n*m) where n=freelancer skills, m=job skills
- Typically very fast (<1ms) for reasonable skill counts
- Results are cached in Application entity (not recalculated)
- Database query uses `ORDER BY matchPercentage DESC` for efficient sorting
