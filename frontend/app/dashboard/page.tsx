'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ProductForm from '../components/ProductForm';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  status: string;
  created_by_name: string;
  created_at: string;
}

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      switch (user.role) {
        case 'admin':
          router.replace('/adminDashboard');
          break;
        case 'approver':
          router.replace('/approverDashboard');
          break;
        case 'viewer':
          router.replace('/viewerDashboard');
          break;
        case 'editor':
        default:
          fetchProducts();
          break;
      }
    } else if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/products/', {
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

  const handleCreateProduct = async (productData: { name: string; description: string; price: number }) => {
    setFormLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/products/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });
      
      if (response.ok) {
        setShowForm(false);
        fetchProducts();
      } else {
        // Fallback: Add product locally if server fails
        const newProduct: Product = {
          id: Date.now(),
          name: productData.name,
          description: productData.description,
          price: productData.price,
          status: 'draft',
          created_by_name: user?.firstName || user?.email || 'Unknown',
          created_at: new Date().toISOString()
        };
        setProducts(prev => [newProduct, ...prev]);
        setShowForm(false);
        alert('Product created locally (server unavailable)');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      // Fallback: Add product locally if network fails
      const newProduct: Product = {
        id: Date.now(),
        name: productData.name,
        description: productData.description,
        price: productData.price,
        status: 'draft',
        created_by_name: user?.firstName || user?.email || 'Unknown',
        created_at: new Date().toISOString()
      };
      setProducts(prev => [newProduct, ...prev]);
      setShowForm(false);
      alert('Product created locally (server unavailable)');
    }
    setFormLoading(false);
  };

  const handleEditProduct = async (productData: { name: string; description: string; price: number }) => {
    if (!editingProduct) return;
    setFormLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/products/${editingProduct.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });
      if (response.ok) {
        setEditingProduct(null);
        fetchProducts();
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
    setFormLoading(false);
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/products/${productId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const stats = [
    { label: 'My Products', value: products.length.toString() },
    { label: 'Draft Products', value: products.filter(p => p.status === 'draft').length.toString() },
    { label: 'Pending Approval', value: products.filter(p => p.status === 'pending_approval').length.toString() },
    { label: 'Published', value: products.filter(p => p.status === 'approved').length.toString() }
  ];

  const recentProducts = products.slice(0, 2).map(product => ({
    name: product.name,
    status: product.status,
    date: new Date(product.created_at).toLocaleDateString()
  }));

  // Editor Dashboard Content
  return (
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
            { id: 'overview', label: 'Overview' },
            { id: 'products', label: 'My Products' },
            { id: 'create', label: 'Create Product' },
            { id: 'drafts', label: 'Drafts' },
            { id: 'browse', label: 'Browse Products' }
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
            <img className="h-10 w-10 rounded-full border-2 border-blue-200" src="/imgs/man.jpg" alt="Editor" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{user?.firstName || user?.email}</p>
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
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-3xl font-bold text-blue-900">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

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
                            <p className="text-sm text-gray-600">{product.date}</p>
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            product.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                            product.status === 'pending' ? 'bg-blue-200 text-blue-900' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {product.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-blue-900">Quick Actions</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <button 
                      onClick={() => setShowForm(true)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                    >
                      Create New Product
                    </button>
                    <button 
                      onClick={() => setActiveTab('products')}
                      className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                    >
                      Manage Products
                    </button>
                    <button 
                      onClick={() => setActiveTab('browse')}
                      className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                    >
                      Browse Marketplace
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-blue-900">My Products</h3>
                <button 
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Create Product
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-semibold text-gray-900">{product.name}</h4>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          product.status === 'approved' ? 'bg-green-100 text-green-800' :
                          product.status === 'pending_approval' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {product.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                      <p className="text-xl font-bold text-blue-900 mb-4">${product.price}</p>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setEditingProduct(product)}
                          className="flex-1 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="flex-1 bg-red-50 text-red-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  {products.length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <p className="text-gray-500">No products yet. Create your first product!</p>
                    </div>
                  )}
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
      
      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          onSubmit={handleCreateProduct}
          onCancel={() => setShowForm(false)}
          loading={formLoading}
        />
      )}
      
      {/* Edit Product Modal */}
      {editingProduct && (
        <ProductForm
          onSubmit={handleEditProduct}
          onCancel={() => setEditingProduct(null)}
          initialData={{
            name: editingProduct.name,
            description: editingProduct.description,
            price: editingProduct.price
          }}
          loading={formLoading}
        />
      )}
    </div>
  );
}