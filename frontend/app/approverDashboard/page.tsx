'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import Cookies from 'js-cookie';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  status: string;
  created_by_name: string;
  created_at: string;
}

export default function ApproverDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [pendingProducts, setPendingProducts] = useState<Product[]>([]);
  const [approvedProducts, setApprovedProducts] = useState<Product[]>([]);
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
  const [stats, setStats] = useState({
    pending_reviews: 0,
    approved_today: 0,
    total_reviewed: 0,
    avg_review_time: '0h'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPendingProducts();
    fetchApprovedProducts();
    fetchStats();
    fetchAnalytics();
  }, []);

  const fetchStats = async () => {
    console.log('Fetching stats...');
    try {
      const token = Cookies.get('auth_token');
      const response = await fetch('http://localhost:8000/api/products/stats/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('Stats response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Stats data:', data);
        setStats(data);
      } else {
        console.error('Failed to fetch stats:', response.status);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchPendingProducts = async () => {
    console.log('Fetching pending products...');
    try {
      const token = Cookies.get('auth_token');
      console.log('Token:', token);
      const response = await fetch('http://localhost:8000/api/products/pending/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('Response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Pending products data:', data);
        setPendingProducts(data);
      } else {
        console.error('Failed to fetch pending products:', response.status);
      }
    } catch (error) {
      console.error('Error fetching pending products:', error);
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

  const fetchApprovedProducts = async () => {
    try {
      const token = Cookies.get('auth_token');
      const response = await fetch('http://localhost:8000/api/products/public/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setApprovedProducts(data);
      }
    } catch (error) {
      console.error('Error fetching approved products:', error);
    }
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
        fetchPendingProducts();
        fetchApprovedProducts();
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
        fetchPendingProducts();
        fetchApprovedProducts();
        fetchStats();
      }
    } catch (error) {
      console.error('Error rejecting product:', error);
    }
    setLoading(false);
  };

  const statsArray = [
    { label: 'Pending Reviews', value: stats.pending_reviews.toString() },
    { label: 'Approved Today', value: stats.approved_today.toString() },
    { label: 'Total Reviewed', value: stats.total_reviewed.toString() }
  ];

  const recentActivity = [
    { action: 'Recent activity will appear here', time: 'when actions are performed', type: 'info' }
  ];

  return (
    <ProtectedRoute>
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
            <h1 className="text-xl font-bold text-blue-900">Approver Dashboard</h1>
          </div>
          <nav className="py-4 flex-1 overflow-y-auto">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'pending', label: 'Pending Reviews' },
              { id: 'approved', label: 'Approved Products' },
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
          <div className="p-6 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <img className="h-10 w-10 rounded-full border-2 border-blue-200" src="/imgs/man.jpg" alt="Approver" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                <p className="text-xs text-blue-600">{user?.role}</p>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {statsArray.map((stat, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                        <p className="text-3xl font-bold text-blue-900">{stat.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pending Products & Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Pending Products */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-blue-900">Urgent Reviews</h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {pendingProducts.slice(0, 3).map((product) => (
                          <div key={product.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{product.name}</p>
                              <p className="text-sm text-gray-600">by {product.created_by_name} • {new Date(product.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                pending
                              </span>
                              <button 
                                onClick={() => handleApprove(product.id)}
                                disabled={loading}
                                className="text-green-600 hover:text-green-800 text-sm font-medium transition-colors disabled:opacity-50"
                              >
                                Approve
                              </button>
                            </div>
                          </div>
                        ))}
                        {pendingProducts.length === 0 && (
                          <p className="text-gray-500 text-center py-4">No pending products</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-blue-900">Recent Activity</h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {recentActivity.map((activity, index) => (
                          <div key={index} className="flex items-start space-x-3 py-3 border-b border-gray-100 last:border-0">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              activity.type === 'approved' ? 'bg-blue-500' : 'bg-blue-300'
                            }`}></div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-900">{activity.action}</p>
                              <p className="text-xs text-gray-500">{activity.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Pending Reviews Tab */}
            {activeTab === 'pending' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-blue-900">Pending Reviews</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {pendingProducts.map((product) => (
                      <div key={product.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-semibold text-gray-900 text-lg">{product.name}</h4>
                          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            {product.status.replace('_', ' ')}
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
                    {pendingProducts.length === 0 && (
                      <div className="col-span-full text-center py-12">
                        <p className="text-gray-500">No products pending approval</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Approved Products Tab */}
            {activeTab === 'approved' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-blue-900">Approved Products</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {approvedProducts.map((product) => (
                      <div key={product.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-semibold text-gray-900 text-lg">{product.name}</h4>
                          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            approved
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                        <div className="mb-4">
                          <p className="text-xl font-bold text-blue-900">${product.price}</p>
                          <p className="text-sm text-gray-600">by {product.created_by_name}</p>
                          <p className="text-xs text-gray-500">{new Date(product.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                    {approvedProducts.length === 0 && (
                      <div className="col-span-full text-center py-12">
                        <p className="text-gray-500">No approved products yet</p>
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
            {!['overview', 'pending', 'approved', 'analytics'].includes(activeTab) && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <h3 className="text-xl font-semibold text-blue-900 mb-3">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </h3>
                <p className="text-gray-600">This section is under development.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}