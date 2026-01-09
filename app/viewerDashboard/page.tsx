'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

export default function ViewerDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('browse');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const stats = [
    { label: 'Available Products', value: '156' },
    { label: 'Categories', value: '12' },
    { label: 'Recently Added', value: '8' },
    { label: 'Favorites', value: '23' }
  ];

  const categories = ['all', 'Electronics', 'Software', 'Hardware', 'Services', 'Tools'];

  const products = [
    { id: 1, name: 'Wireless Headphones', category: 'Electronics', price: 299, rating: 4.5, image: '/imgs/img1.jpg', description: 'High-quality wireless headphones with noise cancellation' },
    { id: 2, name: 'Smart Watch', category: 'Electronics', price: 399, rating: 4.8, image: '/imgs/img2.jpg', description: 'Advanced smartwatch with health monitoring features' },
    { id: 3, name: 'Laptop Stand', category: 'Hardware', price: 89, rating: 4.2, image: '/imgs/img3.png', description: 'Ergonomic laptop stand for better posture' },
    { id: 4, name: 'Project Management Tool', category: 'Software', price: 49, rating: 4.6, image: '/imgs/img4.jpg', description: 'Comprehensive project management solution' }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const recentlyViewed = [
    { name: 'Smart Watch', viewedAt: '2 hours ago', rating: 4.8 },
    { name: 'Wireless Mouse', viewedAt: '1 day ago', rating: 4.3 }
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
            <h1 className="text-xl font-bold text-blue-900">Viewer Dashboard</h1>
          </div>
          <nav className="py-4 flex-1">
            {[
              { id: 'browse', label: 'Browse Products' },
              { id: 'favorites', label: 'Favorites' },
              { id: 'history', label: 'View History' },
              { id: 'categories', label: 'Categories' },
              { id: 'recommendations', label: 'Recommendations' },
              { id: 'profile', label: 'Profile' }
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
              <img className="h-10 w-10 rounded-full border-2 border-blue-200" src="/imgs/man.jpg" alt="Viewer" />
              <div>
                <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-blue-600">Viewer</p>
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
                  {activeTab === 'browse' ? 'Browse Products' : 
                   activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </h2>
              </div>
            </div>
          </header>

          <div className="flex-1 p-4 overflow-hidden">
            {/* Browse Products Tab */}
            {activeTab === 'browse' && (
              <div className="space-y-4">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold text-blue-900">{stat.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Products Grid */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-blue-900">
                      Products ({filteredProducts.length})
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                      {filteredProducts.map((product) => (
                        <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-32 object-cover"
                          />
                          <div className="p-3">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-gray-900 text-sm">{product.name}</h4>
                              <button className="text-gray-400 hover:text-red-500 transition-colors">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                              </button>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">{product.description}</p>
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                {product.category}
                              </span>
                              <div className="flex items-center">
                                <span className="text-xs text-gray-600">{product.rating}</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-lg font-bold text-blue-900">${product.price}</span>
                              <button className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors">
                                View
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-blue-900">My Favorites</h3>
                </div>
                <div className="p-6">
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
                    <p className="text-gray-600">Start browsing products and add them to your favorites!</p>
                  </div>
                </div>
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-blue-900">Recently Viewed</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentlyViewed.map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">Viewed {item.viewedAt}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-600">{item.rating}</span>
                          </div>
                          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            View Again
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Other tabs placeholder */}
            {!['browse', 'favorites', 'history'].includes(activeTab) && (
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