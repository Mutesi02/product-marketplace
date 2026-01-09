'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import RoleGuard from '../components/RoleGuard';
import UserManagement from '../components/UserManagement';
import ConfirmModal from '../components/ConfirmModal';
import ProductForm from '../components/ProductForm';
import { useAuth } from '../contexts/AuthContext';
import Cookies from 'js-cookie';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  profile: {
    role: string;
    business: {
      name: string;
    };
  };
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  status: string;
  created_by_name: string;
  created_at: string;
}

interface Activity {
  user: string;
  action: string;
  time: string;
  status: string;
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    total_users: 0,
    total_products: 0,
    pending_approvals: 0,
    total_businesses: 0
  });
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [analytics, setAnalytics] = useState({
    overview: {
      total_products: 0,
      approved_count: 0,
      rejected_count: 0,
      pending_count: 0,
      approval_rate: 0,
      reviewed_total: 0
    },
    trends: {
      weekly_approved: 0,
      weekly_rejected: 0,
      weekly_total: 0
    },
    top_editors: []
  });
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<number | null>(null);
  const [addingProduct, setAddingProduct] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: '', id: 0, title: '', message: '' });
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    price: '',
    status: 'draft'
  });

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchProducts();
    fetchActivities();
    fetchAnalytics();
  }, []);

  const fetchStats = async () => {
    try {
      const token = Cookies.get('auth_token');
      const response = await fetch('http://localhost:8000/api/auth/admin/stats/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = Cookies.get('auth_token');
      const response = await fetch('http://localhost:8000/api/auth/admin/users/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const token = Cookies.get('auth_token');
      const response = await fetch('http://localhost:8000/api/auth/admin/products/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchActivities = async () => {
    try {
      const token = Cookies.get('auth_token');
      const response = await fetch('http://localhost:8000/api/auth/admin/activities/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const token = Cookies.get('auth_token');
      const response = await fetch('http://localhost:8000/api/products/analytics/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const createUser = async (data: any) => {
    setLoading(true);
    try {
      const token = Cookies.get('auth_token');
      const response = await fetch('http://localhost:8000/api/auth/admin/users/create/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        fetchUsers();
        fetchStats();
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
    setLoading(false);
  };

  const updateUser = async (userId: number, data: any) => {
    setLoading(true);
    try {
      const token = Cookies.get('auth_token');
      const response = await fetch(`http://localhost:8000/api/auth/admin/users/${userId}/update/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
    setLoading(false);
  };

  const deleteUser = async (userId: number) => {
    setConfirmModal({
      isOpen: true,
      type: 'user',
      id: userId,
      title: 'Delete User',
      message: 'Are you sure you want to delete this user? This action cannot be undone.'
    });
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      const token = Cookies.get('auth_token');
      const endpoint = confirmModal.type === 'user' 
        ? `http://localhost:8000/api/auth/admin/users/${confirmModal.id}/delete/`
        : `http://localhost:8000/api/auth/admin/products/${confirmModal.id}/delete/`;
      
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        if (confirmModal.type === 'user') {
          fetchUsers();
        } else {
          fetchProducts();
        }
        fetchStats();
      }
    } catch (error) {
      console.error('Error deleting:', error);
    }
    setLoading(false);
    setConfirmModal({ isOpen: false, type: '', id: 0, title: '', message: '' });
  };

  const startEditProduct = (product: Product) => {
    setEditingProduct(product.id);
    setEditForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      status: product.status
    });
  };

  const updateProduct = async (productId: number, data: { name: string; description: string; price: number; status: string }) => {
    setLoading(true);
    try {
      const token = Cookies.get('auth_token');
      const response = await fetch(`http://localhost:8000/api/products/${productId}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        fetchProducts();
        setEditingProduct(null);
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
    setLoading(false);
  };

  const createProduct = async (data: { name: string; description: string; price: number; status: string }) => {
    setLoading(true);
    try {
      const token = Cookies.get('auth_token');
      const response = await fetch('http://localhost:8000/api/products/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        fetchProducts();
        setAddingProduct(false);
      }
    } catch (error) {
      console.error('Error creating product:', error);
    }
    setLoading(false);
  };

  const handleApprove = async (productId: number) => {
    setLoading(true);
    try {
      const token = Cookies.get('auth_token');
      const response = await fetch(`http://localhost:8000/api/products/${productId}/approve/`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchProducts();
        fetchStats();
      }
    } catch (error) {
      console.error('Error approving product:', error);
    }
    setLoading(false);
  };

  const handleReject = async (productId: number) => {
    setLoading(true);
    try {
      const token = Cookies.get('auth_token');
      const response = await fetch(`http://localhost:8000/api/products/${productId}/reject/`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchProducts();
        fetchStats();
      }
    } catch (error) {
      console.error('Error rejecting product:', error);
    }
    setLoading(false);
  };

  const deleteProduct = async (productId: number) => {
    setConfirmModal({
      isOpen: true,
      type: 'product',
      id: productId,
      title: 'Delete Product',
      message: 'Are you sure you want to delete this product? This action cannot be undone.'
    });
  };

  const statsArray = [
    { label: 'Total Users', value: stats.total_users.toString() },
    { label: 'Total Products', value: stats.total_products.toString() },
    { label: 'Pending Approvals', value: stats.pending_approvals.toString() },
    { label: 'Total Businesses', value: stats.total_businesses.toString() }
  ];

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="min-h-screen bg-gray-50 flex" style={{position: 'relative'}}>
      <style dangerouslySetInnerHTML={{
        __html: `
          [data-nextjs-toast] {
            display: none !important;
          }
          .__next-dev-overlay-left {
            display: none !important;
          }
        `
      }} />
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col fixed left-0 top-0 h-full z-10">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-900">Admin Dashboard</h1>
        </div>
        <nav className="py-4 flex-1">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'users', label: 'User Management' },
            { id: 'products', label: 'Product Management' },
            { id: 'approvals', label: 'Approvals' },
            { id: 'analytics', label: 'Analytics' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center px-6 py-3 text-sm font-medium text-left transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-700 border-r-3 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        
        {/* User Profile at bottom */}
        <div className="p-6 border-t border-gray-200 relative z-20">
          <div className="flex items-center space-x-3">
            <img className="h-10 w-10 rounded-full border-2 border-blue-200" src="/imgs/man.jpg" alt="Admin" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{user?.email}</p>
              <p className="text-xs text-gray-600">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-8 py-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-blue-900">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h2>
              <button 
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-auto">

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statsArray.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-3xl font-bold text-blue-900">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activities */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-blue-900">Recent Activities</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {activities.slice(0, 5).map((activity, index) => (
                      <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                          <p className="text-sm text-gray-600">{activity.action}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">{new Date(activity.time).toLocaleString()}</p>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            activity.status === 'approved' ? 'bg-green-100 text-green-800' :
                            activity.status === 'pending_approval' ? 'bg-yellow-100 text-yellow-800' :
                            activity.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {activity.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    ))}
                    {activities.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No recent activities</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Pending Approvals */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-blue-900">Pending Approvals</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {products.filter(p => p.status === 'pending_approval').slice(0, 5).map((product, index) => (
                      <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-600">by {product.created_by_name} • {new Date(product.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            pending
                          </span>
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                            Review
                          </button>
                        </div>
                      </div>
                    ))}
                    {products.filter(p => p.status === 'pending_approval').length === 0 && (
                      <p className="text-gray-500 text-center py-4">No pending approvals</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

          {/* User Management Tab */}
          {activeTab === 'users' && (
            <UserManagement
              users={users}
              onCreateUser={createUser}
              onUpdateUser={updateUser}
              onDeleteUser={deleteUser}
              loading={loading}
            />
          )}

          {/* Product Management Tab */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-blue-900">Product Management</h3>
                <button
                  onClick={() => setAddingProduct(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Add Product
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow min-h-80 flex flex-col justify-between">
                      {editingProduct === product.id ? (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
                            <input
                              type="text"
                              value={editForm.name}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                            <textarea
                              rows={2}
                              value={editForm.description}
                              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-900"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Price</label>
                            <input
                              type="number"
                              step="0.01"
                              value={editForm.price}
                              onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                            <select
                              value={editForm.status}
                              onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                            >
                              <option value="draft">Draft</option>
                              <option value="pending_approval">Pending Approval</option>
                              <option value="approved">Approved</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => updateProduct(product.id, { name: editForm.name, description: editForm.description, price: parseFloat(editForm.price), status: editForm.status })}
                              disabled={loading}
                              className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingProduct(null)}
                              disabled={loading}
                              className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-700 disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col justify-between h-full">
                          <div>
                            <div className="flex justify-between items-start mb-4">
                              <h4 className="font-semibold text-gray-900">{product.name}</h4>
                              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                product.status === 'approved' ? 'bg-green-100 text-green-800' :
                                product.status === 'pending_approval' ? 'bg-yellow-100 text-yellow-800' :
                                product.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {product.status.replace('_', ' ')}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">ID: {product.id}</p>
                            <p className="text-sm text-gray-600 mb-3">Created by: {product.created_by_name}</p>
                            <p className="text-sm text-gray-600 mb-3">{new Date(product.created_at).toLocaleDateString()}</p>
                            <p className="text-xl font-bold text-blue-900 mb-4">${product.price}</p>
                            <div className="mb-4">
                              <p className="text-sm text-gray-600 line-clamp-3">{product.description}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => startEditProduct(product)}
                              disabled={loading}
                              className="flex-1 bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm hover:bg-blue-100"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteProduct(product.id)}
                              disabled={loading}
                              className="flex-1 bg-red-50 text-red-700 px-2 py-1 rounded text-sm hover:bg-red-100"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {products.length === 0 && (
                    <div className="col-span-full text-center py-8">
                      <p className="text-gray-500">No products found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Add Product Modal */}
          {addingProduct && (
            <ProductForm
              onSubmit={createProduct}
              onCancel={() => setAddingProduct(false)}
              loading={loading}
            />
          )}

          {/* Approvals Tab */}
          {activeTab === 'approvals' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-blue-900">Product Approvals</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.filter(p => p.status === 'pending_approval').map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-semibold text-gray-900 text-lg">{product.name}</h4>
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          pending
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                      <div className="mb-4">
                        <p className="text-xl font-bold text-blue-900">${product.price}</p>
                        <p className="text-sm text-gray-600">by {product.created_by_name}</p>
                        <p className="text-xs text-gray-500">{new Date(product.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApprove(product.id)}
                          disabled={loading}
                          className="flex-1 bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(product.id)}
                          disabled={loading}
                          className="flex-1 bg-red-50 text-red-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                  {products.filter(p => p.status === 'pending_approval').length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <p className="text-gray-500">No products pending approval</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Overview Metrics */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Overview Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-900">{analytics.overview.total_products}</p>
                    <p className="text-sm text-gray-600">Total Products</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{analytics.overview.approved_count}</p>
                    <p className="text-sm text-gray-600">Approved</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{analytics.overview.rejected_count}</p>
                    <p className="text-sm text-gray-600">Rejected</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{analytics.overview.approval_rate}%</p>
                    <p className="text-sm text-gray-600">Approval Rate</p>
                  </div>
                </div>
              </div>

              {/* Weekly Trends */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Weekly Activity</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-xl font-bold text-green-600">{analytics.trends.weekly_approved}</p>
                    <p className="text-sm text-gray-600">Approved This Week</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-red-600">{analytics.trends.weekly_rejected}</p>
                    <p className="text-sm text-gray-600">Rejected This Week</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-blue-600">{analytics.trends.weekly_total}</p>
                    <p className="text-sm text-gray-600">Total Reviewed</p>
                  </div>
                </div>
              </div>

              {/* Top Editors */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Editor Performance</h3>
                <div className="space-y-3">
                  {analytics.top_editors.map((editor: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{editor.name}</p>
                        <p className="text-sm text-gray-600">{editor.total} products submitted</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{editor.approved} approved</p>
                        <p className="text-sm text-gray-600">{editor.approval_rate.toFixed(1)}% rate</p>
                      </div>
                    </div>
                  ))}
                  {analytics.top_editors.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No editor data available</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Other tabs placeholder */}
          {!['overview', 'users', 'products', 'approvals', 'analytics'].includes(activeTab) && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <h3 className="text-xl font-semibold text-blue-900 mb-3">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
              </h3>
              <p className="text-gray-600">This section is under development.</p>
            </div>
          )}
        </div>
      </div>
      </div>
      
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmModal({ isOpen: false, type: '', id: 0, title: '', message: '' })}
      />
    </RoleGuard>
  );
}