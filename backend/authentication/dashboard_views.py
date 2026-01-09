from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .decorators import role_required, admin_required
import json

@csrf_exempt
@require_http_methods(["GET"])
@admin_required
def admin_dashboard(request):
    """Admin dashboard with full business management"""
    user = request.user
    profile = user.profile
    
    # Get business statistics
    business = profile.business
    total_users = business.users.count()
    
    dashboard_data = {
        'user': {
            'username': user.username,
            'email': user.email,
            'role': profile.role,
            'business': business.name
        },
        'permissions': {
            'can_create_product': profile.can_create_product(),
            'can_approve_product': profile.can_approve_product(),
            'can_manage_users': profile.can_manage_users()
        },
        'business_stats': {
            'total_users': total_users,
            'business_name': business.name,
            'industry': business.industry,
            'company_size': business.company_size
        },
        'dashboard_type': 'admin'
    }
    
    return JsonResponse(dashboard_data)

@csrf_exempt
@require_http_methods(["GET"])
@role_required(['editor'])
def editor_dashboard(request):
    """Editor dashboard for content creation"""
    user = request.user
    profile = user.profile
    
    dashboard_data = {
        'user': {
            'username': user.username,
            'email': user.email,
            'role': profile.role,
            'business': profile.business.name
        },
        'permissions': {
            'can_create_product': profile.can_create_product(),
            'can_approve_product': profile.can_approve_product(),
            'can_manage_users': profile.can_manage_users()
        },
        'dashboard_type': 'editor'
    }
    
    return JsonResponse(dashboard_data)

@csrf_exempt
@require_http_methods(["GET"])
@role_required(['approver'])
def approver_dashboard(request):
    """Approver dashboard for content approval"""
    user = request.user
    profile = user.profile
    
    dashboard_data = {
        'user': {
            'username': user.username,
            'email': user.email,
            'role': profile.role,
            'business': profile.business.name
        },
        'permissions': {
            'can_create_product': profile.can_create_product(),
            'can_approve_product': profile.can_approve_product(),
            'can_manage_users': profile.can_manage_users()
        },
        'dashboard_type': 'approver'
    }
    
    return JsonResponse(dashboard_data)

@csrf_exempt
@require_http_methods(["GET"])
@role_required(['viewer'])
def viewer_dashboard(request):
    """Viewer dashboard for read-only access"""
    user = request.user
    profile = user.profile
    
    dashboard_data = {
        'user': {
            'username': user.username,
            'email': user.email,
            'role': profile.role,
            'business': profile.business.name
        },
        'permissions': {
            'can_create_product': profile.can_create_product(),
            'can_approve_product': profile.can_approve_product(),
            'can_manage_users': profile.can_manage_users()
        },
        'dashboard_type': 'viewer'
    }
    
    return JsonResponse(dashboard_data)

@csrf_exempt
@require_http_methods(["GET"])
def get_user_dashboard(request):
    """Route user to appropriate dashboard based on role"""
    from rest_framework_simplejwt.authentication import JWTAuthentication
    from rest_framework.exceptions import AuthenticationFailed
    
    # Authenticate user
    jwt_auth = JWTAuthentication()
    try:
        user, token = jwt_auth.authenticate(request)
        if not user or not hasattr(user, 'profile'):
            return JsonResponse(
                {'error': 'Authentication required'}, 
                status=401
            )
    except AuthenticationFailed:
        return JsonResponse(
            {'error': 'Invalid token'}, 
            status=401
        )
    
    # Route based on role
    role = user.profile.role
    
    if role == 'admin':
        return admin_dashboard(request)
    elif role == 'editor':
        return editor_dashboard(request)
    elif role == 'approver':
        return approver_dashboard(request)
    elif role == 'viewer':
        return viewer_dashboard(request)
    else:
        return JsonResponse(
            {'error': 'Invalid user role'}, 
            status=403
        )