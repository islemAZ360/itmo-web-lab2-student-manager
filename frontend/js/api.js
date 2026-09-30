// Backend base URL on port 8000
const API_BASE = "http://127.0.0.1:8000/api";

// GET requests
async function fetchStudents(queryString = "") {
    // URL will be either /api/requests or /api/requests?group=... ~_~
    const response = await fetch(`${API_BASE}/requests${queryString}`);
    return await response.json();
}

// QUERY request 
async function fetchStudentsWithQueryMethod(filters) {
    
    const response = await fetch(`${API_BASE}/requests`, {
        method: "QUERY",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters)
    });
    return await response.json();
}

// GET request by ID
async function fetchStudentById(isu) {
    const response = await fetch(`${API_BASE}/requests/${isu}`);
    if (!response.ok) return null;
    return await response.json();
}

// POST request (Create)
async function addStudent(studentData) {
    
    const response = await fetch(`${API_BASE}/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData)
    });
    return response;
}

// PATCH request (Update)
async function updateStudent(isu, studentData) {
    
    const response = await fetch(`${API_BASE}/requests/${isu}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData)
    });
    return response;
}

// DELETE request
async function deleteStudent(isu) {
    
    const response = await fetch(`${API_BASE}/requests/${isu}`, {
        method: "DELETE"
    });
    return response;
}
