from .storage import (
    get_all_students,
    get_student_by_isu,
    save_student,
    update_student,
    delete_student
)


def get_filtered_students(query_params):
    students = get_all_students()

    group = query_params.get("group")
    dormitory = query_params.get("dormitory")

    # Filter by group
    if group:
        students = [s for s in students if s.get("group") == group]

# Filter by dormitory 
    if dormitory:
        students = [
            s for s in students 
            if str(s.get("dormitoryNumber") or s.get("dormitory")) == str(dormitory)
            ]
    return students


def get_student(isu_id):
    return get_student_by_isu(isu_id)

# creating with validation checking

def create_student(data):

    if not data or not data.get("isuId") or not data.get("fullName"):

        raise ValueError("Missing required fields")

    isu_id = data.get("isuId")
    if get_student(isu_id):
        raise ValueError("Student with this ISU ID already exists")
    
    return save_student(data)


def edit_student(isu_id, updated_data):
    return update_student(isu_id, updated_data)


def remove_student(isu_id):
    return delete_student(isu_id)