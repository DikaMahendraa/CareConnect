# CareConnect
### Elderly Care Coordination & Monitoring System

<p align="center">
  A web-based platform for elderly resident management, caregiver coordination,
  and simulated activity monitoring.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express.js-Web%20Framework-000000?logo=express&logoColor=white" alt="Express.js">
  <img src="https://img.shields.io/badge/EJS-Template%20Engine-B4CA65" alt="EJS">
  <img src="https://img.shields.io/badge/MySQL-Database-4479A1?logo=mysql&logoColor=white" alt="MySQL">
  <img src="https://img.shields.io/badge/Architecture-MVC-blue" alt="MVC">
</p>

---

## About the Project

**CareConnect** is a web-based elderly care coordination system developed to help administrators organize resident information, manage caregiver accounts, and assign caregivers to elderly residents. Caregivers can use the platform to view their assigned residents, monitor recorded activity events, and follow up on alerts.

The application provides a centralized workflow between administrators and caregivers. It is built with **Node.js, Express.js, EJS, and MySQL**, using the **Model-View-Controller (MVC)** architectural pattern.

> **Project scope:** Activity events and monitoring alerts in the current version are generated through an administrator-operated simulation feature. CareConnect does not currently connect to physical IoT devices, mmWave radar sensors, GPS hardware, or an automatic fall-detection system.

## Team

**Group Name: CareConnect**

| No. | Team Member | Student ID | Responsibility |
|---|---|---|---|
| 1 | To be added | To be added | Backend, database, and system integration |
| 2 | To be added | To be added | Administrator interface |
| 3 | To be added | To be added | Caregiver dashboard and resident monitoring |
| 4 | To be added | To be added | Alert workflow, simulation, testing, and documentation |

*Update this table with the official names, student IDs, and final task distribution of the team.*

## Project Objectives

- Centralize elderly resident information.
- Organize caregiver accounts and responsibilities.
- Make resident-to-caregiver assignments easier to manage.
- Provide caregivers with access to assigned resident information.
- Record activity events and present relevant monitoring alerts.
- Provide an alert follow-up workflow for caregivers.
- Demonstrate the monitoring process through controlled simulation scenarios.

## Features

### Administrator

- **Dashboard** — overview of resident, caregiver, and assignment information.
- **Resident Management** — create, view, update, and delete resident records.
- **Caregiver Management** — manage caregiver accounts and their information.
- **Caregiver Assignment** — assign caregivers to residents and manage assignments.
- **Activity Simulation** — generate sample activity events and corresponding alerts for workflow testing.

### Caregiver

- **Caregiver Dashboard** — summary of assigned residents and monitoring information.
- **Assigned Residents** — view residents assigned to the logged-in caregiver.
- **Resident Monitoring** — review recorded activity information.
- **Alert Center** — view alerts related to assigned residents.
- **Alert Follow-up** — acknowledge or resolve alerts and record follow-up actions.
- **Activity History** — review previously recorded activity events.

## Activity Simulation

The simulation feature allows an administrator to create activity events to demonstrate the system workflow.

| Event | Description | Alert |
|---|---|---|
| Normal Activity | Resident is recorded as performing normal activity. | No |
| Outside | Resident is recorded as being outside the home. | No |
| Returned | Resident is recorded as having returned home. | No |
| No Movement | No movement is simulated for a resident. | Yes |
| Possible Fall | A possible-fall event is simulated. | Yes |
| Sensor Offline | A sensor-offline condition is simulated. | Yes |

Simulation events are stored as activity records. For configured alert events, the system also creates an alert that can be viewed and followed up by the assigned caregiver.

**Important:** These scenarios are software-generated test data. They must not be interpreted as real-time sensor readings or medical/ emergency detection.

## System Workflow

1. The administrator signs in to the application.
2. The administrator registers resident and caregiver information.
3. The administrator assigns a caregiver to a resident.
4. The administrator generates a simulated activity event when testing the monitoring workflow.
5. The system stores the activity event and creates an alert when the event type requires one.
6. The assigned caregiver signs in and reviews the resident's activity and alerts.
7. The caregiver records a follow-up action and updates the alert status.

## Technology Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime for the server |
| Express.js | Web application framework and routing |
| EJS | Server-side HTML templating |
| MySQL | Relational database |
| mysql2 | MySQL database driver |
| express-session | Session-based authentication |
| bcrypt | Password hashing and comparison |
| dotenv | Environment variable configuration |
| Nodemon | Development server auto-restart |

The frontend uses EJS-rendered pages, CSS, and browser-side JavaScript where required.

## Architecture

CareConnect follows the **Model-View-Controller (MVC)** pattern.

| Layer | Responsibility |
|---|---|
| Model | Handles database queries and data operations. |
| View | Renders the user interface using EJS templates. |
| Controller | Processes requests, coordinates models, and selects responses. |
| Routes | Maps application URLs and HTTP methods to controllers. |
| Middleware | Handles authentication, role authorization, and request processing. |
| Config | Stores application and database configuration. |

