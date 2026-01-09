'use client';

import { useState, useEffect } from 'react';
import { Product } from '../types';

export default function PublicProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Mock approved products only
    const approvedProducts: Product[] = [
      {
        id: 1,
        name: 'Laptop Pro',
        description: 'High-performance laptop for professionals',
        price: 1299.99,
        status: 'approved',
        createdBy: 1,
        businessId: 1,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      {
        id: 3,
        name: 'Smartphone X',
        description: 'Latest smartphone with advanced features',
        price: 899.99,
        status: 'approved',
        createdBy: 1,
        businessId: 1,
        createdAt: '2024-01-03',
        updatedAt: '2024-01-03'
      }
    ];
    setProducts(approvedProducts);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Product Marketplace</h1>
          <p className="text-gray-600 mt-2">Discover amazing products</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-600">${product.price}</span>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products available at the moment.</p>
          </div>
        )}
      </main>
    </div>
  );
}