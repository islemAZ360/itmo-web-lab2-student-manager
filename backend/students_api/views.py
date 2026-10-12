import json
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .services import (
    get_filtered_students,
    get_student,
    create_student,
    edit_student,
    remove_student,
    ValidationError
)


@api_view(['GET', 'QUERY', 'POST'])

def student_list(request):
    try:
        # create stedent
        if request.method == 'POST':
            try:
                student = create_student(request.data)
                return Response(student, status=status.HTTP_201_CREATED)
            except ValueError as err:
                if "already exists" in str(err):
                    return Response({"error": str(err)}, status=status.HTTP_409_CONFLICT)
                return Response({"error": str(err)}, status=status.HTTP_400_BAD_REQUEST)
            except ValidationError as err:
                return Response({"error": str(err)}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        
        # get / filter students
        if request.method == 'GET':
            filters = request.query_params
        elif request.method == 'QUERY':
            # parse json body manualy
            try:
                filters = json.loads(request.body.decode('utf-8')) if request.body else {}
            except json.JSONDecodeError:
                return Response(
                    {"error": "invalid json format"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            filters = {}

        students = get_filtered_students(filters)
        return Response(students, status=status.HTTP_200_OK)
    
    except Exception as err:
        return Response({"error": f"Internal server error: {str(err)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET', 'PATCH', 'DELETE'])

def student_detail(request, isu_id):
    try:
    
        # delete stedent
        if request.method == 'DELETE':
                success = remove_student(isu_id)
                if not success:
                    return Response({"error": "student not found"}, status=status.HTTP_404_NOT_FOUND)
                
                return Response(status=status.HTTP_204_NO_CONTENT)

        # update student
        if request.method == 'PATCH':
            try:
                student = edit_student(isu_id, request.data)
                if not student:
                    return Response({"error": "student not found"}, status=status.HTTP_404_NOT_FOUND)
                return Response(student, status=status.HTTP_200_OK)
            except ValidationError as err:
                return Response({"error": str(err)}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
            except ValueError as err:
                return Response({"error": str(err)}, status=status.HTTP_400_BAD_REQUEST)
            
        # get student
        student = get_student(isu_id)
        if not student:
            return Response({"error": "student not found"}, status=status.HTTP_404_NOT_FOUND)
        
        return Response(student, status=status.HTTP_200_OK)
    except Exception as err:
            return Response({"error": f"Internal server error: {str(err)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)