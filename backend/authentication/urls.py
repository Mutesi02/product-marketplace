from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views, dashboard_views

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.login_view, name='login'),
    path('profile/', views.profile_view, name='profile'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Dashboard routes
    path('dashboard/', dashboard_views.get_user_dashboard, name='user_dashboard'),
    path('dashboard/admin/', dashboard_views.admin_dashboard, name='admin_dashboard'),
    path('dashboard/editor/', dashboard_views.editor_dashboard, name='editor_dashboard'),
    path('dashboard/approver/', dashboard_views.approver_dashboard, name='approver_dashboard'),
    path('dashboard/viewer/', dashboard_views.viewer_dashboard, name='viewer_dashboard'),
]