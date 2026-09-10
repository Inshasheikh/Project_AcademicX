from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    StudentProfile, RecruiterProfile, FacultyProfile,
    Job, Application, SkillDiagnostic, VerificationQueue, MockInterviewSession
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class StudentProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = StudentProfile
        fields = '__all__'

class RecruiterProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = RecruiterProfile
        fields = '__all__'

class FacultyProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = FacultyProfile
        fields = '__all__'

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'

class ApplicationSerializer(serializers.ModelSerializer):
    student = StudentProfileSerializer(read_only=True)
    job = JobSerializer(read_only=True)
    class Meta:
        model = Application
        fields = '__all__'

class SkillDiagnosticSerializer(serializers.ModelSerializer):
    class Meta:
        model = SkillDiagnostic
        fields = '__all__'

class VerificationQueueSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.user.get_full_name', read_only=True)
    student_email = serializers.CharField(source='student.user.email', read_only=True)
    college = serializers.CharField(source='student.college', read_only=True)
    apaar_id = serializers.CharField(source='student.apaar_id', read_only=True)

    class Meta:
        model = VerificationQueue
        fields = '__all__'

class MockInterviewSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MockInterviewSession
        fields = '__all__'
