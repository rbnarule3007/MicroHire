import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../utils/apiConfig';

const DashboardContext = createContext();

export const useDashboard = () => {
    return useContext(DashboardContext);
};

export const DashboardProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (!user.userId || !user.role) return;
        fetch(`${API_BASE_URL}/api/notifications/${user.userId}?role=${user.role}`)
            .then(res => res.ok ? res.json() : [])
            .then(data => {
                if (!Array.isArray(data)) return;
                // Map backend notification to frontend structure
                const mapped = data.map(n => ({
                    id: n.id,
                    title: n.status || 'Notification',
                    message: n.message,
                    time: n.createdAt ? new Date(n.createdAt).toLocaleString() : 'Just now',
                    // Map status to visual types: APPLIED -> proposal, ACCEPTED/HIRED/COMPLETED -> success, others -> info
                    type: n.status === 'APPLIED' ? 'proposal' :
                        (['HIRED', 'ACCEPTED', 'COMPLETED', 'SUCCESS'].includes(n.status)) ? 'success' :
                            (n.status === 'REJECTED' || n.status === 'ERROR') ? 'error' :
                                (n.status === 'CONNECTION') ? 'message' : 'info',
                    // Jackson serializes boolean isRead as "read" by default unless configured otherwise
                    read: n.read !== undefined ? n.read : n.isRead
                }));
                setNotifications(mapped);
            })
            .catch(err => console.error("Failed to fetch notifications", err));
    }, [user.userId, user.role]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllAsRead = () => {
        if (!user.userId || !user.role) return;
        fetch(`${API_BASE_URL}/api/notifications/${user.userId}/mark-read?role=${user.role}`, {
            method: 'POST'
        })
            .then(() => {
                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            })
            .catch(err => console.error("Failed to mark notifications as read", err));
    };

    const markAsRead = (id) => {
        fetch(`${API_BASE_URL}/api/notifications/${id}/read`, {
            method: 'POST'
        })
            .then(() => {
                setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
            })
            .catch(err => console.error("Failed to mark notification as read", err));
    };

    const value = {
        notifications,
        unreadCount,
        markAllAsRead,
        markAsRead
    };

    return (
        <DashboardContext.Provider value={value}>
            {children}
        </DashboardContext.Provider>
    );
};
