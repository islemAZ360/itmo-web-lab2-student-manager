// Backend base URL (Django typically runs on port 8000)
const API_BASE = "http://127.0.0.1:8000/api";

// 1. GET requests (with optional query parameters)
async function fetchStudents(queryString = "") {
    // URL will be either /api/requests or /api/requests?group=...
    const response = await fetch(`${API_BASE}/requests${queryString}`);
    return await response.json();
}

// 2. QUERY request (Custom method - Issue #5)
async function fetchStudentsWithQueryMethod(filters) {
    // No trailing slash after /requests
    const response = await fetch(`${API_BASE}/requests`, {
        method: "QUERY",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters)
    });
    return await response.json();
}

// 3. GET request by ID
async function fetchStudentById(isu) {
    // No trailing slash after the ID
    const response = await fetch(`${API_BASE}/requests/${isu}`);
    if (!response.ok) return null;
    return await response.json();
}

// 4. POST request (Create)
async function addStudent(studentData) {
    // No trailing slash
    const response = await fetch(`${API_BASE}/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData)
    });
    return response;
}

// 5. PATCH request (Update)
async function updateStudent(isu, studentData) {
    // No trailing slash
    const response = await fetch(`${API_BASE}/requests/${isu}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData)
    });
    return response;
}

// 6. DELETE request
async function deleteStudent(isu) {
    // No trailing slash
    const response = await fetch(`${API_BASE}/requests/${isu}`, {
        method: "DELETE"
    });
    return response;
}
