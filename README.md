# ITMO University - Web Programming Lab №2

A student dormitory management system built for the Web Development course at ITMO University. 

This version migrates the project from the previous client-side (cookies) approach to a full client-server stateless architecture with a Python/Django REST API backend and JSON file persistence.

## Key Changes from Lab 1

- **Stateless Backend:** All business logic, validations, and state handling moved from browser cookies to the server.
- **RESTful Endpoints:** Standardized HTTP methods (`GET`, `POST`, `PATCH`, `DELETE`) with appropriate status codes (`200`, `201`, `204`, `400`, `404`, `409`).
- **Custom QUERY Method:** Implemented a `QUERY` method accepting a JSON body for advanced student filtering when query parameters grow large.
- **Three-Layer Architecture:** Codebase strictly separated into storage (`storage.py`), business logic (`services.py`), and presentation (`views.py`).

## Tech Stack

- **Backend:** Python 3, Django, Django REST Framework, django-cors-headers
- **Storage:** JSON flat-file storage (`db.json`)
- **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+ Fetch API)

## Architecture Overview

```text
backend/
├── server_config/       # Django project configuration & CORS settings
└── students_api/        # Application logic
    ├── storage.py       # Data access layer (reads/writes db.json)
    ├── services.py      # Business logic & validations (ISU ID checks)
    ├── views.py         # HTTP request handlers & status code mapping
    └── urls.py          # Route definitions (/api/requests)
```

## API Specification

| Method | Endpoint | Description | Status Codes |
|--------|----------|-------------|--------------|
| `GET` | `/api/requests` | List students with optional query filters (group, dormitory) | `200` |
| `QUERY` | `/api/requests` | Filter students via JSON body payload | `200`, `400` |
| `GET` | `/api/requests/:id` | Fetch specific student details by ISU ID | `200`, `404` |
| `POST` | `/api/requests` | Register a new student (validates unique ISU ID) | `201`, `400`, `409` |
| `PATCH` | `/api/requests/:id` | Update student record partially | `200`, `404` |
| `DELETE` | `/api/requests/:id` | Remove student record | `204`, `404` |

## Getting Started

### 1. Backend Setup

Make sure Python is installed, then install dependencies and run the server:

```powershell
# Navigate to the backend directory
cd backend

# Install requirements
pip install django djangorestframework django-cors-headers

# Start development server
python manage.py runserver
```

The API will be available at `http://127.0.0.1:8000/api/requests`.

### 2. Frontend Setup

Open `frontend/index.html` directly in your browser or run it with Live Server in VS Code (runs on `http://127.0.0.1:5500`).
