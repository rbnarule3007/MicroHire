import React from 'react';
import { Bell, Briefcase, MessageSquare, CheckCircle } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
    const { notifications, markAllAsRead, markAsRead } = useDashboard();
    const navigate = useNavigate();

    const handleNotificationClick = (notif) => {
        if (!notif.read) {
            markAsRead(notif.id);
        }

        // Navigation logic based on type/content could be added here
        // For now, just marking as read is the primary interaction
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                    Mark all as read
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
                {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No notifications yet.
                    </div>
                ) : (
                    notifications.map((notif) => (
                        <div
                            key={notif.id}
                            onClick={() => handleNotificationClick(notif)}
                            className={`p-6 flex gap-4 hover:bg-gray-50 transition-colors cursor-pointer ${!notif.read ? 'bg-blue-50/50' : ''}`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0
                  ${notif.type === 'proposal' ? 'bg-purple-100 text-purple-600' :
                                    notif.type === 'message' ? 'bg-green-100 text-green-600' :
                                        notif.type === 'success' ? 'bg-blue-100 text-blue-600' :
                                            'bg-gray-100 text-gray-600'}`}>
                                {notif.type === 'proposal' ? <Briefcase size={20} /> :
                                    notif.type === 'message' ? <MessageSquare size={20} /> :
                                        notif.type === 'success' ? <CheckCircle size={20} /> :
                                            <Bell size={20} />}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-start justify-between">
                                    <h3 className={`text-sm font-semibold ${!notif.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                        {notif.title}
                                    </h3>
                                    <span className="text-xs text-gray-500">{notif.time}</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Notifications;
