from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

ROLE_CHOICES = [
    ('student', 'Student'),
    ('faculty', 'Faculty'),
    ('recruiter', 'Recruiter'),
    ('admin', 'Admin'),
]

PURPOSE_CHOICES = [
    ('login', 'Login'),
    ('register', 'Register'),
    ('reset_password', 'Reset Password'),
]

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    phone = models.CharField(max_length=20, blank=True, null=True)
    college = models.CharField(max_length=255, blank=True, null=True)
    department = models.CharField(max_length=255, blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email} - {self.role}"


class OTPVerification(models.Model):
    email = models.CharField(max_length=255)  # Can store email or phone identifier
    phone = models.CharField(max_length=20, blank=True, null=True)
    otp_code = models.CharField(max_length=6)
    expires_at = models.DateTimeField()
    verified = models.BooleanField(default=False)
    purpose = models.CharField(max_length=20, choices=PURPOSE_CHOICES, default='login')
    attempts = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def is_valid(self):
        return (not self.verified) and (self.attempts < 5) and (timezone.now() <= self.expires_at)

    def __str__(self):
        return f"{self.email} ({self.purpose}) - {self.otp_code} [Attempts: {self.attempts}/5] [{'VALID' if self.is_valid() else 'EXPIRED/USED'}]"
