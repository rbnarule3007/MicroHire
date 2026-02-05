import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Clock,
    Briefcase,
    CheckCircle,
    XCircle,
    AlertCircle,
    ChevronRight,
    MapPin,
    DollarSign
} from 'lucide-react';
import { API_BASE_URL } from '../utils/apiConfig';

const Proposals = () => {
    const navigate = useNavigate();
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (!user.userId) return;

        fetch(`${API_BASE_URL}/api/applications/freelancer/${user.userId}`)
            .then(res => res.json())
            .then(data => {
                setProposals(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch proposals", err);
                setLoading(false);
            });
    }, [user.userId]);

    const getStatusStyles = (status) => {
        switch (status) {
            case 'ACCEPTED':
                return { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle size={16} /> };
            case 'REJECTED':
                return { bg: 'bg-red-100', text: 'text-red-700', icon: <XCircle size={16} /> };
            case 'SHORTLISTED':
                return { bg: 'bg-purple-100', text: 'text-purple-700', icon: <AlertCircle size={16} /> };
            case 'INTERVIEW':
                return { bg: 'bg-blue-100', text: 'text-blue-700', icon: <AlertCircle size={16} /> };
            default:
                return { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <Clock size={16} /> };
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Proposals</h1>
                    <p className="text-gray-500 mt-1">Track the status of your job applications.</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 text-center">
                        <p className="text-sm text-gray-500 font-medium">Applied</p>
                        <p className="text-xl font-bold text-gray-900">{proposals.length}</p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 text-center text-green-600">
                        <p className="text-sm text-gray-500 font-medium">Accepted</p>
                        <p className="text-xl font-bold">{proposals.filter(p => p.status === 'ACCEPTED').length}</p>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                    <p className="text-gray-500 mt-4">Loading your proposals...</p>
                </div>
            ) : proposals.length > 0 ? (
                <div className="space-y-4">
                    {proposals.map((proposal) => {
                        const style = getStatusStyles(proposal.status);
                        return (
                            <div
                                key={proposal.id}
                                onClick={() => navigate(`/freelancer-dashboard/job/${proposal.jobId}`)}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer group"
                            >
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${style.bg} ${style.text}`}>
                                                {style.icon}
                                                {proposal.status}
                                            </span>
                                            <span className="text-xs text-gray-400 font-medium">Applied on {new Date(proposal.appliedAt).toLocaleDateString()}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors mb-2">{proposal.jobTitle || 'Project Title'}</h3>
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1"><Briefcase size={14} /> {proposal.clientName || `Client #${proposal.clientId}`}</span>
                                            <span className="flex items-center gap-1 text-green-700 font-bold">{Math.round(proposal.matchPercentage)}% Match</span>
                                            <span className="flex items-center gap-1 bg-gray-100 px-2.5 py-1 rounded-lg text-gray-700 font-black text-xs">
                                                Rs. {proposal.jobBudget?.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 shrink-0">
                                        <button className="p-2 text-gray-400 group-hover:text-green-600 transition-colors">
                                            <ChevronRight size={24} />
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-50">
                                    <p className="text-gray-600 text-sm line-clamp-1 italic">
                                        <span className="font-bold not-italic">Cover Message:</span> "{proposal.coverMessage}"
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 border-dashed p-20 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Briefcase className="text-gray-300" size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">No proposals yet</h3>
                    <p className="text-gray-500 mt-2 mb-6">You haven't applied to any jobs yet. Start exploring and find your next project!</p>
                    <button
                        onClick={() => navigate('/freelancer-dashboard')}
                        className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-green-700 transition-all shadow-md"
                    >
                        Browse Jobs
                    </button>
                </div>
            )}
        </div>
    );
};

export default Proposals;
