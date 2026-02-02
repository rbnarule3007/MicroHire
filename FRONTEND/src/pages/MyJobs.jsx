import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Filter, Eye, Edit, Trash2, StopCircle, Check } from 'lucide-react';
import { API } from '../config';
import { useNavigate } from 'react-router-dom';

const MyJobs = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (!user.userId) return;
        fetch(`${API}/api/jobs/client/${user.userId}`)
            .then(res => res.json())
            .then(data => {
                setJobs(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch jobs", err);
                setLoading(false);
            });
    }, [user.userId]);

    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState('All');
    const dropdownRef = useRef(null);
    const filterRef = useRef(null);

    const toggleDropdown = (id) => {
        setActiveDropdown(activeDropdown === id ? null : id);
    };

    const mapper = (status) => {
        if (status === 'OPEN') return 'Active';
        if (status === 'IN_PROGRESS') return 'In Progress';
        return 'Closed';
    };

    const handleEditJob = (jobId) => {
        // Navigate to edit page
        navigate(`/client-dashboard/post-job?mode=edit&jobId=${jobId}`);
        setActiveDropdown(null);
    };

    const handleCloseJob = async (jobId) => {
        if (!window.confirm('Are you sure you want to close this job? This action cannot be undone.')) {
            return;
        }

        try {
            const res = await fetch(`${API}/api/jobs/${jobId}/close`, {
                method: 'PATCH'
            });

            if (res.ok) {
                alert('Job closed successfully!');
                // Refresh jobs list
                const updatedJobs = jobs.map(job =>
                    job.id === jobId ? { ...job, status: 'CLOSED', isActive: false } : job
                );
                setJobs(updatedJobs);
            } else {
                alert('Failed to close job');
            }
        } catch (err) {
            console.error('Error closing job:', err);
            alert('Error closing job');
        }
        setActiveDropdown(null);
    };

    const filteredJobs = filterStatus === 'All'
        ? jobs
        : jobs.filter(job => mapper(job.status) === filterStatus);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setIsFilterOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="max-w-5xl mx-auto h-[500px]">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">My Jobs</h1>

                <div className="relative" ref={filterRef}>
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${isFilterOpen ? 'bg-blue-50 border-blue-200 text-blue-600' : 'border-gray-200 text-gray-600 hover:bg-white'}`}
                    >
                        <Filter size={18} />
                        Filter
                        {filterStatus !== 'All' && <span className="ml-1 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">{filterStatus}</span>}
                    </button>

                    {isFilterOpen && (
                        <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-50 py-1 animate-in fade-in zoom-in-95 duration-100">
                            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Filter by Status</div>
                            {['All', 'Active', 'In Progress', 'Closed'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => {
                                        setFilterStatus(status);
                                        setIsFilterOpen(false);
                                    }}
                                    className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                                >
                                    {status}
                                    {filterStatus === status && <Check size={16} className="text-blue-600" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-visible">
                <div className="overflow-x-visible">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Job Title</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Posted Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Proposals</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-8">Loading jobs...</td></tr>
                            ) : filteredJobs.length > 0 ? (
                                filteredJobs.map((job) => (
                                    <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900">{job.title}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(job.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            <button
                                                onClick={() => navigate(`/client-dashboard/job/${job.id}`)}
                                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors cursor-pointer"
                                            >
                                                View Applicants
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${mapper(job.status) === 'Active' ? 'bg-green-100 text-green-800' :
                                                    mapper(job.status) === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-gray-100 text-gray-800'}`}>
                                                {mapper(job.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right relative">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleDropdown(job.id);
                                                }}
                                                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors inline-block"
                                            >
                                                <MoreVertical size={18} />
                                            </button>

                                            {activeDropdown === job.id && (
                                                <div
                                                    ref={dropdownRef}
                                                    className="absolute right-8 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-50 py-1 text-left origin-top-right animate-in fade-in zoom-in-95 duration-100"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <button
                                                        onClick={() => navigate(`/client-dashboard/job/${job.id}`)}
                                                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                    >
                                                        <Eye size={16} /> View Details
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditJob(job.id)}
                                                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                    >
                                                        <Edit size={16} /> Edit Job
                                                    </button>
                                                    <button
                                                        onClick={() => handleCloseJob(job.id)}
                                                        className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                    >
                                                        <StopCircle size={16} /> Close Job
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                        No jobs found with status "{filterStatus}"
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MyJobs;
