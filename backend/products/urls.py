from django.urls import path
from . import views

urlpatterns = [
    path('', views.ProductListCreateView.as_view(), name='product-list-create'),
    path('<int:pk>/', views.ProductDetailView.as_view(), name='product-detail'),
    path('pending/', views.pending_products, name='pending-products'),
    path('stats/', views.approval_stats, name='approval-stats'),
    path('analytics/', views.analytics_data, name='analytics-data'),
    path('<int:product_id>/approve/', views.approve_product, name='approve-product'),
    path('<int:product_id>/reject/', views.reject_product, name='reject-product'),
    path('<int:product_id>/submit/', views.submit_for_approval, name='submit-for-approval'),
    path('public/', views.public_products, name='public-products'),
]