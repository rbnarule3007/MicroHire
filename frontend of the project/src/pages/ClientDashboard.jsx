import React from 'react';
import {
    Briefcase,
    MessageSquare,
    Star,
    MoreHorizontal,
    Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ClientDashboard = () => {
    const navigate = useNavigate();
    const [statsData, setStatsData] = React.useState({ activeJobs: 0, unreadMessages: 0, avgRating: 5.0 });
    const [activities, setActivities] = React.useState([]);
    const [projects, setProjects] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    React.useEffect(() => {
        if (!user.userId) return;

        const fetchData = async () => {
            try {
                const [statsRes, activityRes, projectsRes] = await Promise.all([
                    fetch(`http://localhost:8080/api/clients/${user.userId}/stats`),
                    fetch(`http://localhost:8080/api/clients/${user.userId}/recent-activity`),
                    fetch(`http://localhost:8080/api/clients/${user.userId}/active-projects`)
                ]);

                const stats = statsRes.ok ? await statsRes.json() : { activeJobs: 0, unreadMessages: 0, avgRating: 5.0 };
                const activity = activityRes.ok ? await activityRes.json() : [];
                const activeProjects = projectsRes.ok ? await projectsRes.json() : [];

                setStatsData(stats || { activeJobs: 0, unreadMessages: 0, avgRating: 5.0 });
                setActivities(Array.isArray(activity) ? activity.slice(0, 4) : []);
                setProjects(Array.isArray(activeProjects) ? activeProjects : []);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
                setLoading(false);
            }
        };

        fetchData();
    }, [user.userId]);

    const stats = [
        { title: 'Active Jobs', value: statsData.activeJobs, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-100' },
        { title: 'Unread Notifications', value: statsData.unreadMessages, icon: MessageSquare, color: 'text-green-600', bg: 'bg-green-100' },
        { title: 'Avg. Rating', value: statsData.avgRating, icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-100' },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Good Morning, {user.fullName || 'Client'}! 👋</h1>
                    <p className="text-gray-500 mt-1">Here's what's happening with your projects today.</p>
                </div>
                <button
                    onClick={() => navigate('/client-dashboard/post-job')}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
                >
                    <Plus size={20} />
                    Post a New Job
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                                </div>
                                <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                                    <Icon size={24} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Active Projects */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">Active Projects</h2>
                        <button onClick={() => navigate('/client-dashboard/my-jobs')} className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Project Name</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Freelancer</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Progress</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Due Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {projects.length > 0 ? projects.map((project) => (
                                        <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-gray-900">{project.title}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                                                        {project.freelancerName ? project.freelancerName.split(' ').map(n => n[0]).join('') : '?'}
                                                    </div>
                                                    <span className="text-sm text-gray-600">{project.freelancerName || 'Unassigned'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${project.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                                                        project.status === 'REVIEW' ? 'bg-purple-100 text-purple-800' :
                                                            'bg-yellow-100 text-yellow-800'}`}>
                                                    {project.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 w-20 bg-gray-100 rounded-full h-2">
                                                        <div
                                                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                                            style={{ width: `${project.progress || 0}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700">{project.progress || 0}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {project.deadline || 'No deadline'}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center text-gray-500 text-sm py-12">No active projects found. Start by posting a job!</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                        <button className="text-gray-400 hover:text-gray-600">
                            <MoreHorizontal size={20} />
                        </button>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="space-y-6">
                            {activities.length > 0 ? activities.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0 ${item.read ? 'bg-gray-300' : 'bg-blue-500'}`}>
                                        {item.message.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-900">
                                            {item.message}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-sm text-gray-500 text-center py-4">No recent activity.</p>
                            )}
                        </div>
                        <button
                            onClick={() => navigate('/client-dashboard/notifications')}
                            className="w-full mt-6 py-2.5 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                        >
                            View All Activity
                        </button>
                    </div>

                    {/* Quick Links Card */}
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-xl shadow-lg text-white">
                        <h3 className="font-bold text-lg mb-2">Need a hand?</h3>
                        <p className="text-blue-100 text-sm mb-6">Our support team is available 24/7 to help you with any issues.</p>
                        <button
                            onClick={() => navigate('/contact')}
                            className="w-full bg-white text-blue-600 py-2.5 rounded-lg font-medium hover:bg-blue-50 transition-colors shadow-sm"
                        >
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientDashboard;
