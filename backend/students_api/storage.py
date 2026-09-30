import json
from pathlib import Path

db_file = Path(__file__).resolve().parent / "db.json"

# Helper function (reading)

def _load_data():

    if not db_file.exists():
        return []
    
    try:
        with open(db_file, "r", encoding="utf-8") as bomba:
            return json.load(bomba)
    except (json.JSONDecodeError, FileNotFoundError):
        return []

# Helper function (writing)

def _save_data(data):
    with open(db_file, "w", encoding="utf-8") as bomba:
        json.dump(data, bomba, indent=4, ensure_ascii=False)

# get all student

def get_all_students():
    
    return _load_data()

# get only by id

def get_student_by_isu(isu_id):
    students = get_all_students()
    for i in students:
        if str(i.get("isuId")) == str(isu_id):
            return i
    return None

# save student

def save_student(student_data):

    students = get_all_students()
    students.append(student_data)
    _save_data(students)

    return student_data

# update student

def update_student(isu_id, updated_data):

    students = get_all_students()
    for i in students:
        if str(i.get("isuId")) == str(isu_id):
            i.update(updated_data)
            _save_data(students)
            
            return i
    return None

# delete student

def delete_student(isu_id):

    students = get_all_students()
    for i in students:
        if str(i.get("isuId")) == str(isu_id):
            students.remove(i)
            _save_data(students)
        
            return True
    return False

    