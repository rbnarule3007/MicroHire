import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Briefcase, Settings, LogOut, Bell, Search, Shield } from 'lucide-react';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleRefresh = (e, path) => {
        if (location.pathname === path) {
            e.preventDefault();
            window.location.reload();
        }
    };

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col fixed h-full z-20">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <span className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white text-lg">
                            <Shield size={18} />
                        </span>
                        Admin
                    </h2>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    <NavLink
                        to="/admin"
                        end
                        onClick={(e) => handleRefresh(e, '/admin')}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'text-white bg-purple-600' : 'hover:bg-slate-800 hover:text-white'
                            }`
                        }
                    >
                        <LayoutDashboard size={20} />
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/admin/users"
                        onClick={(e) => handleRefresh(e, '/admin/users')}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'text-white bg-purple-600' : 'hover:bg-slate-800 hover:text-white'
                            }`
                        }
                    >
                        <Users size={20} />
                        User Management
                    </NavLink>
                    <NavLink
                        to="/admin/jobs"
                        onClick={(e) => handleRefresh(e, '/admin/jobs')}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'text-white bg-purple-600' : 'hover:bg-slate-800 hover:text-white'
                            }`
                        }
                    >
                        <Briefcase size={20} />
                        Job Management
                    </NavLink>
                </nav>

                <div className="p-4 border-t border-slate-700">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-800 rounded-lg font-medium transition-colors"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold text-gray-800">Admin Portal</h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-medium text-gray-900">Administrator</p>
                                <p className="text-xs text-gray-500">Super User</p>
                            </div>
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold border-2 border-white shadow-sm">
                                A
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-8 flex-1 overflow-auto bg-slate-50">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
