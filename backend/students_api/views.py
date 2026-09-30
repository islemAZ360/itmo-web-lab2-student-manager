from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .services import get_filtered_students, get_student
import json 

@api_view(['GET', 'QUERY'])
def student_list(request):
    """
    GET /api/requests - URL query params (request.query_params)
    QUERY /api/requests - Body JSON (request.body)
    """
    if request.method == 'GET':
        filters = request.query_params
    elif request.method == 'QUERY':
        # manually json persing for custom method
        try:
            # will decode if body not empty ,otherwise empty dictionary
            filters = json.loads(request.body.decode('utf-8')) if request.body else {}
        except json.JSONDecodeError:
            # As Unified error format 400 Bad Request
            return Response(
                {"error": "wrong JSON formate!"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    else:
        filters = {}

    students = get_filtered_students(filters)
    return Response(students, status=status.HTTP_200_OK)
@api_view(['GET'])
def student_detail(request, pk):
    """
    GET /api/requests/:id
    search specific student by ISU ID ,if not found than return 404 as Unified Error Format 
    """
    student = get_student(pk)
    
    if not student:
        # Unified error response format
        return Response(
            {"error": "student not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )
        
    return Response(student, status=status.HTTP_200_OK)