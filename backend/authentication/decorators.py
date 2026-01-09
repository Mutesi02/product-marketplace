from functools import wraps
from rest_framework.response import Response
from rest_framework import status

def admin_required(view_func):
    """Decorator to ensure only admin users can access the view"""
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not hasattr(request.user, 'profile') or request.user.profile.role != 'admin':
            return Response(
                {'error': 'Admin access required'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        return view_func(request, *args, **kwargs)
    return wrapper

def role_required(allowed_roles):
    """Decorator to ensure user has one of the allowed roles"""
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            if not hasattr(request.user, 'profile') or request.user.profile.role not in allowed_roles:
                return Response(
                    {'error': f'Access denied. Required roles: {", ".join(allowed_roles)}'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator