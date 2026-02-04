import React from 'react';
import { API_BASE_URL } from '../utils/apiConfig';

const Settings = () => {
    // Get user data from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Split full name into first and last name if possible
    const nameParts = user.fullName ? user.fullName.split(' ') : ['', ''];
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');
    const firstNameRef = React.useRef();
    const lastNameRef = React.useRef();

    const handleSaveChanges = async () => {
        const updatedData = {
            fullName: `${firstNameRef.current.value} ${lastNameRef.current.value}`
        };

        let endpoint = '';
        const role = user.role?.toUpperCase();

        if (role === 'CLIENT') {
            endpoint = `${API_BASE_URL}/api/clients/${user.userId}`;
        } else if (role === 'FREELANCER') {
            endpoint = `${API_BASE_URL}/api/freelancers/${user.userId}`;
        } else if (role === 'ADMIN') {
            endpoint = `${API_BASE_URL}/api/admin/profile/${user.userId}`;
        }

        if (!endpoint || !user.userId) {
            alert("Error: User session is invalid. Please login again.");
            return;
        }

        try {
            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });

            if (response.ok) {
                const refreshedUser = await response.json();
                // Preserve session data, update name
                const newUser = { ...user, fullName: refreshedUser.fullName };
                localStorage.setItem('user', JSON.stringify(newUser));
                alert("Profile updated successfully!");
                window.location.reload();
            } else {
                const errorText = await response.text();
                console.error("Update failed:", errorText);
                alert(`Failed to update profile: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Backend connection error. Check if the server is running.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-8 space-y-8">

                    {/* Section 1 */}
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Profile Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <input
                                    type="text"
                                    ref={firstNameRef}
                                    defaultValue={firstName}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <input
                                    type="text"
                                    ref={lastNameRef}
                                    defaultValue={lastName}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    defaultValue={user.email || ''}
                                    className="w-full px-4 py-2 border border-blue-100 bg-blue-50/30 text-gray-500 rounded-lg outline-none cursor-not-allowed"
                                    readOnly
                                />
                                <p className="text-xs text-slate-400 mt-1">Email cannot be changed for security reasons.</p>
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Section 2 */}
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Notification Preferences</h2>
                        <div className="space-y-4">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                                <span className="text-gray-700">Email me when a proposal is received</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                                <span className="text-gray-700">Email me about new projects matching my interests</span>
                            </label>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            onClick={handleSaveChanges}
                            className="px-6 py-2 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition-colors shadow-sm focus:ring-4 focus:ring-blue-200"
                        >
                            Save Changes
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Settings;
