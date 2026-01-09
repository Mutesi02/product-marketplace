'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Product } from '../types';

export default function Products() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Mock products data
  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: 1,
        name: 'Laptop Pro',
        description: 'High-performance laptop',
        price: 1299.99,
        status: 'approved',
        createdBy: 1,
        businessId: 1,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      {
        id: 2,
        name: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse',
        price: 49.99,
        status: 'pending_approval',
        createdBy: 1,
        businessId: 1,
        createdAt: '2024-01-02',
        updatedAt: '2024-01-02'
      }
    ];
    setProducts(mockProducts);
  }, []);

  const canEdit = user?.role === 'admin' || user?.role === 'editor';
  const canApprove = user?.role === 'admin' || user?.role === 'approver';

  const handleApprove = (productId: number) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, status: 'approved' as const } : p
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        {canEdit && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Product
          </button>
        )}
      </div>

      <div className="grid gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-4 rounded-lg shadow border">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-600 mt-1">{product.description}</p>
                <p className="text-xl font-bold text-green-600 mt-2">${product.price}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                  {product.status.replace('_', ' ')}
                </span>
                {canApprove && product.status === 'pending_approval' && (
                  <button
                    onClick={() => handleApprove(product.id)}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                )}
                {canEdit && (
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <ProductForm
          onClose={() => setShowForm(false)}
          onSave={(product) => {
            setProducts(prev => [...prev, { ...product, id: Date.now() }]);
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}

function ProductForm({ onClose, onSave }: { 
  onClose: () => void; 
  onSave: (product: Omit<Product, 'id'>) => void; 
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!name.trim()) newErrors.name = 'Product name is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!price || parseFloat(price) <= 0) newErrors.price = 'Valid price is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onSave({
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price),
        status: 'draft',
        createdBy: 1,
        businessId: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl">
          <h2 className="text-2xl font-bold text-center">Create Product</h2>
          <p className="text-blue-100 text-center mt-1">Add a new product to your catalog</p>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Product Name */}
          <div>
            <label htmlFor="productName" className="block text-sm font-semibold text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              id="productName"
              type="text"
              placeholder="Enter product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 bg-gray-50 hover:bg-white text-gray-900 font-medium ${
                errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
              }`}
              required
            />
            {errors.name && <p className="mt-1 text-sm text-red-600 font-medium">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="productDescription" className="block text-sm font-semibold text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="productDescription"
              placeholder="Describe your product"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 bg-gray-50 hover:bg-white text-gray-900 font-medium resize-none ${
                errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
              }`}
              rows={4}
              required
            />
            {errors.description && <p className="mt-1 text-sm text-red-600 font-medium">{errors.description}</p>}
          </div>

          {/* Price */}
          <div>
            <label htmlFor="productPrice" className="block text-sm font-semibold text-gray-700 mb-2">
              Price (USD) *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">$</span>
              <input
                id="productPrice"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={`w-full pl-8 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 bg-gray-50 hover:bg-white text-gray-900 font-medium ${
                  errors.price ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                }`}
                required
              />
            </div>
            {errors.price && <p className="mt-1 text-sm text-red-600 font-medium">{errors.price}</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </div>
              ) : (
                'Save Product'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-3 px-6 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}