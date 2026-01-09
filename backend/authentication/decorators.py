from functools import wraps
from django.http import JsonResponse
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed

def role_required(allowed_roles):
    """
    Decorator to check if user has required role
    Usage: @role_required(['admin', 'editor'])
    """
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            # Check if user is authenticated
            jwt_auth = JWTAuthentication()
            try:
                user, token = jwt_auth.authenticate(request)
                if not user:
                    return JsonResponse(
                        {'error': 'Authentication required'}, 
                        status=status.HTTP_401_UNAUTHORIZED
                    )
            except AuthenticationFailed:
                return JsonResponse(
                    {'error': 'Invalid token'}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            # Check if user has profile
            if not hasattr(user, 'profile'):
                return JsonResponse(
                    {'error': 'User profile not found'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Check role permission
            user_role = user.profile.role
            if user_role not in allowed_roles:
                return JsonResponse(
                    {'error': f'Access denied. Required roles: {allowed_roles}'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Add user to request for easy access
            request.user = user
            return view_func(request, *args, **kwargs)
        
        return wrapper
    return decorator

def admin_required(view_func):
    """Shortcut decorator for admin-only access"""
    return role_required(['admin'])(view_func)

def editor_or_admin_required(view_func):
    """Shortcut decorator for editor/admin access"""
    return role_required(['admin', 'editor'])(view_func)

def approver_or_admin_required(view_func):
    """Shortcut decorator for approver/admin access"""
    return role_required(['admin', 'approver'])(view_func)