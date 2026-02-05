import React, { useState } from 'react';
import { Search, Trash2, Edit, MoreVertical, User, Building } from 'lucide-react';
import Card from '../../components/common/Card';

const UserManagement = () => {
    const [activeTab, setActiveTab] = useState('freelancer'); // 'client' or 'freelancer'

    // Mock Data
    const [users, setUsers] = useState([
        { id: 1, name: 'Robert Fox', email: 'robert@example.com', type: 'client', status: 'Active', verification: 'Verified' },
        { id: 2, name: 'Alex Morgan', email: 'alex@example.com', type: 'freelancer', status: 'Active', verification: 'Verified' },
        { id: 3, name: 'Design Co.', email: 'contact@designco.com', type: 'client', status: 'Pending', verification: 'Pending' },
        { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', type: 'freelancer', status: 'Active', verification: 'Verified' },
        { id: 5, name: 'John Doe', email: 'john@example.com', type: 'freelancer', status: 'Suspended', verification: 'Failed' },
        { id: 6, name: 'Tech Solutions', email: 'hr@techsolutions.com', type: 'client', status: 'Active', verification: 'Verified' },
    ]);

    const filteredUsers = users.filter(user => user.type === activeTab);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            setUsers(users.filter(user => user.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full sm:w-64"
                    />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-4 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('freelancer')}
                    className={`pb-3 font-medium transition-colors relative ${activeTab === 'freelancer' ? 'text-purple-600' : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Freelancers
                    {activeTab === 'freelancer' && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 rounded-t-full"></span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('client')}
                    className={`pb-3 font-medium transition-colors relative ${activeTab === 'client' ? 'text-purple-600' : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Clients
                    {activeTab === 'client' && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 rounded-t-full"></span>
                    )}
                </button>
            </div>

            <Card className="border-none shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-medium text-gray-500 text-sm">User</th>
                                <th className="px-6 py-4 font-medium text-gray-500 text-sm">Status</th>
                                <th className="px-6 py-4 font-medium text-gray-500 text-sm">Verification</th>
                                <th className="px-6 py-4 font-medium text-gray-500 text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${user.type === 'client' ? 'bg-blue-500' : 'bg-green-500'}`}>
                                                {user.type === 'client' ? <Building size={18} /> : <User size={18} />}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{user.name}</p>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-green-100 text-green-700' :
                                                user.status === 'Suspended' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.verification === 'Verified' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {user.verification}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center py-8 text-gray-500">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default UserManagement;
