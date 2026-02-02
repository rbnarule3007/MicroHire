import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Heart, Search, MapPin, Clock,
    DollarSign, Briefcase, ChevronRight,
    Trash2, AlertCircle
} from 'lucide-react';
import { getStoredUser, parseSkills } from '../utils/helpers';

const SavedJobs = () => {
    const navigate = useNavigate();
    const user = getStoredUser();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savedJobIds, setSavedJobIds] = useState(() => {
        const saved = localStorage.getItem(`savedJobs_${user.userId}`);
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/jobs/all');
                const data = await res.json();
                if (Array.isArray(data)) {
                    // Filter for jobs that are in the saved list
                    const filtered = data.filter(job => savedJobIds.includes(job.id));
                    setJobs(filtered);
                }
            } catch (err) {
                console.error("Failed to fetch jobs", err);
            } finally {
                setLoading(false);
            }
        };

        if (savedJobIds.length > 0) {
            fetchJobs();
        } else {
            setLoading(false);
        }
    }, [savedJobIds]);

    const removeSavedJob = (e, jobId) => {
        e.stopPropagation();
        const newSavedIds = savedJobIds.filter(id => id !== jobId);
        setSavedJobIds(newSavedIds);
        localStorage.setItem(`savedJobs_${user.userId}`, JSON.stringify(newSavedIds));
        setJobs(jobs.filter(j => j.id !== jobId));
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Saved Jobs</h1>
                    <p className="text-gray-500 mt-1">Keep track of opportunities you're interested in.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
                    <span className="font-bold text-green-600">{jobs.length}</span>
                    <span className="text-gray-500 ml-1 font-medium">Saved</span>
                </div>
            </div>

            {jobs.length > 0 ? (
                <div className="grid gap-4">
                    {jobs.map((job) => (
                        <div
                            key={job.id}
                            onClick={() => navigate(`/freelancer-dashboard/job/${job.id}`)}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:border-green-500 transition-all cursor-pointer group relative"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                                        {job.title}
                                    </h3>
                                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                                        <span className="font-medium text-gray-700">{job.clientName || 'Client'}</span>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                        <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => removeSavedJob(e, job.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                    title="Remove from saved"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>

                            <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
                                <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full font-black">
                                    <span className="text-xs">Rs.</span>
                                    <span>{job.budget?.toLocaleString()}</span>
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

                            <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">
                                {job.description}
                            </p>

                            <div className="flex items-center justify-between">
                                <div className="flex flex-wrap gap-2">
                                    {parseSkills(job.requiredSkills).slice(0, 4).map((skill, index) => (
                                        <span key={index} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-semibold">
                                            {skill}
                                        </span>
                                    ))}
                                    {parseSkills(job.requiredSkills).length > 4 && (
                                        <span className="text-xs text-gray-400 font-medium self-center">
                                            +{parseSkills(job.requiredSkills).length - 4} more
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                                    Apply Now <ChevronRight size={18} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-16 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart className="text-gray-300" size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No saved jobs yet</h3>
                    <p className="text-gray-500 max-w-xs mx-auto mb-8">
                        Save jobs that you're interested in so you can find them later.
                    </p>
                    <button
                        onClick={() => navigate('/freelancer-dashboard')}
                        className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-200"
                    >
                        Explore Jobs
                    </button>
                </div>
            )}
        </div>
    );
};

export default SavedJobs;
