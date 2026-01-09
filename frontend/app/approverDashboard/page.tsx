'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

export default function ApproverDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Pending Reviews', value: '8' },
    { label: 'Approved Today', value: '5' },
    { label: 'Total Reviewed', value: '142' },
    { label: 'Avg Review Time', value: '2.3h' }
  ];

  const pendingProducts = [
    { id: 'PRD-001', name: 'Wireless Headphones', editor: 'John Smith', submitted: '2 hours ago', priority: 'high' },
    { id: 'PRD-002', name: 'Smart Watch', editor: 'Jane Doe', submitted: '4 hours ago', priority: 'medium' },
    { id: 'PRD-003', name: 'Laptop Stand', editor: 'Bob Wilson', submitted: '1 day ago', priority: 'low' }
  ];

  const recentActivity = [
    { action: 'Approved "Gaming Mouse" by Sarah Johnson', time: '1 hour ago', type: 'approved' },
    { action: 'Rejected "Phone Case" by Mike Davis', time: '3 hours ago', type: 'rejected' },
    { action: 'Approved "Desk Lamp" by Lisa Brown', time: '5 hours ago', type: 'approved' }
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
            <h1 className="text-xl font-bold text-blue-900">Approver Dashboard</h1>
          </div>
          <nav className="py-4 flex-1">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'pending', label: 'Pending Reviews' },
              { id: 'approved', label: 'Approved Products' },
              { id: 'rejected', label: 'Rejected Products' },
              { id: 'analytics', label: 'Analytics' },
              { id: 'settings', label: 'Settings' }
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
            <div className="flex items-center space-x-3 mb-3">
              <img className="h-10 w-10 rounded-full border-2 border-blue-200" src="/imgs/man.jpg" alt="Approver" />
              <div>
                <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-blue-600">Approver</p>
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
                        {pendingProducts.slice(0, 3).map((product, index) => (
                          <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{product.name}</p>
                              <p className="text-sm text-gray-600">by {product.editor} • {product.submitted}</p>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                product.priority === 'high' ? 'bg-blue-200 text-blue-900' :
                                product.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                                'bg-blue-50 text-blue-700'
                              }`}>
                                {product.priority}
                              </span>
                              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                                Review
                              </button>
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

            {/* Pending Reviews Tab */}
            {activeTab === 'pending' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-blue-900">Pending Reviews</h3>
                  <div className="flex space-x-2">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                      Bulk Approve
                    </button>
                    <button className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors">
                      Filter
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Editor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Submitted</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Priority</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pendingProducts.map((product, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-600">ID: {product.id}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.editor}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {product.submitted}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                              product.priority === 'high' ? 'bg-blue-200 text-blue-900' :
                              product.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                              'bg-blue-50 text-blue-700'
                            }`}>
                              {product.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button className="text-blue-600 hover:text-blue-900 transition-colors">Approve</button>
                            <button className="text-blue-800 hover:text-blue-900 transition-colors">Reject</button>
                            <button className="text-blue-600 hover:text-blue-900 transition-colors">View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Other tabs placeholder */}
            {!['overview', 'pending'].includes(activeTab) && (
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