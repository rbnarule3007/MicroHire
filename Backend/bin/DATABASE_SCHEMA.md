# Database Schema Changes

## 1. Jobs Table (`jobs`)

Updated schema to support visibility management and soft deletes.

| Column Name | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT | PK, Auto Inc | Unique Job ID |
| `title` | VARCHAR | Not Null | Job Title |
| `description` | TEXT | | Detailed job description |
| `budget` | DOUBLE | | Project budget |
| `client_id` | BIGINT | | ID of the client who posted |
| `client_email` | VARCHAR | | Contact email for client |
| `freelancer_id` | BIGINT | | ID of hired freelancer (if any) |
| `freelancer_email`| VARCHAR | | Contact email for freelancer |
| `status` | VARCHAR | Default 'OPEN' | OPEN, IN_PROGRESS, COMPLETED, CLOSED |
| `is_active` | BOOLEAN | Default TRUE | **New**: Controls visibility in feed |
| `is_deleted` | BOOLEAN | Default FALSE| **New**: Soft delete flag |

## 2. Applications Table (`applications`)

Stores job applications with match tracking.

| Column Name | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT | PK, Auto Inc | Unique Application ID |
| `job_id` | BIGINT | FK -> jobs | Applied Job |
| `freelancer_id` | BIGINT | FK -> user | Applicant |
| `status` | VARCHAR | Default 'APPLIED'| APPLIED, SHORTLISTED, INTERVIEW, ACCEPTED, REJECTED |
| `match_percentage`| DOUBLE | | **Key**: Snapshot of match score at time of application |
| `cover_message` | TEXT | | Freelancer's pitch |

## 3. Notifications Table (`notifications`)

Real-time alert storage.

| Column Name | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT | PK, Auto Inc | Unique ID |
| `user_id` | BIGINT | | Recipient ID |
| `message` | TEXT | | Notification text |
| `is_read` | BOOLEAN | Default FALSE| Read status |
| `created_at` | TIMESTAMP| | Time of creation |

## 4. Freelancers Table (`freelancer`)

Enhanced profile data.

| Column Name | Type | Constraints | Description |
|---|---|---|---|
| `skills` | TEXT | | Comma-separated skills |
| `profile_completeness`| INT | | 0-100% score |
| `avg_rating` | DOUBLE | | Aggregate rating |

## Relationships

- **Job** 1:N **Applications**
- **Client** 1:N **Jobs**
- **Freelancer** 1:N **Applications**
- **User** 1:N **Notifications**
