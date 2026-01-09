from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Product
from .serializers import ProductSerializer, ProductCreateSerializer
from authentication.decorators import role_required

class ProductListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ProductCreateSerializer
        return ProductSerializer
    
    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'profile'):
            return Product.objects.filter(business=user.profile)
        return Product.objects.none()

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'profile'):
            return Product.objects.filter(business=user.profile)
        return Product.objects.none()

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
@role_required(['approver', 'admin'])
def approve_product(request, product_id):
    if not hasattr(request.user, 'profile'):
        return Response({'error': 'User profile not found'}, status=400)
    product = get_object_or_404(Product, id=product_id, business=request.user.profile)
    product.status = 'approved'
    product.save()
    serializer = ProductSerializer(product)
    return Response(serializer.data)

@api_view(['GET'])
def public_products(request):
    """Public endpoint for approved products"""
    products = Product.objects.filter(status='approved')
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)