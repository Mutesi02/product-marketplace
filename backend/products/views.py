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

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
@role_required(['approver', 'admin'])
def pending_products(request):
    """Get all products pending approval"""
    products = Product.objects.filter(status='pending_approval')
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
@role_required(['approver', 'admin'])
def approve_product(request, product_id):
    """Approve a product"""
    product = get_object_or_404(Product, id=product_id)
    if product.status != 'pending_approval':
        return Response({'error': 'Product is not pending approval'}, status=400)
    
    product.status = 'approved'
    product.save()
    serializer = ProductSerializer(product)
    return Response(serializer.data)

@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
@role_required(['approver', 'admin'])
def reject_product(request, product_id):
    """Reject a product"""
    product = get_object_or_404(Product, id=product_id)
    if product.status != 'pending_approval':
        return Response({'error': 'Product is not pending approval'}, status=400)
    
    product.status = 'rejected'
    product.save()
    serializer = ProductSerializer(product)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
@role_required(['approver', 'admin'])
def approval_stats(request):
    """Get approval statistics for approver dashboard"""
    from django.utils import timezone
    
    today = timezone.now().date()
    
    pending_count = Product.objects.filter(status='pending_approval').count()
    approved_today = Product.objects.filter(
        status='approved',
        updated_at__date=today
    ).count()
    total_reviewed = Product.objects.filter(
        status__in=['approved', 'rejected']
    ).count()
    
    stats = {
        'pending_reviews': pending_count,
        'approved_today': approved_today,
        'total_reviewed': total_reviewed,
        'avg_review_time': '0h'
    }
    
    return Response(stats)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
@role_required(['approver', 'admin'])
def analytics_data(request):
    """Get comprehensive analytics data for approver dashboard"""
    from django.utils import timezone
    from datetime import timedelta
    from django.db.models import Count, Q
    
    today = timezone.now().date()
    week_ago = today - timedelta(days=7)
    
    # Basic counts
    total_products = Product.objects.count()
    approved_count = Product.objects.filter(status='approved').count()
    rejected_count = Product.objects.filter(status='rejected').count()
    pending_count = Product.objects.filter(status='pending_approval').count()
    
    # Calculate approval rate
    reviewed_total = approved_count + rejected_count
    approval_rate = (approved_count / reviewed_total * 100) if reviewed_total > 0 else 0
    
    # Weekly trends
    weekly_approved = Product.objects.filter(
        status='approved',
        updated_at__date__gte=week_ago
    ).count()
    
    weekly_rejected = Product.objects.filter(
        status='rejected',
        updated_at__date__gte=week_ago
    ).count()
    
    # Top editors by approval rate
    editor_stats = Product.objects.filter(
        status__in=['approved', 'rejected']
    ).values('business__user__first_name', 'business__user__email').annotate(
        total=Count('id'),
        approved=Count('id', filter=Q(status='approved'))
    ).order_by('-approved')[:5]
    
    # Add approval rate and name to editor stats
    for editor in editor_stats:
        editor['approval_rate'] = (editor['approved'] / editor['total'] * 100) if editor['total'] > 0 else 0
        editor['name'] = editor['business__user__first_name'] or editor['business__user__email']
    
    analytics = {
        'overview': {
            'total_products': total_products,
            'approved_count': approved_count,
            'rejected_count': rejected_count,
            'pending_count': pending_count,
            'approval_rate': round(approval_rate, 1),
            'reviewed_total': reviewed_total
        },
        'trends': {
            'weekly_approved': weekly_approved,
            'weekly_rejected': weekly_rejected,
            'weekly_total': weekly_approved + weekly_rejected
        },
        'top_editors': list(editor_stats)
    }
    
    return Response(analytics)

@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
def submit_for_approval(request, product_id):
    """Submit a product for approval"""
    user = request.user
    if not hasattr(user, 'profile'):
        return Response({'error': 'User profile not found'}, status=400)
    
    product = get_object_or_404(Product, id=product_id, business=user.profile)
    if product.status != 'draft':
        return Response({'error': 'Only draft products can be submitted for approval'}, status=400)
    
    product.status = 'pending_approval'
    product.save()
    serializer = ProductSerializer(product)
    return Response(serializer.data)

@api_view(['GET'])
def public_products(request):
    """Public endpoint for approved products"""
    products = Product.objects.filter(status='approved')
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)