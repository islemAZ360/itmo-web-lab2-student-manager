from django.urls import path
from . import views

urlpatterns = [
    path('requests', views.student_list, name='student-list'),
    path('requests/<str:isu_id>', views.student_detail, name='student-detail'),
]