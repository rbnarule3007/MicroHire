import React, { useState, useEffect } from 'react';
import {
    ArrowLeft,
    Clock,
    MapPin,
    Star,
    ChevronRight,
    CheckCircle,
    XCircle,
    DollarSign,
    MessageCircle,
    Mail,
    TrendingUp,
    Briefcase
} from 'lucide-react';
import ChatBox from '../components/common/ChatBox';
import { useNavigate, useParams } from 'react-router-dom';
import { parseSkills, calculateMatch, getStoredUser } from '../utils/helpers';

const JobDetails = ({ isClientView }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const user = getStoredUser();
    const [selectedProposal, setSelectedProposal] = useState(null);
    const [job, setJob] = useState(null);
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [coverMessage, setCoverMessage] = useState('');
    const [hasApplied, setHasApplied] = useState(false);
    const [newProgress, setNewProgress] = useState(0);
    const [updateMsg, setUpdateMsg] = useState('');
    const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);
    const [freelancerProfile, setFreelancerProfile] = useState(null);

    // If explicitly in client view (from props), force client mode.
    // Otherwise check user role.
    const isFreelancer = !isClientView && user?.role === 'FREELANCER';

    useEffect(() => {
        const fetchJobData = async () => {
            try {
                // Fetch job with freelancerId to get match percentage and DTO fields
                const url = `http://localhost:8080/api/jobs/${id}${user.userId ? `?freelancerId=${user.userId}` : ''}`;
                const jobRes = await fetch(url);
                if (!jobRes.ok) throw new Error("Job not found");
                const jobData = await jobRes.json();

                if (jobData && (jobData.title || jobData.id)) {
                    setJob(jobData);
                }

                // If freelancer, fetch their profile too for local match breakdown
                if (isFreelancer && user.userId) {
                    const fRes = await fetch(`http://localhost:8080/api/freelancers/${user.userId}`);
                    if (fRes.ok) {
                        setFreelancerProfile(await fRes.json());
                    }
                }

                const appRes = await fetch(`http://localhost:8080/api/applications/job/${id}`);
                if (appRes.ok) {
                    const appData = await appRes.json();
                    setProposals(Array.isArray(appData) ? appData : []);
                }

                setLoading(false);
            } catch (err) {
                console.error("Error fetching job details", err);
                setJob(null);
                setLoading(false);
            }
        };
        fetchJobData();
    }, [id, isFreelancer, user.userId]);

    useEffect(() => {
        if (job) {
            setNewProgress(job.progress || 0);
            setUpdateMsg(job.lastUpdateMessage || '');
        }
    }, [job]);

    useEffect(() => {
        if (isFreelancer && proposals.length > 0) {
            const alreadyApplied = proposals.some(app => app.freelancerId == user.userId);
            setHasApplied(alreadyApplied);
        }
    }, [proposals, isFreelancer, user.userId]);

    const handleUpdateStatus = async (appId, newStatus) => {
        try {
            const res = await fetch(`http://localhost:8080/api/applications/${appId}/status?status=${newStatus}`, {
                method: 'POST'
            });
            if (res.ok) {
                alert(`Status updated to ${newStatus}`);
                window.location.reload();
            }
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };

    // Local helper functions replaced by imported utils

    // Helper for safe initials
    const getInitials = (name) => {
        return (name || 'Unknown').substring(0, 2).toUpperCase();
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
    );

    if (!job) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Job Not Found</h2>
            <p className="text-gray-600 mb-6">The job you are looking for does not exist or has been removed.</p>
            <button
                onClick={() => navigate(-1)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
                Go Back
            </button>
        </div>
    );

    // Mock Job Data
    // const job = {
    //     id: 1,
    //     title: 'E-commerce Website Redesign',
    //     posted: '2 days ago',
    //     budget: '$1,500 - $3,000',
    //     description: 'We are looking for an experienced full-stack developer to redesign our e-commerce platform. The goal is to improve performance, SEO, and mobile responsiveness. The ideal candidate should have a strong portfolio in e-commerce projects.',
    //     requiredSkills: ['React', 'Node.js', 'Tailwind CSS', 'Redux', 'MongoDB', 'SEO']
    // };

    // Mock Proposals Data
    // const proposals = [
    //     {
    //         id: 1,
    //         name: 'Alex Morgan',
    //         title: 'Senior Full Stack Developer',
    //         rate: '$65/hr',
    //         rating: 4.9,
    //         coverLetter: 'Hi, I have over 5 years of experience building e-commerce solutions...',
    //         skills: ['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript'],
    //         avatar: 'AM'
    //     },
    //     {
    //         id: 2,
    //         name: 'Sarah Jen',
    //         title: 'Frontend Specialist',
    //         rate: '$55/hr',
    //         rating: 4.8,
    //         coverLetter: 'I specialize in creating beautiful, responsive user interfaces...',
    //         skills: ['React', 'Tailwind CSS', 'Figma', 'HTML', 'CSS', 'Redux'],
    //         avatar: 'SJ'
    //     },
    //     {
    //         id: 3,
    //         name: 'Mike Johnson',
    //         title: 'Full Stack Ninja',
    //         rate: '$50/hr',
    //         rating: 4.5,
    //         coverLetter: 'I can get this done in 2 weeks. Check my portfolio...',
    //         skills: ['React', 'Node.js', 'Tailwind CSS', 'Redux', 'MongoDB', 'SEO', 'AWS'],
    //         avatar: 'MJ'
    //     }
    // ];

    // Logic to calculate match percentage

    const originalSkills = job?.requiredSkills || job?.required_skills || "";
    const jobRequiredSkills = parseSkills(originalSkills);


    const handleApply = async () => {
        if (!coverMessage.trim()) {
            alert("Please enter a cover message.");
            return;
        }
        try {
            const res = await fetch('http://localhost:8080/api/applications/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jobId: id,
                    freelancerId: user.userId,
                    coverMessage: coverMessage
                })
            });
            if (res.ok) {
                alert("Application submitted successfully!");
                setHasApplied(true);
                window.location.reload();
            } else {
                const msg = await res.text();
                alert(msg || "Failed to apply.");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateProgress = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/jobs/${id}/progress`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    progress: parseInt(newProgress),
                    lastUpdateMessage: updateMsg
                })
            });
            if (res.ok) {
                alert("Progress updated successfully!");
                setIsUpdatingProgress(false);
                const updatedJob = await res.json();
                setJob(updatedJob);
            }
        } catch (err) {
            console.error("Failed to update progress", err);
        }
    };

    const handleMarkComplete = async () => {
        if (!window.confirm("Are you sure the project is complete? This will notify the client.")) return;
        try {
            const res = await fetch(`http://localhost:8080/api/jobs/${id}/complete`, {
                method: 'POST'
            });
            const data = await res.json();
            if (data.success) {
                alert("Project marked as completed!");
                setJob(data.job);
            } else {
                alert(data.message || "Failed to mark as completed");
            }
        } catch (err) {
            console.error("Error completing job:", err);
            alert("An error occurred while completing the job.");
        }
    };

    const isHiredFreelancer = job && job.freelancerId && user && user.userId && job.freelancerId == user.userId && user.role === 'FREELANCER';
    const isJobOwner = job && job.clientId && user && user.userId && job.clientId == user.userId && user.role === 'CLIENT';

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors"
            >
                <ArrowLeft size={18} />
                Back to Dashboard
            </button>

            {/* Job Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                            <span className="flex items-center gap-1"><Clock size={16} /> Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1 font-bold text-gray-900">Rs. {job.budget?.toLocaleString()}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${job.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                {job.status}
                            </span>
                        </div>
                        <p className="text-gray-600 leading-relaxed mb-6">{job.description}</p>

                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex-1">
                                <h3 className="text-sm font-black text-gray-900 mb-3 flex items-center gap-2">
                                    <Briefcase size={16} className="text-blue-600" /> Required Skills
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {jobRequiredSkills.length > 0 ? jobRequiredSkills.map(skill => (
                                        <span key={skill} className="bg-gray-50 text-gray-600 px-3 py-1.5 rounded-xl text-xs font-bold border border-gray-100">
                                            {skill}
                                        </span>
                                    )) : <span className="text-xs text-gray-400 italic">No specific skills listed.</span>}
                                </div>
                            </div>

                            {isFreelancer && freelancerProfile && (
                                <div className="flex-1 p-5 bg-blue-50/50 rounded-2xl border border-blue-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-black text-blue-900 flex items-center gap-2">
                                            <TrendingUp size={16} /> How you match
                                        </h3>
                                        <span className="text-lg font-black text-blue-600">
                                            {job.matchPercentage !== undefined && job.matchPercentage !== null ? job.matchPercentage : calculateMatch(freelancerProfile.skills, originalSkills).percentage}%
                                        </span>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-[10px] font-black text-green-700 uppercase tracking-wider mb-2">Matched Skills</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {calculateMatch(freelancerProfile.skills, originalSkills).matches.length > 0 ? (
                                                    calculateMatch(freelancerProfile.skills, originalSkills).matches.map(skill => (
                                                        <span key={skill} className="bg-green-100 text-green-800 px-2 py-1 rounded-lg text-[10px] font-bold border border-green-200">
                                                            {skill}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-[10px] text-gray-400 italic">None yet</span>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-red-700 uppercase tracking-wider mb-2">Missing Skills</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {calculateMatch(freelancerProfile.skills, originalSkills).missing.length > 0 ? (
                                                    calculateMatch(freelancerProfile.skills, originalSkills).missing.map(skill => (
                                                        <span key={skill} className="bg-red-50 text-red-700 px-2 py-1 rounded-lg text-[10px] font-bold border border-red-100">
                                                            {skill}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-[10px] text-green-600 font-bold italic">Perfect Match!</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {job.matchPercentage !== undefined && (
                                        <div className="mt-4 pt-3 border-t border-blue-100/50">
                                            <p className="text-[9px] text-blue-400 italic font-medium leading-tight">
                                                * This AI score considers your skills (70%), experience level (30%), and profile keywords.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats / Status Actions */}
            <div className="flex flex-col gap-4 min-w-[200px] mt-6">
                {isHiredFreelancer && (
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <h4 className="text-xs font-bold text-blue-600 uppercase mb-2 flex items-center gap-1">
                            <Mail size={14} /> Contact Client
                        </h4>
                        <p className="text-sm font-medium text-gray-900 mb-1">{job.clientName}</p>
                        <a href={`mailto:${job.clientEmail}`} className="text-sm text-blue-600 hover:underline break-all">
                            {job.clientEmail}
                        </a>
                    </div>
                )}

                {(isHiredFreelancer || isJobOwner) && job.status !== 'OPEN' && (
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                        <h4 className="text-xs font-bold text-green-600 uppercase mb-2 flex items-center gap-1">
                            <TrendingUp size={14} /> Project Progress
                        </h4>
                        <div className="flex items-end justify-between mb-1">
                            <span className="text-2xl font-bold text-gray-900">{job.progress || 0}%</span>
                            <span className="text-xs text-gray-500 pb-1">Complete</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-green-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${job.progress || 0}%` }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Communication & Progress Updates Section */}
            {(isHiredFreelancer || isJobOwner) && job.status !== 'OPEN' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <ChatBox jobId={id} currentUser={user} />
                    </div>
                    <div className="lg:col-span-1 space-y-6">
                        {isHiredFreelancer && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="font-bold text-gray-900 mb-4">Update Progress</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Completion %</label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={newProgress}
                                            onChange={(e) => setNewProgress(e.target.value)}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                                        />
                                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                                            <span>0%</span>
                                            <span className="font-bold text-green-600">{newProgress}%</span>
                                            <span>100%</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Current Task / Note</label>
                                        <textarea
                                            className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 min-h-[80px]"
                                            placeholder="What are you working on right now?"
                                            value={updateMsg}
                                            onChange={(e) => setUpdateMsg(e.target.value)}
                                        ></textarea>
                                    </div>

                                    <button
                                        onClick={handleUpdateProgress}
                                        className="w-full py-2.5 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors shadow-sm"
                                    >
                                        Update Progress
                                    </button>

                                    {newProgress == 100 && job.status !== 'COMPLETED' && (
                                        <button
                                            onClick={handleMarkComplete}
                                            className="w-full py-2.5 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg font-black hover:bg-emerald-200 transition-all flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle size={18} /> Mark Project as Done
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="font-bold text-gray-900 mb-4">Project Info</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Status</span>
                                    <span className={`font-black ${job.status === 'COMPLETED' ? 'text-emerald-600' : 'text-blue-600'}`}>
                                        {job.status}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Last Update</span>
                                    <span className="text-gray-900 font-bold">
                                        {job.lastUpdateMessage ? "Updated" : "None yet"}
                                    </span>
                                </div>
                                {job.lastUpdateMessage && (
                                    <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Note:</p>
                                        <p className="text-sm text-gray-700 italic">"{job.lastUpdateMessage}"</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isFreelancer ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Apply for this Job</h2>
                    {hasApplied ? (
                        <div className="bg-green-50 border border-green-200 p-6 rounded-lg text-center">
                            <CheckCircle size={48} className="text-green-600 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-green-900">Application Submitted!</h3>
                            <p className="text-green-700 mt-1">The client has been notified. We'll let you know if there's any update.</p>
                            <div className="mt-4 p-4 bg-white rounded border border-green-100 text-left">
                                <p className="text-xs font-bold text-gray-500 uppercase mb-1">Your Application Status:</p>
                                <p className="text-sm font-bold text-blue-600">{proposals?.find(p => p.freelancerId == user.userId)?.status || 'PENDING'}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Why are you a good fit for this role?</label>
                                <textarea
                                    className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 min-h-[150px]"
                                    placeholder="Briefly describe your experience and approach to this project..."
                                    value={coverMessage}
                                    onChange={(e) => setCoverMessage(e.target.value)}
                                ></textarea>
                            </div>
                            <button
                                onClick={handleApply}
                                className="w-full py-4 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-all shadow-md active:scale-[0.98]"
                            >
                                Submit Application
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <>
                    <h2 className="text-xl font-bold text-gray-900 pt-4">Proposals ({proposals.length})</h2>

                    {/* Proposals List */}
                    <div className="space-y-4 pb-20">
                        {proposals.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                <p className="text-gray-500 font-medium">No applications have been received for this job yet.</p>
                            </div>
                        ) : (
                            proposals.map((proposal) => {
                                const freelancerSkills = parseSkills(proposal.freelancerSkills);
                                const { percentage, matches, missing } = calculateMatch(freelancerSkills, jobRequiredSkills);

                                return (
                                    <div key={proposal.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                        <div className="flex flex-col md:flex-row gap-6">
                                            {/* Avatar & Info */}
                                            <div className="flex gap-4 min-w-[200px]">
                                                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg shrink-0">
                                                    {(proposal.freelancerName || '??').substring(0, 2).toUpperCase()}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-gray-900">{proposal.freelancerName}</h3>
                                                    <p className="text-sm text-gray-500">{proposal.freelancerTitle || 'Freelancer'}</p>
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                                        <span className="text-sm font-medium text-gray-700">{proposal.freelancerRating || 0.0}</span>
                                                    </div>
                                                    <p className="mt-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">{proposal.status}</p>
                                                </div>
                                            </div>

                                            {/* Cover Letter Snip */}
                                            <div className="flex-1">
                                                <p className="text-gray-600 text-sm mb-1 font-medium">Cover Message:</p>
                                                <p className="text-gray-600 text-sm italic mb-4">"{proposal.coverMessage}"</p>

                                                <div className="flex flex-wrap gap-3">
                                                    <a
                                                        href={`mailto:${proposal.freelancerEmail}?subject=Application for ${job.title}&body=Hi ${proposal.freelancerName},`}
                                                        className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                                                    >
                                                        Contact via Email
                                                    </a>
                                                    {proposal.status !== 'ACCEPTED' && proposal.status !== 'REJECTED' && (
                                                        <div className="flex gap-2">
                                                            <button onClick={() => handleUpdateStatus(proposal.id, 'SHORTLISTED')} className="bg-white text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 border border-gray-200">Shortlist</button>
                                                            <button onClick={() => handleUpdateStatus(proposal.id, 'INTERVIEW')} className="bg-white text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 border border-gray-200">Interview</button>
                                                            <button onClick={() => handleUpdateStatus(proposal.id, 'ACCEPTED')} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 shadow-sm">Hire</button>
                                                            <button onClick={() => handleUpdateStatus(proposal.id, 'REJECTED')} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100">Reject</button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Match Score */}
                                            <div className="min-w-[180px] flex flex-col items-end justify-center">
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Match Score</p>
                                                    <button
                                                        onClick={() => setSelectedProposal(selectedProposal === proposal.id ? null : proposal.id)}
                                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold text-sm transition-colors border
                                                            ${(proposal.matchPercentage ?? percentage) >= 80 ? 'bg-green-50 text-green-700 border-green-200' :
                                                                (proposal.matchPercentage ?? percentage) >= 50 ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                                    'bg-red-50 text-red-700 border-red-200'}`}
                                                    >
                                                        {Math.round(proposal.matchPercentage ?? percentage)}% Match
                                                        <ChevronRight size={16} className={`transition-transform ${selectedProposal === proposal.id ? 'rotate-90' : ''}`} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expanded Match Details */}
                                        {selectedProposal === proposal.id && (
                                            <div className="mt-6 pt-6 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div>
                                                        <h4 className="flex items-center gap-2 text-sm font-bold text-green-700 mb-3">
                                                            <CheckCircle size={16} /> Matched Skills
                                                        </h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {matches.length > 0 ? matches.map(skill => (
                                                                <span key={skill} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium border border-green-200">
                                                                    {skill}
                                                                </span>
                                                            )) : <span className="text-sm text-gray-500 italic">No exact matches found.</span>}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <h4 className="flex items-center gap-2 text-sm font-bold text-red-700 mb-3">
                                                            <XCircle size={16} /> Missing Skills
                                                        </h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {missing.length > 0 ? missing.map(skill => (
                                                                <span key={skill} className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-medium border border-red-200">
                                                                    {skill}
                                                                </span>
                                                            )) : <span className="text-sm text-gray-500 italic">All skills matched!</span>}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-4 pt-3 border-t border-gray-100">
                                                    <p className="text-[10px] text-gray-400 italic font-medium leading-tight">
                                                        * This AI score considers freelancer's skills (70%), experience level (30%), and profile keywords.
                                                    </p>
                                                </div>

                                                {proposal.freelancerBio && (
                                                    <div className="mt-6 pt-6 border-t border-gray-100">
                                                        <h4 className="text-sm font-bold text-gray-900 mb-2">Freelancer Bio</h4>
                                                        <p className="text-sm text-gray-600 leading-relaxed">{proposal.freelancerBio}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </>
            )}
        </div >
    );
};

export default JobDetails;
