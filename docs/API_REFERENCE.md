# Healthcare Platform API Reference

## Authentication

All API endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

### Login
**POST /api/auth/login**

Request:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response (200):
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "userType": "patient",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### Register
**POST /api/auth/register**

Request:
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "userType": "patient"
}
```

Response (201):
```json
{
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-uuid",
    "email": "newuser@example.com",
    "userType": "patient"
  }
}
```

## Patients

### Get Patient Profile
**GET /api/patients/profile**

Response (200):
```json
{
  "profile": {
    "userId": "patient-uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "patient@example.com",
    "dateOfBirth": "1990-01-15",
    "phone": "+1234567890",
    "bloodType": "O+",
    "allergies": ["Penicillin"],
    "emergencyContactName": "Jane Doe",
    "emergencyContactPhone": "+1234567891",
    "medicalHistory": [
      {
        "id": "history-uuid",
        "condition": "Hypertension",
        "diagnosedDate": "2020-05-10",
        "status": "active"
      }
    ]
  }
}
```

### Update Patient Profile
**PATCH /api/patients/profile**

Request:
```json
{
  "phone": "+1234567890",
  "bloodType": "O+",
  "allergies": ["Penicillin"],
  "emergencyContactName": "Jane Doe",
  "emergencyContactPhone": "+1234567891"
}
```

Response (200):
```json
{
  "message": "Profile updated successfully",
  "profile": { ... }
}
```

## Appointments

### Get Appointments
**GET /api/appointments**

Query Parameters:
- `status` (optional): Filter by status (scheduled, completed, cancelled)
- `limit` (optional): Results per page (default: 20)
- `offset` (optional): Pagination offset (default: 0)

Response (200):
```json
{
  "appointments": [
    {
      "id": "appointment-uuid",
      "doctorId": "doctor-uuid",
      "doctorName": "Dr. Jane Smith",
      "specialization": "Cardiologist",
      "departmentName": "Cardiology",
      "appointmentDate": "2024-04-15",
      "appointmentTime": "14:30",
      "status": "scheduled",
      "appointmentType": "in-person",
      "reasonForVisit": "Routine checkup",
      "queueNumber": "001",
      "durationMinutes": 30
    }
  ],
  "total": 5
}
```

### Book Appointment
**POST /api/appointments**

Request:
```json
{
  "doctorId": "doctor-uuid",
  "appointmentDate": "2024-04-15",
  "appointmentTime": "14:30",
  "appointmentType": "in-person",
  "reasonForVisit": "Routine checkup"
}
```

Response (201):
```json
{
  "message": "Appointment booked successfully",
  "appointment": {
    "id": "appointment-uuid",
    "appointmentDate": "2024-04-15",
    "appointmentTime": "14:30",
    "status": "scheduled",
    "appointmentType": "in-person",
    "queueNumber": "001"
  }
}
```

### Cancel Appointment
**DELETE /api/appointments/:id**

Request:
```json
{
  "reason": "Unable to attend"
}
```

Response (200):
```json
{
  "message": "Appointment cancelled successfully"
}
```

## Doctors

### Get Doctors
**GET /api/doctors**

Query Parameters:
- `departmentId` (optional): Filter by department
- `specialization` (optional): Filter by specialization
- `available` (optional): Filter by availability (true/false)
- `limit` (optional): Results per page (default: 20)
- `offset` (optional): Pagination offset (default: 0)

Response (200):
```json
{
  "doctors": [
    {
      "id": "doctor-uuid",
      "firstName": "Jane",
      "lastName": "Smith",
      "specialization": "Cardiologist",
      "departmentId": "dept-uuid",
      "departmentName": "Cardiology",
      "licenseNumber": "MD123456",
      "yearsOfExperience": 10,
      "isAvailable": true,
      "consultationFee": 50,
      "rating": 4.8,
      "reviewCount": 125,
      "bio": "Experienced cardiologist specializing in heart conditions."
    }
  ],
  "total": 15
}
```

### Get Doctor's Availability
**GET /api/doctors/:id/availability**

Query Parameters:
- `date` (optional): Specific date to check
- `limit` (optional): Number of days ahead (default: 7)

Response (200):
```json
{
  "availability": [
    {
      "date": "2024-04-15",
      "slots": [
        {
          "timeSlotStart": "09:00",
          "timeSlotEnd": "09:30",
          "maxAppointments": 3,
          "currentAppointments": 2,
          "available": true
        }
      ]
    }
  ]
}
```

## Medical Records

### Get Medical Records
**GET /api/medical-records**

Query Parameters:
- `recordType` (optional): Filter by type (prescription, lab-result, scan)
- `limit` (optional): Results per page (default: 20)
- `offset` (optional): Pagination offset (default: 0)

Response (200):
```json
{
  "records": [
    {
      "id": "record-uuid",
      "recordType": "prescription",
      "createdDate": "2024-04-10",
      "doctorName": "Dr. Jane Smith",
      "details": "Medication prescribed for hypertension",
      "status": "active"
    }
  ],
  "total": 8
}
```

### Upload Medical Record
**POST /api/medical-records**

Request (multipart/form-data):
- `file`: PDF or image file
- `recordType`: Type of record (prescription, lab-result, scan)
- `description`: Optional description

Response (201):
```json
{
  "message": "Record uploaded successfully",
  "record": {
    "id": "record-uuid",
    "recordType": "prescription",
    "fileUrl": "/api/medical-records/file/record-uuid",
    "uploadedDate": "2024-04-10"
  }
}
```

## Prescriptions

### Get Prescriptions
**GET /api/prescriptions**

Query Parameters:
- `status` (optional): Filter by status (active, completed, expired)

Response (200):
```json
{
  "prescriptions": [
    {
      "id": "prescription-uuid",
      "doctorName": "Dr. Jane Smith",
      "medications": [
        {
          "name": "Lisinopril",
          "dosage": "10mg",
          "frequency": "Once daily",
          "duration": "30 days",
          "instructions": "Take in the morning with water"
        }
      ],
      "issuedDate": "2024-04-10",
      "expiryDate": "2024-07-10",
      "status": "active"
    }
  ]
}
```

## Notifications

### Get Notifications
**GET /api/notifications**

Query Parameters:
- `limit` (optional): Results per page (default: 20)
- `offset` (optional): Pagination offset (default: 0)
- `unreadOnly` (optional): Get only unread notifications (true/false)

Response (200):
```json
{
  "notifications": [
    {
      "id": "notification-uuid",
      "title": "Appointment Scheduled",
      "message": "Your appointment has been confirmed",
      "type": "appointment",
      "isRead": false,
      "createdAt": "2024-04-10T10:30:00Z",
      "relatedAppointmentId": "appointment-uuid"
    }
  ],
  "unreadCount": 3
}
```

### Mark Notification as Read
**PATCH /api/notifications**

Request:
```json
{
  "notificationId": "notification-uuid",
  "markAsRead": true
}
```

Response (200):
```json
{
  "success": true
}
```

### Delete Notification
**DELETE /api/notifications**

Request:
```json
{
  "notificationId": "notification-uuid"
}
```

Response (200):
```json
{
  "success": true
}
```

## Admin Dashboard

### Get Dashboard Statistics
**GET /api/admin/dashboard**

Response (200):
```json
{
  "statistics": {
    "users": {
      "patients": 150,
      "doctors": 25,
      "admins": 3,
      "staff": 10,
      "total": 188
    },
    "appointments": {
      "total": 500,
      "completed": 450,
      "scheduled": 40,
      "cancelled": 10,
      "telemedicine": 150,
      "today": 8
    },
    "performance": {
      "averageWaitTime": 15,
      "completionRate": 90
    },
    "departments": [
      {
        "id": "dept-uuid",
        "name": "Cardiology",
        "doctorCount": 8,
        "availableDoctors": 6
      }
    ]
  }
}
```

## Queue Management

### Get Queue Status
**GET /api/queue/status**

Query Parameters:
- `doctorId` (optional): Get queue for specific doctor
- `date` (optional): Get queue for specific date

Response (200):
```json
{
  "queue": [
    {
      "appointmentId": "appointment-uuid",
      "queueNumber": "001",
      "patientName": "John Doe",
      "status": "waiting",
      "joinedTime": "2024-04-10T10:30:00Z",
      "estimatedWaitTime": 15
    }
  ],
  "totalPatients": 5,
  "estimatedWaitTime": 45
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "error": "Missing or invalid authorization header"
}
```

### 403 Forbidden
```json
{
  "error": "You do not have permission to perform this action"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Status Codes

- 200: OK
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 500: Internal Server Error

## Rate Limiting

API requests are limited to 100 requests per minute per IP address.

## Pagination

For endpoints that return multiple items, use `limit` and `offset` query parameters:
- `limit`: Number of items to return (default: 20, max: 100)
- `offset`: Number of items to skip (default: 0)

Example: `GET /api/appointments?limit=20&offset=40`
