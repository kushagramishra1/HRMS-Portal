# PeopleHub HRMS — Project Report Notes

## 1. Problem statement

Small organizations still handle employee records, attendance and leave approvals using spreadsheets or disconnected files. This project provides one simple web application for managing these common HR tasks.

## 2. Objectives

- Store employee information in a structured database.
- Allow HR/admin users to manage employee records.
- Record daily attendance.
- Create and process leave requests.
- Show useful HR summaries on a dashboard.
- Demonstrate modern full-stack web development.

## 3. Modules

### Authentication
Demo admin sign-in for the prototype.

### Employee Management
Add, view, search, edit and delete employee records.

### Attendance Management
Select a date and mark employee status as Present, Absent, Half Day or Work From Home.

### Leave Management
Create leave requests and change their status between Pending, Approved and Rejected.

### Dashboard
Displays active employee count, attendance percentage, pending leaves and recent activity.

## 4. Architecture

```text
Browser / React UI
        |
        v
Next.js App Router + Route Handlers
        |
        v
Direct SQLite access with better-sqlite3
        |
        v
SQLite Database
```

## 5. Future scope

- Employee self-service login
- Role-based access for HR, manager and employee
- Payroll and payslip generation
- Monthly attendance reports
- Email notifications
- CSV / PDF export
- Production authentication and audit logging