### Request Flow

```text
User / Browser
      |
      v
Express Routes
      |
      v
Middleware
(Authentication / Authorization)
      |
      v
Controller
      |
      v
Model
      |
      v
MySQL Database

Controller
      |
      v
EJS View
      |
      v
HTML Response
```

## Database Overview

The database is named **CareConnect** and contains the following core tables:

| Table | Purpose |
|---|---|
| `users` | Stores administrator and caregiver account information. |
| `residents` | Stores elderly resident profiles and contact information. |
| `care_assignments` | Connects caregivers with their assigned residents. |
| `activity_events` | Stores resident activity records, including simulated events. |
| `alerts` | Stores alerts generated by selected activity events. |
| `alert_actions` | Stores caregiver follow-up actions and notes. |

### Main Relationships

- A caregiver account can be connected to residents through `care_assignments`.
- A resident can have multiple activity event records.
- An activity event can be associated with an alert.
- An alert can have follow-up action records in `alert_actions`.

## Project Structure

The application is organized into MVC-oriented directories. The exact files may evolve as development continues.

```text
CareConnect/
├── config/              # Database and application configuration
├── controllers/         # Request handling and application logic
├── middleware/          # Authentication and authorization
├── models/              # Database queries and data operations
├── routes/              # Express route definitions
├── views/
│   ├── admin/           # Administrator pages and partials
│   └── caregiver/       # Caregiver pages and partials
├── public/
│   ├── css/             # Stylesheets
│   ├── js/              # Client-side JavaScript
│   └── assets/          # Images and other static assets
├── .env.example         # Example environment configuration
├── app.js               # Express application entry point
└── package.json         # Project metadata and dependencies
```

## Getting Started

Follow these steps to run CareConnect on your local machine.

### Prerequisites

Install the following software:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)
- [Git](https://git-scm.com/)
- A code editor such as [Visual Studio Code](https://code.visualstudio.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/DikaMahendraa/CareConnect.git
cd CareConnect
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create the Database

Open MySQL and create the database:

```sql
CREATE DATABASE CareConnect;
```

Import or execute the project's database schema and seed data if they are provided in the repository. The application requires the tables described in the Database Overview section.

### 4. Configure Environment Variables

Create a local `.env` file in the project root based on `.env.example`.

Example configuration:

```env
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=CareConnect
DB_PORT=3306

SESSION_SECRET=replace_with_a_long_random_secret
```

Replace the example values with the credentials and settings on your local machine. Do not commit the real `.env` file or publish database passwords and session secrets.

### 5. Run the Application

For development:

```bash
npm run dev
```

If the development script is not available, check the scripts defined in `package.json`.

Open the application in your browser:

```text
http://localhost:3000
```

## Authentication and Security

The application includes role-based access for administrator and caregiver accounts.

- Passwords are handled using bcrypt password hashing.
- User sessions are managed using session-based authentication.
- Protected routes use authentication and role authorization middleware.
- Database operations use the MySQL driver and parameterized queries where implemented.
- Environment variables are used for sensitive configuration.

For production deployment, additional security hardening is required, including HTTPS, secure cookie settings, CSRF protection verification, input validation, rate limiting, and production-ready session storage.

## Testing Guide

The following scenarios can be used to test the main application workflow:

1. Sign in using an administrator account.
2. Create a resident record.
3. Create a caregiver account.
4. Assign the caregiver to the resident.
5. Open the Activity Simulation page.
6. Generate a normal activity event and verify the activity record.
7. Generate a possible-fall or no-movement event and verify that an alert is created.
8. Sign in as the assigned caregiver.
9. Open the alert center and review the generated alert.
10. Perform a follow-up action and verify the updated alert information.

Use test accounts and non-sensitive sample data during development.

## Current Limitations

- Activity events are generated through manual simulation.
- The application does not currently receive data from physical sensors or IoT devices.
- Fall-related alerts are simulated and are not validated medical detections.
- Real-time notification delivery is not guaranteed.
- Production deployment and integration with external monitoring hardware are outside the current implementation scope.

## Future Development

Potential improvements include:

- Integration with mmWave radar or other non-camera sensing devices.
- Real-time activity data ingestion.
- Machine-learning-based activity classification and fall detection.
- Notification services for caregivers and family members.
- More detailed monitoring history and analytics.
- Stronger privacy controls, data retention policies, and audit logging.
- Automated testing and production deployment.

## Team Contribution

This project is developed collaboratively. Team members contribute to backend development, database management, administrator and caregiver interfaces, simulation, testing, and documentation.

For detailed contributions, refer to the Team table above and the repository commit history.

## License

This project is developed for academic purposes. Unless a separate license is added to this repository, all rights are reserved by the project authors.

---

<p align="center">
  <strong>CareConnect — Connecting Caregivers, Supporting Independent Living.</strong>
</p>
