from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    StudentDashboardViewSet, RecruiterDashboardViewSet,
    SkillDiagnosticViewSet, CareerCoachViewSet,
    AdminVerificationViewSet, FacultyViewSet, JobViewSet,
    DigiLockerVerificationViewSet, AuthViewSet
)

router = DefaultRouter()
router.register(r'auth', AuthViewSet, basename='auth')
router.register(r'jobs', JobViewSet, basename='jobs')
router.register(r'student', StudentDashboardViewSet, basename='student')
router.register(r'recruiter', RecruiterDashboardViewSet, basename='recruiter')
router.register(r'diagnostic', SkillDiagnosticViewSet, basename='diagnostic')
router.register(r'coach', CareerCoachViewSet, basename='coach')
router.register(r'admin-verification', AdminVerificationViewSet, basename='admin-verification')
router.register(r'faculty', FacultyViewSet, basename='faculty')
router.register(r'verification', DigiLockerVerificationViewSet, basename='verification')


urlpatterns = [
    path('', include(router.urls)),
]
