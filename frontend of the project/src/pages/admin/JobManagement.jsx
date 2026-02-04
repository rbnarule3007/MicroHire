import React, { useState } from 'react';
import { Search, Trash2, Eye, Briefcase, MapPin, DollarSign } from 'lucide-react';
import Card from '../../components/common/Card';

const JobManagement = () => {
    // Mock Data
    const [jobs, setJobs] = useState([
        { id: 1, title: 'Frontend Developer React', client: 'Tech Corp', budget: '$500 - $1000', status: 'Open', posted: '2 days ago' },
        { id: 2, title: 'Logo Design', client: 'Design Studio', budget: '$200', status: 'In Progress', posted: '1 week ago' },
        { id: 3, title: 'Content Writer', client: 'Blog Master', budget: '$50 per article', status: 'Closed', posted: '3 days ago' },
        { id: 4, title: 'Python Scraper Script', client: 'Data Inc', budget: '$300', status: 'Open', posted: '5 hours ago' },
        { id: 5, title: 'E-commerce Website', client: 'Shop Local', budget: '$1500', status: 'Open', posted: '1 day ago' },
    ]);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
            setJobs(jobs.filter(job => job.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Job Management</h1>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search jobs..."
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full sm:w-64"
                    />
                </div>
            </div>

            <Card className="border-none shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-medium text-gray-500 text-sm">Job Details</th>
                                <th className="px-6 py-4 font-medium text-gray-500 text-sm">Client</th>
                                <th className="px-6 py-4 font-medium text-gray-500 text-sm">Budget</th>
                                <th className="px-6 py-4 font-medium text-gray-500 text-sm">Status</th>
                                <th className="px-6 py-4 font-medium text-gray-500 text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {jobs.map((job) => (
                                <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-gray-900">{job.title}</p>
                                            <p className="text-xs text-gray-400">Posted {job.posted}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">{job.client}</td>
                                    <td className="px-6 py-4 text-gray-700 font-medium">{job.budget}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${job.status === 'Open' ? 'bg-green-100 text-green-700' :
                                                job.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {job.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(job.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {jobs.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center py-8 text-gray-500">
                                        No jobs found.
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

export default JobManagement;
