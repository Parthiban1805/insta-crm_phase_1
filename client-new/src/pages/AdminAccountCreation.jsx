import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/ui/Spinner';
import CustomSelect from '../components/ui/CustomSelect';
import { UserPlus, ShieldAlert, CheckCircle2, Edit2, Trash2, X, Users, RefreshCw } from 'lucide-react';

export default function AdminAccountCreation() {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('agent');
  const [isActive, setIsActive] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [editingUserId, setEditingUserId] = useState(null);

  const { token, user } = useAuth();

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/crm/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Additional safety check to only show for admins
  if (user?.role !== 'admin') {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-center h-full text-[var(--color-text-muted)] fade-in">
        <ShieldAlert size={48} className="mb-4 text-[var(--color-status-error)] opacity-80" />
        <h2 className="text-xl font-bold text-[var(--color-text-main)] mb-2">Access Denied</h2>
        <p className="max-w-md">You do not have permission to access the account creation dashboard. This area is restricted to System Administrators only.</p>
      </div>
    );
  }

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setRole('agent');
    setIsActive(true);
    setEditingUserId(null);
  };

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setSuccessMessage('');
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      let res;
      let data;

      if (editingUserId) {
        // UPDATE MODE
        const body = { name, email, role, isActive };
        if (password) body.password = password; // Only send password if it was changed

        res = await fetch(`http://localhost:5000/api/auth/crm/users/${editingUserId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(body)
        });
      } else {
        // CREATE MODE
        res = await fetch('http://localhost:5000/api/auth/crm/create-agent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ name, email, password, role })
        });
      }
      
      data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || (editingUserId ? 'Failed to update account' : 'Failed to create account'));
      }

      showSuccess(editingUserId ? 'User account has been successfully updated.' : 'User account has been successfully created. They can now log in using these credentials.');
      resetForm();
      fetchUsers();
      
    } catch (err) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (u) => {
    setEditingUserId(u._id);
    setName(u.name);
    setEmail(u.email);
    setRole(u.role);
    setIsActive(u.isActive !== undefined ? u.isActive : true);
    setPassword(''); // Reset password field, optional for updates
    setError(null);
    setSuccess(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (u) => {
    if (u._id === user._id) {
      setError("You cannot delete your own active account.");
      return;
    }
    
    if (!window.confirm(`Are you sure you want to permanently delete the account for ${u.name}?`)) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/auth/crm/users/${u._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete user');
      
      if (editingUserId === u._id) resetForm();
      fetchUsers();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="fade-in space-y-6 max-w-6xl mx-auto py-4 pb-20">
      {/* Header */}
      <div className="border-b border-[var(--color-border-subtle)] pb-3 mb-6">
        <h1 className="text-xl font-bold text-[var(--color-text-main)] tracking-tight">Account Management</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">Provision and manage accounts for sales agents and system administrators.</p>
      </div>

      {/* Form Section */}
      <div className="card-panel p-6 bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] relative">
        {editingUserId && (
          <div className="absolute top-0 right-0 m-4">
            <button 
              onClick={resetForm}
              className="text-xs font-bold text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] flex items-center gap-1 bg-[var(--color-bg-subtle)] px-3 py-1.5 rounded-full transition-colors"
            >
              <X size={14} /> Cancel Edit
            </button>
          </div>
        )}

        <div className="mb-6 pb-4 border-b border-[var(--color-border-subtle)]">
          <h2 className="text-lg font-bold text-[var(--color-text-main)] flex items-center gap-2">
            {editingUserId ? 'Edit Account' : 'Create New Account'}
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-1.5">
            {editingUserId ? 'Update the details or credentials for the selected user.' : 'Enter details to provision a new workspace account.'}
          </p>
        </div>

        {error && (
          <div className="bg-[var(--color-status-error-bg)] text-[var(--color-status-error)] p-4 rounded-xl text-sm mb-6 font-medium flex items-start gap-3">
            <ShieldAlert size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-[var(--color-status-success-bg)] text-[var(--color-status-success)] p-4 rounded-xl text-sm mb-6 font-medium flex items-start gap-3">
            <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-[var(--color-text-muted)] mb-2 uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                placeholder="e.g. Jane Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[var(--color-bg-subtle)] text-[var(--color-text-main)] border border-[var(--color-border-subtle)] rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-primary)] transition-colors text-sm font-medium placeholder-[var(--color-text-light)]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--color-text-muted)] mb-2 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                placeholder="e.g. jane@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[var(--color-bg-subtle)] text-[var(--color-text-main)] border border-[var(--color-border-subtle)] rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-primary)] transition-colors text-sm font-medium placeholder-[var(--color-text-light)]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            <div>
              <label className="block text-xs font-bold text-[var(--color-text-muted)] mb-2 uppercase tracking-wider">
                {editingUserId ? 'New Password (Optional)' : 'Initial Password'}
              </label>
              <input
                type="text"
                placeholder={editingUserId ? "Leave blank to keep current" : "Provide a secure password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[var(--color-bg-subtle)] text-[var(--color-text-main)] border border-[var(--color-border-subtle)] rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-primary)] transition-colors text-sm font-medium placeholder-[var(--color-text-light)]"
                required={!editingUserId}
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--color-text-muted)] mb-2 uppercase tracking-wider">Workspace Role</label>
              <CustomSelect
                value={role}
                onChange={(e) => setRole(e.target.value)}
                options={[
                  { value: "agent", label: "Sales Agent" },
                  { value: "admin", label: "System Admin" }
                ]}
                className="w-full py-3 rounded-xl"
              />
            </div>

            {editingUserId && (
              <div>
                <label className="block text-xs font-bold text-[var(--color-text-muted)] mb-2 uppercase tracking-wider">Account Status</label>
                <div className="flex items-center h-[46px] px-2 gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      disabled={editingUserId === user._id}
                    />
                    <div className="w-11 h-6 bg-[var(--color-border-subtle)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[var(--color-border-subtle)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-status-success)]"></div>
                  </label>
                  <span className={`text-sm font-bold ${isActive ? 'text-[var(--color-status-success)]' : 'text-[var(--color-text-muted)]'}`}>
                    {isActive ? 'Active' : 'Disabled'}
                  </span>
                </div>
                {editingUserId === user._id && (
                  <p className="text-[10px] text-[var(--color-text-light)] italic mt-1">You cannot disable your own account.</p>
                )}
              </div>
            )}
          </div>

          <div className="pt-4 mt-6 border-t border-[var(--color-border-subtle)] flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary py-3 px-8 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 w-full md:w-auto"
            >
              {loading ? <Spinner size={20} /> : (
                <>
                  {editingUserId ? <CheckCircle2 size={18} /> : <UserPlus size={18} />}
                  <span>{editingUserId ? 'Save Changes' : 'Create Account'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* User Directory Table */}
      <div className="card-panel border border-[var(--color-border-subtle)] overflow-hidden flex flex-col bg-[var(--color-bg-card)]">
        <div className="p-6 border-b border-[var(--color-border-subtle)] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[var(--color-text-main)] flex items-center gap-2">
              User Directory
            </h2>
            <p className="text-sm text-[var(--color-text-muted)] mt-1.5">
              A complete list of all users within your workspace.
            </p>
          </div>
          <button onClick={fetchUsers} disabled={loadingUsers} className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors p-2 bg-[var(--color-bg-subtle)] rounded-xl border border-[var(--color-border-subtle)]" title="Refresh">
            <RefreshCw size={18} className={loadingUsers ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[var(--color-bg-app)] text-[var(--color-text-muted)] border-b border-[var(--color-border-subtle)]">
              <tr>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-subtle)]">
              {loadingUsers ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-[var(--color-text-muted)]">
                    <Spinner size={24} className="mx-auto mb-2" />
                    Loading directory...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-[var(--color-text-muted)] font-medium">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map(u => (
                  <tr key={u._id} className="hover:bg-[var(--color-bg-hover)] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[var(--color-text-main)]">{u.name}</div>
                      <div className="text-xs text-[var(--color-text-muted)] mt-0.5">{u.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        u.role === 'admin' 
                          ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' 
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${u.isActive !== false ? 'bg-[var(--color-status-success)]' : 'bg-[var(--color-status-error)]'}`}></span>
                        <span className={`text-xs font-bold ${u.isActive !== false ? 'text-[var(--color-status-success)]' : 'text-[var(--color-status-error)]'}`}>
                          {u.isActive !== false ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[var(--color-text-muted)] text-xs font-medium">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(u)}
                          className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-bg-app)] rounded-md transition-colors"
                          title="Edit User"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(u)}
                          disabled={u._id === user._id}
                          className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-status-error)] hover:bg-[var(--color-status-error-bg)] rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title={u._id === user._id ? "You cannot delete yourself" : "Delete User"}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
