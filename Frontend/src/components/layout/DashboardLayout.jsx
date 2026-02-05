import React, { useState } from 'react';
import {
    Briefcase,
    MessageSquare,
    CreditCard,
    User,
    Settings,
    LogOut,
    LayoutDashboard,
    Search,
    Bell,
    Plus
} from 'lucide-react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useDashboard } from '../../context/DashboardContext';
import ProfileEditModal from '../common/ProfileEditModal';

const DashboardLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { unreadCount } = useDashboard();
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    React.useEffect(() => {
        if (!user.userId) {
            navigate('/login');
        } else if (user.role !== 'CLIENT') {
            navigate(user.role === 'FREELANCER' ? '/freelancer-dashboard' : '/');
        }
    }, [user.userId, user.role, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleRefresh = (e, path) => {
        if (location.pathname === path) {
            e.preventDefault();
            window.location.reload();
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-full z-20">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <span className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-lg">M</span>
                        MicroHire
                    </h2>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    <NavLink
                        to="/client-dashboard"
                        end
                        onClick={(e) => handleRefresh(e, '/client-dashboard')}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'
                            }`
                        }
                    >
                        <LayoutDashboard size={20} />
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/client-dashboard/post-job"
                        onClick={(e) => handleRefresh(e, '/client-dashboard/post-job')}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'
                            }`
                        }
                    >
                        <Plus size={20} />
                        Post Job
                    </NavLink>
                    <NavLink
                        to="/client-dashboard/my-jobs"
                        onClick={(e) => handleRefresh(e, '/client-dashboard/my-jobs')}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'
                            }`
                        }
                    >
                        <Briefcase size={20} />
                        My Jobs
                    </NavLink>
                    <NavLink
                        to="/client-dashboard/notifications"
                        onClick={(e) => handleRefresh(e, '/client-dashboard/notifications')}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'
                            }`
                        }
                    >
                        <Bell size={20} />
                        Notifications
                        {unreadCount > 0 && (
                            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{unreadCount}</span>
                        )}
                    </NavLink>
                    <NavLink
                        to="/client-dashboard/freelancers"
                        onClick={(e) => handleRefresh(e, '/client-dashboard/freelancers')}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'
                            }`
                        }
                    >
                        <User size={20} />
                        Freelancers
                    </NavLink>
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <NavLink
                        to="/client-dashboard/settings"
                        onClick={(e) => handleRefresh(e, '/client-dashboard/settings')}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'
                            }`
                        }
                    >
                        <Settings size={20} />
                        Settings
                    </NavLink>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
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
                        <h1 className="text-2xl font-bold text-gray-800">Overview</h1>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                            Client Account
                        </span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search jobs, messages..."
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                            />
                        </div>

                        <button
                            onClick={() => navigate('/client-dashboard/notifications')}
                            className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <Bell size={20} />
                            {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
                        </button>

                        <div
                            className="flex items-center gap-3 pl-6 border-l border-gray-200 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                            onClick={() => navigate('/client-dashboard/settings')}
                        >
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-medium text-gray-900">{user.fullName || 'Client'}</p>
                                <p className="text-xs text-gray-500">{user.role || 'Client'}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold border-2 border-white shadow-sm overflow-hidden">
                                {user.fullName ? user.fullName.split(' ').map(n => n[0]).join('') : 'C'}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-8 flex-1 overflow-auto bg-gray-50">
                    <Outlet />
                </main>
            </div>

            <ProfileEditModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                userType="client"
                userData={user}
            />
        </div>
    );
};

export default DashboardLayout;
