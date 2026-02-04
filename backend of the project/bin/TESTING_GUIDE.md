# Testing Guide - Match Percentage Feature

## Prerequisites
- Backend running on http://localhost:8080
- Frontend running on http://localhost:5173
- Database populated with test data

---

## Test Scenario 1: Match Percentage Display for Freelancers

### Setup
1. Create a freelancer with skills: "React, Node.js, MongoDB, Express"
2. Create a job requiring: "React, Node.js, Tailwind CSS"

### Test Steps

#### Step 1: Register/Login as Freelancer
```bash
# Login as freelancer
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "identifier": "freelancer@test.com",
  "password": "password123"
}

# Response will include userId
```

#### Step 2: View Jobs with Match Percentage
```bash
# Get all jobs with match percentage
GET http://localhost:8080/api/jobs/all?freelancerId=3

# Expected Response:
[
  {
    "id": 1,
    "title": "React Developer Needed",
    "description": "Build a modern web application with React and Node.js",
    "budget": 1500.0,
    "requiredSkills": "React, Node.js, Tailwind CSS",
    "status": "OPEN",
    "matchPercentage": 66.67,  // ← 2/3 skills match (60% weight) + keyword bonus
    ...
  }
]
```

#### Step 3: Verify Calculation
**Expected Match Breakdown:**
- Skills: 2/3 = 66.67% × 0.6 = 40.0
- Experience: (if matching) 100% × 0.2 = 20.0
- Keywords: "React" and "Node.js" in description × 0.2 = ~13.33
- **Total: ~73.33%**

---

## Test Scenario 2: Match Percentage Storage on Application

### Test Steps

#### Step 1: Apply to Job
```bash
POST http://localhost:8080/api/applications
Content-Type: application/json

{
  "jobId": 1,
  "freelancerId": 3,
  "coverMessage": "I am perfect for this role because I have 3 years of React experience..."
}

# Expected: Success response
```

#### Step 2: Verify Storage
```bash
# Get applications for the job (as client)
GET http://localhost:8080/api/applications/job/1

# Expected Response:
[
  {
    "id": 1,
    "jobId": 1,
    "freelancerId": 3,
    "freelancerName": "John Freelancer",
    "matchPercentage": 73.33,  // ← Stored snapshot
    "status": "APPLIED",
    "appliedAt": "2026-01-30T02:00:00",
    ...
  }
]
```

#### Step 3: Update Freelancer Skills
```bash
# Update freelancer to add more skills
PUT http://localhost:8080/api/freelancers/3
Content-Type: application/json

{
  "skills": "React, Node.js, MongoDB, Express, Tailwind CSS, Redux"
}
```

#### Step 4: Verify Snapshot Preservation
```bash
# Get applications again
GET http://localhost:8080/api/applications/job/1

# Expected: matchPercentage is STILL 73.33 (not recalculated)
```

---

## Test Scenario 3: Blank Page Fix - Job Posting

### Before Fix (Would Cause Blank Page)
```bash
POST http://localhost:8080/api/jobs/post
Content-Type: application/json

{
  "title": "Test Job",
  "description": "Test description",
  "budget": 1000.0,
  "clientId": 2,
  "clientName": "Test Client",
  "requiredSkills": "React"
  # Note: No status or createdAt provided
}

# Old Response: Plain object without proper status code
# Result: Frontend crash → blank page
```

### After Fix (Works Correctly)
```bash
POST http://localhost:8080/api/jobs/post
Content-Type: application/json

{
  "title": "Test Job",
  "description": "Test description",
  "budget": 1000.0,
  "clientId": 2,
  "clientName": "Test Client",
  "clientEmail": "client@test.com",
  "requiredSkills": "React"
}

# Expected Response (HTTP 201 Created):
{
  "id": 5,
  "title": "Test Job",
  "description": "Test description",
  "budget": 1000.0,
  "clientId": 2,
  "clientName": "Test Client",
  "clientEmail": "client@test.com",
  "requiredSkills": "React",
  "status": "OPEN",           // ← Auto-set
  "createdAt": "2026-01-30T02:22:00",  // ← Auto-set
  "active": true,
  "isDeleted": false
}

# Result: Frontend receives valid data → no blank page
```

---

## Test Scenario 4: Backward Compatibility

### Test: Jobs Without Freelancer ID
```bash
# Call without freelancerId parameter
GET http://localhost:8080/api/jobs/all

# Expected Response: Regular Job entities (no matchPercentage field)
[
  {
    "id": 1,
    "title": "React Developer Needed",
    "description": "...",
    "budget": 1500.0,
    "requiredSkills": "React, Node.js",
    "status": "OPEN",
    # No matchPercentage field
    ...
  }
]
```

