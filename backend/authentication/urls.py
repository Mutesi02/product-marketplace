from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views, dashboard_views, admin_views

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
    
    # Admin endpoints
    path('admin/stats/', admin_views.admin_stats, name='admin-stats'),
    path('admin/users/', admin_views.all_users, name='admin-users'),
    path('admin/users/create/', admin_views.create_user, name='create-user'),
    path('admin/users/<int:user_id>/update/', admin_views.update_user, name='update-user'),
    path('admin/users/<int:user_id>/delete/', admin_views.delete_user, name='delete-user'),
    path('admin/products/', admin_views.all_products, name='admin-products'),
    path('admin/products/<int:product_id>/update/', admin_views.update_product, name='update-product'),
    path('admin/products/<int:product_id>/delete/', admin_views.delete_product, name='delete-product'),
    path('admin/activities/', admin_views.recent_activities, name='recent-activities'),
    path('viewer/stats/', admin_views.viewer_stats, name='viewer-stats'),
]