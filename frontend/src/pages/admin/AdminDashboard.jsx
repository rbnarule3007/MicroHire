import React from 'react';
import { Users, Briefcase, FileText, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import Card from '../../components/common/Card';

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <Card className="p-6 border-none shadow-md hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon size={24} className="text-white" />
            </div>
            {trend && (
                <span className="flex items-center text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <TrendingUp size={14} className="mr-1" />
                    {trend}
                </span>
            )}
        </div>
        <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
    </Card>
);

const AdminDashboard = () => {
    // Mock Data
    const recentActivity = [
        { id: 1, action: 'New User Signup', user: 'Sarah Wilson', type: 'Freelancer', time: '5 mins ago' },
        { id: 2, action: 'Job Posted', user: 'Tech Corp', type: 'Client', time: '15 mins ago' },
        { id: 3, action: 'Profile Verified', user: 'James Bond', type: 'Freelancer', time: '1 hour ago' },
        { id: 4, action: 'New User Signup', user: 'Design Studio', type: 'Client', time: '2 hours ago' },
        { id: 5, action: 'Job Completed', user: 'Creative Minds', type: 'Client', time: '5 hours ago' },
    ];

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value="1,248"
                    icon={Users}
                    color="bg-blue-500"
                    trend="+12%"
                />
                <StatCard
                    title="Active Jobs"
                    value="456"
                    icon={Briefcase}
                    color="bg-purple-500"
                    trend="+5%"
                />
                <StatCard
                    title="Total Applications"
                    value="8,932"
                    icon={FileText}
                    color="bg-orange-500"
                    trend="+18%"
                />
                <StatCard
                    title="Pending Reviews"
                    value="23"
                    icon={Clock}
                    color="bg-pink-500"
                />
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Activity List */}
                <div className="lg:col-span-2">
                    <Card className="border-none shadow-md h-full">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-800">Recent Activity</h2>
                            <button className="text-sm text-purple-600 font-medium hover:text-purple-700">View All</button>
                        </div>
                        <div className="p-6">
                            <div className="space-y-6">
                                {recentActivity.map((item) => (
                                    <div key={item.id} className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold shrink-0">
                                            {item.user.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{item.action}</p>
                                            <p className="text-sm text-gray-500">
                                                <span className="font-medium text-gray-700">{item.user}</span> • {item.type}
                                            </p>
                                        </div>
                                        <span className="text-xs text-gray-400 whitespace-nowrap">{item.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* System Status or Quick Actions */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border-none shadow-md">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-800">System Status</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Server Status</span>
                                <span className="flex items-center text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded-full">
                                    <CheckCircle size={14} className="mr-1" />
                                    Operational
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Database</span>
                                <span className="flex items-center text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded-full">
                                    <CheckCircle size={14} className="mr-1" />
                                    Healthy
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Last Backup</span>
                                <span className="text-sm text-gray-900 font-medium">2 hours ago</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
