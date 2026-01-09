from django.urls import path
from . import views

urlpatterns = [
    path('', views.ProductListView.as_view(), name='product-list'),
    path('create/', views.ProductCreateView.as_view(), name='product-create'),
    path('my-products/', views.MyProductsView.as_view(), name='my-products'),
    path('<int:pk>/', views.ProductDetailView.as_view(), name='product-detail'),
]