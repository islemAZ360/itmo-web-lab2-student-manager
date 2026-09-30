# Student Dormitory Management System

A full-stack web application designed for managing student dormitory accommodations, developed as part of the Web Programming course at ITMO University.

The project features a responsive client-side interface communicating with a stateless Django REST API backend with JSON-based persistence.

---

## Features

### Frontend (Client-Side)

- **Student Records Table:** Displays core accommodation data (Name, Group, ISU ID, Room) with quick actions to view, edit, or delete entries.
- **Dynamic Add/Edit Form:** Complete input form supporting full records (Full Name, Group, ISU ID, Dormitory Number, Room Number, Period, International student status, and Notes) with auto-population on edit.
- **Client-Side Validation:** Form constraints utilizing HTML5 attributes and regex validation (capitalized group patterns, 6-digit ISU ID, character length caps).
- **Student Dossier:** Dedicated card view displaying all detailed information for an individual student.
- **Dual-Mode Filtering:**
  - Standard search via HTTP `GET` query parameters.
  - Advanced search via HTTP `QUERY` method sending a JSON payload.
- **Responsive Layout:** Adaptive CSS design optimized for desktop and mobile displays.

### Backend (Server-Side)

- **Three-Layer Architecture:** Clean separation of concerns between HTTP presentation, business logic, and data storage.
- **Stateless REST API:** Built with Django and Django REST Framework, ensuring each request contains all necessary state.
- **File-Based Persistence:** JSON storage (`db.json`) replacing browser cookies for cross-client data persistence.
- **Server-Side Validation:** Uniqueness check on student `isuId` and enforcement of required fields.
- **Standardized HTTP Responses:** Uses semantic HTTP status codes (`200`, `201`, `204`, `400`, `404`, `409`).
- **CORS Support:** Integrated `django-cors-headers` allowing cross-origin requests, including custom HTTP methods like `QUERY`.

---

## Project Structure

```text
itmo-web-lab2-student-manager/
├── frontend/
│   ├── assets/
│   │   └── cat.svg                 # Project favicon
│   ├── css/
│   │   └── style.css               # Responsive application styling
│   ├── js/
│   │   ├── api.js                  # Fetch API client (GET, POST, PATCH, DELETE, QUERY)
│   │   └── app.js                  # UI event handlers, form logic, and table rendering
│   └── index.html                  # Main application markup
│
└── backend/
    ├── manage.py                   # Django management script
    ├── server_config/              # Project settings & root routing
    │   ├── settings.py             # App registration, CORS, and middleware settings
    │   ├── urls.py                 # Root URL routing (/api/)
    │   ├── asgi.py
    │   └── wsgi.py
    └── students_api/               # Core API application
        ├── storage.py              # Data Access Layer (db.json file handling)
        ├── services.py             # Business logic layer (filtering, validation)
        ├── views.py                # Presentation layer (DRF API views)
        └── urls.py                 # API endpoints definition
```

---

## API Endpoints

| Method | Endpoint | Description | Status Codes |
|--------|----------|-------------|--------------|
| `GET` | `/api/requests` | List students (supports group & dormitory query params) | `200` |
| `QUERY` | `/api/requests` | Filter students via JSON body payload | `200`, `400` |
| `GET` | `/api/requests/<isu_id>` | Retrieve full dossier for a specific student | `200`, `404` |
| `POST` | `/api/requests` | Add a new student record | `201`, `400`, `409` |
| `PATCH` | `/api/requests/<isu_id>` | Partially update an existing student record | `200`, `404` |
| `DELETE` | `/api/requests/<isu_id>` | Remove a student record from the system | `204`, `404` |

---

## Getting Started

### 1. Prerequisites

- Python 3.10+
- Modern Web Browser (or VS Code Live Server extension)

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
pip install django djangorestframework django-cors-headers
```

Run the development server:

```bash
python manage.py runserver
```

The API server will run at `http://127.0.0.1:8000/`.

### 3. Frontend Setup

Open `frontend/index.html` using Live Server in VS Code (usually served at `http://127.0.0.1:5500`) or open the file directly in any modern browser.
