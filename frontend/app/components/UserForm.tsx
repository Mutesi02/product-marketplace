'use client';

import { useState } from 'react';

interface UserFormProps {
  onSubmit: (data: { first_name: string; last_name: string; email: string; password?: string; role: string; business_id?: number }) => void;
  onCancel: () => void;
  initialData?: { first_name: string; last_name: string; email: string; role: string; business_id?: number };
  loading?: boolean;
  isEdit?: boolean;
}

type SubmitData = { first_name: string; last_name: string; email: string; password?: string; role: string; business_id?: number };

export default function UserForm({ onSubmit, onCancel, initialData, loading, isEdit }: UserFormProps) {
  const [formData, setFormData] = useState({
    first_name: initialData?.first_name || '',
    last_name: initialData?.last_name || '',
    email: initialData?.email || '',
    password: '',
    role: initialData?.role || 'viewer',
    business_id: initialData?.business_id || undefined
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!isEdit && !formData.password.trim()) newErrors.password = 'Password is required';
    if (!formData.role) newErrors.role = 'Role is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const data: SubmitData = { ...formData };
      if (isEdit && !formData.password) {
        delete data.password;
      }
      onSubmit(data);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 bg-opacity-95 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-3xl">
          <h3 className="text-xl font-bold text-center">
            {isEdit ? 'Edit User' : 'Create User'}
          </h3>
        </div>

        {/* Form */}
        <div className="p-4 max-h-96 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                required
                placeholder="Enter first name"
                className={`w-full px-4 py-3 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 bg-white text-black font-medium ${
                  errors.first_name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                }`}
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              />
              {errors.first_name && <p className="mt-1 text-sm text-red-600 font-medium">{errors.first_name}</p>}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                required
                placeholder="Enter last name"
                className={`w-full px-4 py-3 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 bg-white text-black font-medium ${
                  errors.last_name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                }`}
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              />
              {errors.last_name && <p className="mt-1 text-sm text-red-600 font-medium">{errors.last_name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                placeholder="Enter email"
                className={`w-full px-4 py-3 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 bg-white text-black font-medium ${
                  errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                }`}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600 font-medium">{errors.email}</p>}
            </div>

            {/* Password */}
            {!isEdit && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter password"
                  className={`w-full px-4 py-3 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 bg-white text-black font-medium ${
                    errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                  }`}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                {errors.password && <p className="mt-1 text-sm text-red-600 font-medium">{errors.password}</p>}
              </div>
            )}

            {/* Role */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Role
              </label>
              <select
                required
                className="w-full px-4 py-3 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 bg-white text-black font-medium"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="approver">Approver</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </div>
                ) : (
                  isEdit ? 'Update User' : 'Create User'
                )}
              </button>
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-2xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}