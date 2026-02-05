# API Documentation

## 1. Job Management

### Get All Active Jobs (Freelancer Feed)
- **Endpoint**: `GET /api/jobs/all?freelancerId={id}`
- **Description**: Returns active, non-deleted jobs. Calculates match percentage if freelancerId is provided.
- **Response**: `List<JobDTO>`

### Post New Job
- **Endpoint**: `POST /api/jobs/post`
- **Body**:
  ```json
  {
    "title": "React Developer",
    "description": "...",
    "budget": 1000,
    "clientId": 1
  }
  ```

### Update Job
- **Endpoint**: `PUT /api/jobs/{id}`
- **Body**: Partial Job object

### Close Job
- **Endpoint**: `PATCH /api/jobs/{id}/close`
- **Description**: Sets status to "CLOSED", active=false

---

## 2. Application Management

### Submit Application
- **Endpoint**: `POST /api/applications`
- **Body**:
  ```json
  {
    "jobId": 1,
    "freelancerId": 2,
    "coverMessage": "I am interested..."
  }
  ```

### Get Job Applicants (Client View)
- **Endpoint**: `GET /api/applications/job/{jobId}`
- **Response**: List of applications with Freelancer details and Match %.

### Update Application Status
- **Endpoint**: `PUT /api/applications/{id}/status`
- **Body**: `"SHORTLISTED"` (String)
- **Side Effect**: Sends notification to freelancer.

---

## 3. Freelancer Profiles

### Get Public Profile
- **Endpoint**: `GET /api/freelancers/{id}/profile`
- **Response**: `FreelancerProfileDTO`
  - Includes `projects` list
  - Includes `certifications` list

---

## 4. Notifications

### Get User Notifications
- **Endpoint**: `GET /api/notifications/{userId}`

### Mark All Read
- **Endpoint**: `POST /api/notifications/{userId}/mark-read`
