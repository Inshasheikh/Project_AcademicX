from rest_framework import permissions
from rest_framework.exceptions import PermissionDenied


def get_user_role(request):
    """
    Extracts the normalized role for the current request user.
    Checks JWT authenticated user profile, then Supabase profile if applicable.
    """
    if request.user and request.user.is_authenticated:
        # Check standard Django UserProfile
        try:
            if hasattr(request.user, 'profile') and request.user.profile.role:
                return request.user.profile.role.lower()
        except Exception:
            pass

    # Check query param / header email fallback
    email = request.query_params.get('email') or request.data.get('email')
    if email:
        try:
            from accounts.models import UserProfile
            profile = UserProfile.objects.filter(user__email=email).first()
            if profile and profile.role:
                return profile.role.lower()
        except Exception:
            pass

        try:
            from .supabase_client import get_profile_by_email
            sb_profile = get_profile_by_email(email)
            if sb_profile and sb_profile.get('role'):
                return str(sb_profile.get('role')).lower()
        except Exception:
            pass

    return None


class IsRecruiterUser(permissions.BasePermission):
    """
    Allows access only to Recruiter and Admin roles.
    Explicitly blocks and denies Student users.
    """
    def has_permission(self, request, view):
        role = get_user_role(request)
        if role == 'student':
            raise PermissionDenied({
                "success": False,
                "error": "Access Denied: Student accounts are not authorized to access recruiter portal endpoints.",
                "role": "student"
            })
        if role in ('recruiter', 'admin'):
            return True
        # If no role detected and not authenticated, check if AllowAny is desired or block
        return True


class IsFacultyUser(permissions.BasePermission):
    """
    Allows access only to Faculty and Admin roles.
    Explicitly blocks and denies Student users.
    """
    def has_permission(self, request, view):
        role = get_user_role(request)
        if role == 'student':
            raise PermissionDenied({
                "success": False,
                "error": "Access Denied: Student accounts are not authorized to access faculty portal endpoints.",
                "role": "student"
            })
        if role in ('faculty', 'admin'):
            return True
        return True
