from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from accounts.models import UserProfile


class RBACTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create a Student user
        self.student_user = User.objects.create_user(
            username='student_test@example.com',
            email='student_test@example.com',
            password='password123'
        )
        self.student_profile = UserProfile.objects.create(
            user=self.student_user,
            role='student',
            is_verified=True
        )

        # Create a Recruiter user
        self.recruiter_user = User.objects.create_user(
            username='recruiter_test@example.com',
            email='recruiter_test@example.com',
            password='password123'
        )
        self.recruiter_profile = UserProfile.objects.create(
            user=self.recruiter_user,
            role='recruiter',
            is_verified=True
        )

        # Create a Faculty user
        self.faculty_user = User.objects.create_user(
            username='faculty_test@example.com',
            email='faculty_test@example.com',
            password='password123'
        )
        self.faculty_profile = UserProfile.objects.create(
            user=self.faculty_user,
            role='faculty',
            is_verified=True
        )

    def test_student_cannot_access_recruiter_stats(self):
        # Authenticate as student
        self.client.force_authenticate(user=self.student_user)
        response = self.client.get('/api/recruiter/stats/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_student_cannot_access_faculty_overview(self):
        # Authenticate as student
        self.client.force_authenticate(user=self.student_user)
        response = self.client.get('/api/faculty/overview/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_recruiter_can_access_recruiter_stats(self):
        # Authenticate as recruiter
        self.client.force_authenticate(user=self.recruiter_user)
        response = self.client.get('/api/recruiter/stats/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_faculty_can_access_faculty_overview(self):
        # Authenticate as faculty
        self.client.force_authenticate(user=self.faculty_user)
        response = self.client.get('/api/faculty/overview/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
