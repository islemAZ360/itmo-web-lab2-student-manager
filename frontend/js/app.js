// track current edit state
let currentEditingIsu = null;

// init page events
document.addEventListener("DOMContentLoaded", () => {
    // Once the page loads, it will fetch data from the API and render the table.
    renderTable();

    // open add form
    document.getElementById("show-add-form-btn").addEventListener("click", () => {
        openAddForm();
    });

    // cancel and hide form
    document.getElementById("cancel-form-btn").addEventListener("click", () => {
        closeForm();
    });

    // close dossier card
    document.getElementById("close-dossier-btn").addEventListener("click", () => {
        document.getElementById("student-dossier").style.display = "none";
    });

    // submit form
    document.getElementById("student-form").addEventListener("submit", handleFormSubmit);

    // --- filtering event(Issue #4 & #5) ---
    const filterGetBtn = document.getElementById('filter-get-btn');
    const filterQueryBtn = document.getElementById('filter-query-btn');

    if (filterGetBtn && filterQueryBtn) {
        // GET Request Filter
        filterGetBtn.addEventListener('click', () => {
            const group = document.getElementById('filter-group').value.trim();
            const dormitory = document.getElementById('filter-dormitory').value.trim();
            
            const params = new URLSearchParams();
            if (group) params.append('group', group);
            if (dormitory) params.append('dormitory', dormitory);
            
            const queryString = params.toString() ? `?${params.toString()}` : "";
            renderTable(queryString);
        });

        // QUERY Request Filter
        filterQueryBtn.addEventListener('click', async () => {
            const group = document.getElementById('filter-group').value.trim();
            const dormitory = document.getElementById('filter-dormitory').value.trim();
            
            const filters = {};
            if (group) filters.group = group;
            if (dormitory) filters.dormitory = dormitory;
            
            try {
                const students = await fetchStudentsWithQueryMethod(filters);
                updateTableHTML(students);
            } catch (error) {
                console.error("QUERY Filter Error:", error);
                alert("There was a problem filtering the data.!");
            }
        });
    }
});

// fetch and render table rows
async function renderTable(queryString = "") {
    const tableBody = document.getElementById("student-body");
    tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center;">Loading data from server...</td></tr>`;
    
    try {
        const students = await fetchStudents(queryString);
        updateTableHTML(students);
    } catch (error) {
        console.error("Fetch error:", error);
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: red;">Failed to connect to backend API</td></tr>`;
    }
}

// helper function to update HTML table
function updateTableHTML(students) {
    const tableBody = document.getElementById("student-body");
    tableBody.innerHTML = "";

    if (students.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center;">No students found</td></tr>`;
        return;
    }

    students.forEach(student => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${student.fullName}</td>
            <td>${student.group}</td>
            <td>${student.isuId}</td>
            <td>${student.room}</td>
            <td>
                <button onclick="viewStudent('${student.isuId}')">View</button>
                <button onclick="editStudent('${student.isuId}')">Edit</button>
                <button onclick="removeStudent('${student.isuId}')">Delete</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

// show empty form
function openAddForm() {
    currentEditingIsu = null;
    document.getElementById("student-form").reset();
    document.getElementById("form-title").textContent = "Add Student";
    document.getElementById("isuId").readOnly = false;
    document.getElementById("student-form-section").style.display = "block";
    document.getElementById("student-dossier").style.display = "none";
}

// show form with current student data (API CALL)
async function editStudent(isu) {
    try {
        const student = await fetchStudentById(isu);
        if (!student) {
            alert("Student not found on server!");
            return;
        }

        currentEditingIsu = isu;
        document.getElementById("form-title").textContent = "Edit Student";

        // fill inputs
        document.getElementById("fullName").value = student.fullName;
        document.getElementById("group").value = student.group;
        document.getElementById("isuId").value = student.isuId;
        document.getElementById("isuId").readOnly = true; // lock isu
        document.getElementById("dormitoryNumber").value = student.dormitoryNumber;
        document.getElementById("room").value = student.room;
        document.getElementById("accommodationPeriod").value = student.accommodationPeriod;
        document.getElementById("isInternational").checked = student.isInternational || student.isForeigner;
        document.getElementById("notes").value = student.notes || "";

        document.getElementById("student-form-section").style.display = "block";
        document.getElementById("student-dossier").style.display = "none";
    } catch (error) {
        console.error("Error editing student:", error);
    }
}

// reset and hide form
function closeForm() {
    document.getElementById("student-form").reset();
    document.getElementById("isuId").readOnly = false;
    currentEditingIsu = null;
    document.getElementById("student-form-section").style.display = "none";
}

// handle save (API CALL for POST or PATCH)
async function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;

    if (!form.reportValidity()) return;

    const isuId = document.getElementById("isuId").value.trim();

    const studentData = {
        fullName: document.getElementById("fullName").value.trim(),
        group: document.getElementById("group").value.trim(),
        isuId: isuId,
        dormitoryNumber: document.getElementById("dormitoryNumber").value,
        room: document.getElementById("room").value,
        accommodationPeriod: document.getElementById("accommodationPeriod").value,
        isInternational: document.getElementById("isInternational").checked,
        notes: document.getElementById("notes").value.trim()
    };

    try {
        let response;
        if (currentEditingIsu) {
            response = await updateStudent(currentEditingIsu, studentData); // PATCH API
        } else {
            response = await addStudent(studentData); // POST API
        }

        if (response.ok) {
            closeForm();
            renderTable(); // Refresh table from server
        } else {
            const errData = await response.json();
            // It will issue an alert if an HTTP Code 409 (Conflict) or any other error occurs.
            alert(errData.error || "operation failed!"); 
        }
    } catch (error) {
        console.error("Form submit error:", error);
        alert("There was a problem communicating with the server!");
    }
}

// show dossier info (API CALL)
async function viewStudent(isu) {
    try {
        const student = await fetchStudentById(isu);
        if (!student) {
            alert("Student not found on server!");
            return;
        }

        document.getElementById("dossier-name").textContent = student.fullName;
        document.getElementById("dossier-group").textContent = student.group;
        document.getElementById("dossier-isu").textContent = student.isuId;
        document.getElementById("dossier-dorm").textContent = student.dormitoryNumber;
        document.getElementById("dossier-room").textContent = student.room;
        document.getElementById("dossier-date").textContent = student.accommodationPeriod;
        document.getElementById("dossier-foreign").textContent = (student.isInternational || student.isForeigner) ? "Yes" : "No";
        document.getElementById("dossier-notes").textContent = student.notes || "None";

        document.getElementById("student-dossier").style.display = "block";
        document.getElementById("student-form-section").style.display = "none";
    } catch (error) {
        console.error("Error viewing student:", error);
    }
}

// delete student (API CALL)
async function removeStudent(isu) {
    if (confirm(`Are you sure you want to delete student with ISU ${isu}?`)) {
        try {
            const response = await deleteStudent(isu); // DELETE API
            if (response.ok || response.status === 204) {
                document.getElementById("student-dossier").style.display = "none";
                renderTable(); // Refresh table
            } else {
                alert("The student could not be deleted (perhaps they were not found)!");
            }
        } catch (error) {
            console.error("Delete error:", error);
        }
    }
}