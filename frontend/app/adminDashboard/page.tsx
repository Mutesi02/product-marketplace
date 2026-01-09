'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import RoleGuard from '../components/RoleGuard';
import UserManagement from '../components/UserManagement';
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchProducts();
    fetchActivities();
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

  const updateUserRole = async (userId: number, newRole: string) => {
    setLoading(true);
    try {
      const token = Cookies.get('auth_token');
      const response = await fetch(`http://localhost:8000/api/auth/admin/users/${userId}/role/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      });
      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    }
    setLoading(false);
  };

  const deleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    setLoading(true);
    try {
      const token = Cookies.get('auth_token');
      const response = await fetch(`http://localhost:8000/api/auth/admin/users/${userId}/delete/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchUsers();
        fetchStats();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
    setLoading(false);
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
      <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col relative z-10">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-900">Admin Dashboard</h1>
        </div>
        <nav className="py-4 flex-1">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'users', label: 'User Management' },
            { id: 'products', label: 'Product Management' },
            { id: 'approvals', label: 'Approvals' },
            { id: 'analytics', label: 'Analytics' },
            { id: 'settings', label: 'System Settings' }
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
              <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-gray-600">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
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
              onUpdateRole={updateUserRole}
              onDeleteUser={deleteUser}
              loading={loading}
            />
          )}

          {/* Product Management Tab */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-blue-900">Product Management</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Add Product
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow h-80 flex flex-col justify-between">
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
                        <button className="flex-1 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                          Edit
                        </button>
                        <button className="flex-1 bg-red-50 text-red-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">
                          Delete
                        </button>
                      </div>
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

          {/* Other tabs placeholder */}
          {!['overview', 'users', 'products'].includes(activeTab) && (
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
    </RoleGuard>
  );
}