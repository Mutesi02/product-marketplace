'use client';

import { useState, useEffect } from 'react';

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

interface UserManagementProps {
  users: User[];
  onUpdateRole: (userId: number, newRole: string) => void;
  onDeleteUser: (userId: number) => void;
  loading: boolean;
}

export default function UserManagement({ users, onUpdateRole, onDeleteUser, loading }: UserManagementProps) {
  const [editingUser, setEditingUser] = useState<number | null>(null);
  const [newRole, setNewRole] = useState('');

  const roles = [
    { value: 'admin', label: 'Admin' },
    { value: 'editor', label: 'Editor' },
    { value: 'approver', label: 'Approver' },
    { value: 'viewer', label: 'Viewer' }
  ];

  const handleRoleUpdate = (userId: number) => {
    if (newRole) {
      onUpdateRole(userId, newRole);
      setEditingUser(null);
      setNewRole('');
    }
  };

  const startEditing = (userId: number, currentRole: string) => {
    setEditingUser(userId);
    setNewRole(currentRole || 'viewer');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-blue-900">User Management</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          Add New User
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                Business
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {user.first_name} {user.last_name}
                    </div>
                    <div className="text-sm text-gray-600">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.profile?.business?.name || 'No Business'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingUser === user.id ? (
                    <div className="flex items-center space-x-2">
                      <select
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        {roles.map((role) => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleRoleUpdate(user.id)}
                        disabled={loading}
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingUser(null)}
                        className="text-gray-600 hover:text-gray-800 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      user.profile?.role === 'admin' ? 'bg-red-100 text-red-800' :
                      user.profile?.role === 'approver' ? 'bg-green-100 text-green-800' :
                      user.profile?.role === 'editor' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.profile?.role || 'No Role'}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => startEditing(user.id, user.profile?.role || 'viewer')}
                    disabled={loading}
                    className="text-blue-600 hover:text-blue-900 mr-4 transition-colors"
                  >
                    Edit Role
                  </button>
                  <button
                    onClick={() => onDeleteUser(user.id)}
                    disabled={loading || user.profile?.role === 'admin'}
                    className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {users.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
}