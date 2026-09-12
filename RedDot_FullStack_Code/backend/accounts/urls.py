from django.urls import path
from .views import (
    SendOTPView, VerifyOTPView, RegisterView, LoginView,
    ResetPasswordView, LogoutView, MeView, RoleSelectionView
)

urlpatterns = [
    path('send-otp/', SendOTPView.as_view(), name='send-otp'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset-password'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('me/', MeView.as_view(), name='me'),
    path('role/', RoleSelectionView.as_view(), name='role-selection'),
]
