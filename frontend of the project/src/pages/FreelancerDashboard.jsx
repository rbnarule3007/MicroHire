import React, { useState, useEffect } from 'react';
import { Search, MapPin, Clock, DollarSign, Filter, Star, Upload, X, FileText, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { parseSkills, getStoredUser } from '../utils/helpers';

const FreelancerDashboard = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [jobsList, setJobsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = getStoredUser();

    // Saved Jobs Logic
    const [savedJobs, setSavedJobs] = useState(() => {
        const saved = localStorage.getItem(`savedJobs_${user.userId}`);
        return saved ? new Set(JSON.parse(saved)) : new Set();
    });

    const toggleSave = (e, jobId) => {
        e.stopPropagation();
        const newSaved = new Set(savedJobs);
        if (newSaved.has(jobId)) {
            newSaved.delete(jobId);
        } else {
            newSaved.add(jobId);
        }
        setSavedJobs(newSaved);
        localStorage.setItem(`savedJobs_${user.userId}`, JSON.stringify([...newSaved]));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all jobs with match percentage if freelancer logged in
                const baseUrl = 'http://localhost:8080/api/jobs/all';
                const jobsRes = await fetch(user.userId ? `${baseUrl}?freelancerId=${user.userId}` : baseUrl);
                const jobsData = await jobsRes.json();

                // Fetch freelancer's applications to filter out already applied jobs
                const appsRes = await fetch(`http://localhost:8080/api/applications/freelancer/${user.userId}`);
                const appsData = await appsRes.json();

                const appliedJobIds = new Set(Array.isArray(appsData) ? appsData.map(app => app.jobId) : []);

                if (Array.isArray(jobsData)) {
                    // Only show jobs that the freelancer HAS NOT applied for
                    const availableJobs = jobsData.filter(job => !appliedJobIds.has(job.id));
                    setJobsList(availableJobs);
                } else {
                    setJobsList([]);
                }
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
                setJobsList([]);
            } finally {
                setLoading(false);
            }
        };

        if (user.userId) {
            fetchData();
        }
    }, [user.userId]);

    const filteredJobs = jobsList.filter(job => {
        const titleMatch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
        const descMatch = job.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const skills = parseSkills(job.requiredSkills);
        const skillMatch = skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
        return titleMatch || descMatch || skillMatch;
    });

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Main Content Area */}
            <div className="w-full">
                {/* Search and Filters */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search for jobs by title, skill, or keyword"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium text-gray-700">
                            <Filter size={20} />
                            Filters
                        </button>
                        <button className="px-8 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors shadow-sm">
                            Find Jobs
                        </button>
                    </div>
                </div>

                {/* Job Feed */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">Jobs you might like</h2>
                        <span className="text-sm text-gray-500">{filteredJobs.length} jobs found</span>
                    </div>

                    {filteredJobs.length > 0 ? filteredJobs.map((job) => (
                        <div key={job.id} onClick={() => navigate(`/freelancer-dashboard/job/${job.id}`)} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-green-500 transition-colors cursor-pointer group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">{job.title}</h3>
                                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                        <span>{job.status} by <span className="font-medium text-gray-900">{job.clientName || `Client #${job.clientId}`}</span></span>
                                        {job.matchPercentage !== undefined && (
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${job.matchPercentage >= 70 ? 'bg-green-100 text-green-700' :
                                                job.matchPercentage >= 40 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                {Math.round(job.matchPercentage)}% Match
                                            </span>
                                        )}
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => toggleSave(e, job.id)}
                                    className={`p-2 transition-colors rounded-full hover:bg-red-50 ${savedJobs.has(job.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                                >
                                    <span className="sr-only">{savedJobs.has(job.id) ? 'Unsave Job' : 'Save Job'}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill={savedJobs.has(job.id) ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                    </svg>
                                </button>
                            </div>

                            <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                                <div className="flex items-center gap-1.5 bg-[#F0FDF4] px-3 py-1 rounded-full text-[#15803D] font-black border border-[#DCFCE7]">
                                    <span className="text-xs">Rs.</span>
                                    <span>{job.budget ? job.budget.toLocaleString() : 'Negotiable'}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock size={16} />
                                    <span>{job.deadline || 'No deadline'}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <MapPin size={16} />
                                    <span>{job.location || 'Remote'}</span>
                                </div>
                            </div>

                            <p className="text-gray-600 mb-6 line-clamp-2">
                                {job.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {parseSkills(job.requiredSkills).map((skill, index) => (
                                    <span key={index} className="bg-gray-50 text-gray-600 border border-gray-100 px-3 py-1 rounded-full text-xs font-medium">
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={(e) => { e.stopPropagation(); navigate(`/freelancer-dashboard/job/${job.id}`); }}
                                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 transition-colors"
                                >
                                    Apply Now
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); navigate(`/freelancer-dashboard/job/${job.id}`); }}
                                    className="px-4 py-2 text-green-700 font-medium hover:bg-green-50 rounded-lg transition-colors"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    )) : !loading && (
                        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                            <p className="text-gray-500">No jobs found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FreelancerDashboard;
