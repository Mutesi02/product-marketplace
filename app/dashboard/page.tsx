'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

export default function EditorDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'My Products', value: '12' },
    { label: 'Pending Review', value: '3' },
    { label: 'Published', value: '8' },
    { label: 'Draft', value: '1' }
  ];

  const recentProducts = [
    { name: 'Wireless Headphones', status: 'pending', lastModified: '2 hours ago' },
    { name: 'Smart Watch', status: 'published', lastModified: '1 day ago' }
  ];

  const recentActivity = [
    { action: 'Product "Laptop Stand" was approved', time: '3 hours ago', type: 'approved' },
    { action: 'Created new product "Wireless Mouse"', time: '1 day ago', type: 'created' }
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
        <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col relative z-10">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-blue-900">Editor Dashboard</h1>
          </div>
          <nav className="py-4 flex-1">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'products', label: 'My Products', icon: '📦' },
              { id: 'create', label: 'Create Product', icon: '➕' },
              { id: 'drafts', label: 'Drafts', icon: '📝' },
              { id: 'analytics', label: 'Analytics', icon: '📈' },
              { id: 'profile', label: 'Profile', icon: '👤' }
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
                <span className="mr-3">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
          
          {/* User Profile at bottom */}
          <div className="p-6 border-t border-gray-200 relative z-20">
            <div className="flex items-center space-x-3 mb-3">
              <img className="h-10 w-10 rounded-full border-2 border-blue-200" src="/imgs/man.jpg" alt="Editor" />
              <div>
                <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-blue-600">Editor</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Logout
            </button>
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
              </div>
            </div>
          </header>

          <div className="flex-1 p-8 overflow-auto">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-600 mb-2">{stat.label}</p>
                        <p className="text-3xl font-bold text-blue-900">{stat.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent Products & Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Recent Products */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-blue-900">Recent Products</h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {recentProducts.map((product, index) => (
                          <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{product.name}</p>
                              <p className="text-sm text-gray-600">Modified {product.lastModified}</p>
                            </div>
                            <div className="text-right">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                product.status === 'published' ? 'bg-blue-100 text-blue-800' :
                                product.status === 'pending' ? 'bg-blue-200 text-blue-900' :
                                'bg-blue-50 text-blue-700'
                              }`}>
                                {product.status}
                              </span>
                            </div>
                          </div>
                        ))}
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

            {/* My Products Tab */}
            {activeTab === 'products' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-blue-900">My Products</h3>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    Create New Product
                  </button>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[
                      { name: 'Wireless Headphones', status: 'pending', lastModified: '2 hours ago', views: '45' },
                      { name: 'Smart Watch', status: 'published', lastModified: '1 day ago', views: '128' },
                      { name: 'Laptop Stand', status: 'draft', lastModified: '3 days ago', views: '0' }
                    ].map((product, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-semibold text-gray-900">{product.name}</h4>
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            product.status === 'published' ? 'bg-blue-100 text-blue-800' :
                            product.status === 'pending' ? 'bg-blue-200 text-blue-900' :
                            'bg-blue-50 text-blue-700'
                          }`}>
                            {product.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Modified: {product.lastModified}</p>
                        <p className="text-sm text-gray-600 mb-4">Views: {product.views}</p>
                        <div className="flex space-x-2">
                          <button className="flex-1 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                            Edit
                          </button>
                          <button className="flex-1 bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors">
                            View
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Other tabs placeholder */}
            {!['overview', 'products'].includes(activeTab) && (
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