---

## Test Scenario 5: Edge Cases

### Test 5.1: No Skills Match
```bash
# Freelancer skills: "Python, Django, PostgreSQL"
# Job requires: "React, Node.js, MongoDB"

GET http://localhost:8080/api/jobs/all?freelancerId=4

# Expected: matchPercentage = 0.0 or very low (only keyword matches)
```

### Test 5.2: Perfect Match
```bash
# Freelancer skills: "React, Node.js, MongoDB"
# Freelancer experience: "INTERMEDIATE"
# Job requires: "React, Node.js, MongoDB"
# Job experience: "INTERMEDIATE"

GET http://localhost:8080/api/jobs/all?freelancerId=5

# Expected: matchPercentage = 100.0 (perfect match on all criteria)
```

### Test 5.3: Partial Match with Keywords
```bash
# Freelancer skills: "React, Vue.js"
# Job requires: "Angular, TypeScript"
# Job title: "Frontend Developer with React experience"

GET http://localhost:8080/api/jobs/all?freelancerId=6

# Expected: Low skill match but keyword bonus from "React" in title
# matchPercentage = ~20-30%
```

---

## Frontend Integration Test

### Test: Freelancer Dashboard
1. Login as freelancer
2. Navigate to dashboard
3. **Expected**: Each job card shows match percentage badge
4. **Expected**: Jobs can be sorted by match percentage
5. Click "Apply" on a job
6. **Expected**: Application submitted successfully
7. Navigate to "My Proposals"
8. **Expected**: See application with stored match percentage

### Test: Client Dashboard
1. Login as client
2. Post a new job
3. **Expected**: No blank page, redirected to "My Jobs"
4. Navigate to job details
5. **Expected**: See list of applicants with match percentages
6. **Expected**: Applicants sorted by match percentage (highest first)

---

## Performance Test

### Test: Large Dataset
```bash
# Create 100 jobs
# Create freelancer with 10 skills
# Measure response time

GET http://localhost:8080/api/jobs/all?freelancerId=1

# Expected: Response time < 500ms
# Match calculation is O(n*m) but very fast for typical data
```

---

## Database Verification

### Verify Match Percentage Storage
```sql
-- Check applications table
SELECT 
    id,
    job_id,
    freelancer_id,
    match_percentage,
    status,
    applied_at
FROM applications
ORDER BY match_percentage DESC;

-- Expected: All applications have match_percentage values
-- Expected: Values are between 0 and 100
-- Expected: Values have up to 2 decimal places
```

---

## Troubleshooting

### Issue: matchPercentage is null
**Cause**: Frontend not passing freelancerId parameter
**Fix**: Update frontend to include `?freelancerId=${user.userId}` in API call

### Issue: matchPercentage is always 0
**Cause**: Freelancer has no skills set
**Fix**: Complete freelancer onboarding to set skills

### Issue: Blank page after job posting
**Cause**: Backend not running or old version
**Fix**: Restart backend with latest code

### Issue: Match percentage seems incorrect
**Cause**: Skills format mismatch (spaces, case)
**Fix**: Ensure skills are comma-separated, trimmed strings

---

## Success Criteria

✅ Freelancers see match percentage for each job (0-100%)
✅ Match percentage considers skills, experience, and keywords
✅ Freelancers can apply to any job regardless of match percentage
✅ Match percentage is stored at application time (snapshot)
✅ Clients see applicants sorted by match percentage
✅ Job posting returns HTTP 201 with complete data
✅ No blank pages occur after job posting
✅ Backward compatibility maintained (works without freelancerId)

---

## API Endpoints Summary

| Endpoint | Method | Purpose | Match % |
|----------|--------|---------|---------|
| `/api/jobs/all` | GET | Get all jobs | ✅ With freelancerId |
| `/api/jobs/all?freelancerId=X` | GET | Get jobs with match % | ✅ Calculated |
| `/api/jobs/post` | POST | Create new job | ❌ N/A |
| `/api/applications` | POST | Apply to job | ✅ Stored |
| `/api/applications/job/{id}` | GET | Get applicants | ✅ From DB |
| `/api/applications/freelancer/{id}` | GET | Get my applications | ✅ From DB |

---

## Notes

- Match percentage is **always** between 0 and 100
- Match percentage has **up to 2 decimal places**
- Match percentage is **never recalculated** after application
- Match percentage **requires freelancer to have skills set**
- Job posting **always returns HTTP 201** on success
- All endpoints **maintain backward compatibility**
