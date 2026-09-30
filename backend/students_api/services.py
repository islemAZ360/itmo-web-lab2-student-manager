from .repository import get_all_students, get_student_by_isu

def get_filtered_students(query_params):
    """
    filtering acording to Query Parameters (group, dormitory) after fetching all student
    """
    students = get_all_students()
    
    # query parameters from URL(for example: ?group=M3301&dormitory=8)
    group = query_params.get('group')
    dormitory = query_params.get('dormitory')
    
    #filtering by list comprehension 
    if group:
        students = [s for s in students if s.get('group') == group]
        
    if dormitory:
        # for avoiding micmatch in int/string type converting to string 
        students = [s for s in students if str(s.get('dormitory')) == str(dormitory)]
        
    return students

def get_student(isu_id):
    """
    search single student by specific ISU ID
    """
    return get_student_by_isu(isu_id)