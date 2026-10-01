from .storage import (
    get_all_students,
    get_student_by_isu,
    save_student,
    update_student,
    delete_student
)
import re

class ValidationError(Exception):
    pass


def get_filtered_students(query_params):
    students = get_all_students()
    if not query_params:
        return students

    name = query_params.get("fullName") or query_params.get("name")
    group = query_params.get("group")
    dormitory = query_params.get("dormitory") or query_params.get("dormitoryNumber")
    room = query_params.get("room")
    isu_id = query_params.get("isuId") or query_params.get("isu")

    if name:
        students = [s for s in students if name.strip().lower() in str(s.get("fullName", "")).lower()]
    if group:
        students = [s for s in students if str(s.get("group", "")).strip().lower() == str(group).strip().lower()]
    if dormitory:
        students = [s for s in students if str(s.get("dormitoryNumber", "")).strip() == str(dormitory).strip()]
    if room:
        students = [s for s in students if str(s.get("room", "")).strip() == str(room).strip()]
    if isu_id:
        students = [s for s in students if str(s.get("isuId", "")).strip() == str(isu_id).strip()]

    return students


def get_student(isu_id):
    return get_student_by_isu(isu_id)

# creating with validation checking

def create_student(data):
    if "isuId" in data and not re.match(r"^\d{6}$", str(data.get("isuId")).strip()):
        raise ValidationError("ISU ID must be exactly 6 digits")

    if "group" in data and not re.match(r"^[A-Z]\d{4}$", str(data.get("group")).strip()):
        raise ValidationError("Group format must be like P3278")

    if not data or not data.get("isuId") or not data.get("fullName"):

        raise ValueError("Missing required fields")

    isu_id = data.get("isuId")
    if get_student(isu_id):
        raise ValueError("Student with this ISU ID already exists")
    
    return save_student(data)


def edit_student(isu_id, updated_data):
    if not updated_data:
        raise ValueError("Empty body")
    if "group" in updated_data and not re.match(r"^[A-Z]\d{4}$", str(updated_data.get("group")).strip()):
        raise ValidationError("Group format must be like P3278")
    return update_student(isu_id, updated_data)


def remove_student(isu_id):
    return delete_student(isu_id)