# Student Management System - REST API (Lab 2)

## Description
Laboratory Work #2 for the Web Development course at ITMO University.
This project migrates the student dormitory management system from a client-side (cookie-based) application to a full Client-Server architecture with a stateless frontend and a RESTful backend built with Python and Django REST Framework.

## Tech Stack
- **Backend:** Python 3.12+, Django, Django REST Framework (DRF)
- **Frontend:** Vanilla JavaScript (ES6+), HTML5, CSS3
- **Data Persistence:** In-Memory / Server-side JSON storage
- **API Architecture:** RESTful API (Stateless)

## API Endpoints
| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/api/requests` | List students (supports query filters) | 200 |
| `GET` | `/api/requests/:id` | Get single student dossier by ISU | 200, 404 |
| `POST` | `/api/requests` | Create a new student record | 201, 400, 409, 422 |
| `PATCH` | `/api/requests/:id` | Update student details | 200, 400, 404, 422 |
| `DELETE` | `/api/requests/:id` | Remove student from system | 204, 404 |
| `QUERY` | `/api/requests` | Advanced multi-parameter filtering | 200, 400 |

## Team Roles & Issue Tracking
- **Developer 1 (Islam):** Backend Core Architecture, Storage Engine, and Write Operations (POST, PATCH, DELETE).
- **Developer 2 (afsar):** Query & Filtering Engine (GET with params, QUERY method), and Frontend Stateless Integration.
