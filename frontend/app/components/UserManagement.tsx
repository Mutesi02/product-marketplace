'use client';

import { useState, useEffect } from 'react';
import UserForm from './UserForm';

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
  onCreateUser: (data: any) => void;
  onUpdateUser: (userId: number, data: any) => void;
  onDeleteUser: (userId: number) => void;
  loading: boolean;
}

export default function UserManagement({ users, onCreateUser, onUpdateUser, onDeleteUser, loading }: UserManagementProps) {
  const [editingUser, setEditingUser] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ first_name: '', last_name: '', email: '', role: '' });
  const [addingUser, setAddingUser] = useState(false);

  const startEditing = (user: User) => {
    setEditingUser(user.id);
    setEditForm({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.profile?.role || 'viewer'
    });
  };

  const handleUpdate = (userId: number) => {
    onUpdateUser(userId, editForm);
    setEditingUser(null);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-blue-900">User Management</h3>
          <button
            onClick={() => setAddingUser(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
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
                  {editingUser === user.id ? (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editForm.first_name}
                            onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="First Name"
                          />
                          <input
                            type="text"
                            value={editForm.last_name}
                            onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="Last Name"
                          />
                          <input
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="Email"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.profile?.business?.name || 'No Business'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={editForm.role}
                          onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="admin">Admin</option>
                          <option value="editor">Editor</option>
                          <option value="approver">Approver</option>
                          <option value="viewer">Viewer</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleUpdate(user.id)}
                          disabled={loading}
                          className="text-green-600 hover:text-green-800 mr-2 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingUser(null)}
                          className="text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
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
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          user.profile?.role === 'admin' ? 'bg-red-100 text-red-800' :
                          user.profile?.role === 'approver' ? 'bg-green-100 text-green-800' :
                          user.profile?.role === 'editor' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.profile?.role || 'No Role'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => startEditing(user)}
                          disabled={loading}
                          className="text-blue-600 hover:text-blue-900 mr-4 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDeleteUser(user.id)}
                          disabled={loading || user.profile?.role === 'admin'}
                          className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
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

      {addingUser && (
        <UserForm
          onSubmit={onCreateUser}
          onCancel={() => setAddingUser(false)}
          loading={loading}
        />
      )}
    </>
  );
}