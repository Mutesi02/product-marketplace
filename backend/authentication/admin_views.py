from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.db.models import Count
from .models import UserProfile, Business
from products.models import Product
from .serializers import UserSerializer
from .decorators import admin_required, role_required

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_required
def admin_stats(request):
    """Get admin dashboard statistics"""
    stats = {
        'total_users': User.objects.count(),
        'total_products': Product.objects.count(),
        'pending_approvals': Product.objects.filter(status='pending_approval').count(),
        'total_businesses': Business.objects.count()
    }
    return Response(stats)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_required
def all_users(request):
    """Get all users for admin management"""
    users = User.objects.select_related('profile', 'profile__business').all()
    return Response(UserSerializer(users, many=True).data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_required
def all_products(request):
    """Get all products for admin management"""
    from products.serializers import ProductSerializer
    products = Product.objects.select_related('created_by', 'business').all()
    return Response(ProductSerializer(products, many=True).data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_required
def recent_activities(request):
    """Get recent activities for admin dashboard"""
    # Mock activities - in real app, you'd have an Activity model
    activities = [
        {
            'user': 'John Smith',
            'action': 'Created product "Wireless Headphones"',
            'time': '2024-01-15T10:30:00Z',
            'status': 'pending_approval'
        },
        {
            'user': 'Sarah Johnson',
            'action': 'Approved product "Smart Watch"',
            'time': '2024-01-15T09:15:00Z',
            'status': 'approved'
        }
    ]
    return Response(activities)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
@admin_required
def update_user_role(request, user_id):
    """Update user role"""
    try:
        user = User.objects.get(id=user_id)
        new_role = request.data.get('role')
        
        if new_role not in ['admin', 'editor', 'approver', 'viewer']:
            return Response({'error': 'Invalid role'}, status=status.HTTP_400_BAD_REQUEST)
        
        user.profile.role = new_role
        user.profile.save()
        
        return Response({'message': 'Role updated successfully'})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@admin_required
def create_user(request):
    """Create a new user"""
    from django.contrib.auth.hashers import make_password
    data = request.data
    required_fields = ['first_name', 'last_name', 'email', 'password', 'role']
    for field in required_fields:
        if field not in data:
            return Response({'error': f'{field} is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    if User.objects.filter(email=data['email']).exists():
        return Response({'error': 'User with this email already exists'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.create(
            first_name=data['first_name'],
            last_name=data['last_name'],
            email=data['email'],
            username=data['email'],  # Use email as username
            password=make_password(data['password'])
        )
        UserProfile.objects.create(
            user=user,
            role=data['role'],
            business_id=data.get('business_id')  # Optional
        )
        return Response({'message': 'User created successfully', 'user_id': user.id}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
@admin_required
def update_user(request, user_id):
    """Update user details"""
    try:
        user = User.objects.get(id=user_id)
        data = request.data
        
        # Update user fields
        if 'first_name' in data:
            user.first_name = data['first_name']
        if 'last_name' in data:
            user.last_name = data['last_name']
        if 'email' in data:
            if User.objects.filter(email=data['email']).exclude(id=user_id).exists():
                return Response({'error': 'Email already in use'}, status=status.HTTP_400_BAD_REQUEST)
            user.email = data['email']
            user.username = data['email']
        if 'password' in data:
            from django.contrib.auth.hashers import make_password
            user.password = make_password(data['password'])
        
        user.save()
        
        # Update profile
        if hasattr(user, 'profile'):
            if 'role' in data:
                user.profile.role = data['role']
            if 'business_id' in data:
                user.profile.business_id = data['business_id']
            user.profile.save()
        
        return Response({'message': 'User updated successfully'})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
@admin_required
def delete_user(request, user_id):
    """Delete user"""
    try:
        user = User.objects.get(id=user_id)
        if user.profile.role == 'admin':
            return Response({'error': 'Cannot delete admin user'}, status=status.HTTP_400_BAD_REQUEST)

        user.delete()
        return Response({'message': 'User deleted successfully'})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@role_required(['viewer'])
def viewer_stats(request):
    """Get viewer dashboard statistics"""
    from products.models import Product
    total_products = Product.objects.count()
    categories = Product.objects.values('category').distinct().count()
    recently_added = Product.objects.order_by('-created_at')[:10].count()

    # For favorites, if there's a favorites model, but for now, dummy
    favorites = 0  # TODO: implement favorites

    stats = {
        'available_products': total_products,
        'categories': categories,
        'recently_added': recently_added,
        'favorites': favorites
    }
    return Response(stats)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
@admin_required
def update_product(request, product_id):
    """Update product"""
    try:
        product = Product.objects.get(id=product_id)
        
        # Update fields if provided
        if 'name' in request.data:
            product.name = request.data['name']
        if 'description' in request.data:
            product.description = request.data['description']
        if 'price' in request.data:
            product.price = request.data['price']
        if 'status' in request.data:
            product.status = request.data['status']
        
        product.save()
        return Response({'message': 'Product updated successfully'})
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
@admin_required
def delete_product(request, product_id):
    """Delete product"""
    try:
        product = Product.objects.get(id=product_id)
        product.delete()
        return Response({'message': 'Product deleted successfully'})
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)