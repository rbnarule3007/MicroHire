import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    User, Mail, Phone, MapPin, Briefcase,
    GraduationCap, Award, ExternalLink,
    Edit3, Globe, Code, Clock, ArrowLeft, Plus, Trash2, FileText
} from 'lucide-react';
import { getStoredUser } from '../utils/helpers';
import ProfileEditModal from '../components/common/ProfileEditModal';
import AddProjectModal from '../components/common/AddProjectModal';
import AddCertificationModal from '../components/common/AddCertificationModal';
import AddSkillsModal from '../components/common/AddSkillsModal';

const Profile = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [isCertModalOpen, setIsCertModalOpen] = useState(false);
    const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const user = getStoredUser();

    useEffect(() => {
        const targetId = id || user.userId;
        if (!targetId) return;
        fetchProfile(targetId);
    }, [id, user.userId]);

    const fetchProfile = async (targetId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/freelancers/${targetId}/profile`);
            if (!response.ok) throw new Error('Failed to fetch profile');
            const data = await response.json();
            setProfile(data);
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddProject = async (projectData) => {
        try {
            const url = editingProject
                ? `http://localhost:8080/api/freelancers/${profile.id}/projects/${editingProject.id}`
                : `http://localhost:8080/api/freelancers/${profile.id}/projects`;

            const method = editingProject ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(projectData)
            });
            if (res.ok) {
                fetchProfile(profile.id || user.userId);
                setEditingProject(null);
            }
            else alert("Failed to save project");
        } catch (error) {
            console.error(error);
            alert("Error saving project");
        }
    };

    const handleSaveSkills = async (newSkills) => {
        try {
            const res = await fetch(`http://localhost:8080/api/freelancers/${profile.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ skills: newSkills })
            });
            if (res.ok) fetchProfile(profile.id || user.userId);
            else alert("Failed to update skills");
        } catch (error) {
            console.error(error);
            alert("Error updating skills");
        }
    };

    const handleDeleteProject = async (projectId) => {
        if (!window.confirm("Are you sure you want to delete this project?")) return;
        try {
            const res = await fetch(`http://localhost:8080/api/freelancers/${profile.id}/projects/${projectId}`, {
                method: 'DELETE'
            });
            if (res.ok) fetchProfile(profile.id || user.userId);
            else alert("Failed to delete project");
        } catch (error) {
            console.error(error);
            alert("Error deleting project");
        }
    };

    const handleAddCertification = async (certData) => {
        try {
            const res = await fetch(`http://localhost:8080/api/freelancers/${profile.id}/certifications`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(certData)
            });
            if (res.ok) fetchProfile(profile.id || user.userId);
            else alert("Failed to add certification");
        } catch (error) {
            console.error(error);
            alert("Error adding certification");
        }
    };

    const handleDeleteCertification = async (certId) => {
        if (!window.confirm("Are you sure you want to delete this certification?")) return;
        try {
            const res = await fetch(`http://localhost:8080/api/freelancers/${profile.id}/certifications/${certId}`, {
                method: 'DELETE'
            });
            if (res.ok) fetchProfile(profile.id || user.userId);
            else alert("Failed to delete certification");
        } catch (error) {
            console.error(error);
            alert("Error deleting certification");
        }
    };

    const isOwner = user.role === 'FREELANCER' && (!id || Number(id) === Number(user.userId));

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    if (error) return (
        <div className="text-center py-12 bg-red-50 rounded-xl border border-red-200 text-red-600">
            {error}. Please try again later.
        </div>
    );

    if (!profile) return null;

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            {id && (
                <button
                    onClick={() => navigate('/client-dashboard/freelancers')}
                    className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-medium transition-colors"
                >
                    <ArrowLeft size={18} /> Back to Freelancers
                </button>
            )}
            {/* Profile Header Card */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="h-44 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700"></div>
                <div className="px-10 pb-10">
                    <div className="relative flex flex-col md:flex-row justify-between items-start md:items-end -mt-16 mb-8 gap-6">
                        <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
                            <div className="w-40 h-40 rounded-3xl bg-white p-1.5 shadow-2xl transition-transform hover:scale-[1.02]">
                                {profile.profileImage ? (
                                    <img src={profile.profileImage} alt={profile.fullName} className="w-full h-full rounded-2xl object-cover" />
                                ) : (
                                    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-5xl font-extrabold text-blue-600 border border-gray-100">
                                        {profile.fullName?.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div className="pb-2 space-y-1">
                                <h1 className="text-4xl font-black text-gray-900 tracking-tight">{profile.fullName}</h1>
                                <p className="text-xl text-gray-600 font-semibold">{profile.title || 'Professional Freelancer'}</p>
                                <div className="flex flex-wrap items-center gap-5 mt-4">
                                    <span className="flex items-center gap-2 text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                                        <MapPin size={16} className="text-blue-500" /> {profile.location || 'Remote'}
                                    </span>
                                    <span className="flex items-center gap-2 text-sm font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100/50">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                        Available Now
                                    </span>
                                </div>
                            </div>
                        </div>
                        {isOwner && (
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="flex items-center gap-2 px-8 py-3 bg-[#0F172A] text-white rounded-full font-bold hover:bg-black transition-all shadow-xl hover:shadow-2xl active:scale-95 group"
                            >
                                <Edit3 size={18} className="group-hover:rotate-12 transition-transform" />
                                Edit Profile
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-2 max-w-2xl mx-auto py-8 border-t border-gray-100">
                        <div className="text-center border-r border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Total Projects</p>
                            <p className="text-3xl font-black text-gray-900">{profile.projects?.length || 0}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Member Since</p>
                            <p className="text-3xl font-black text-gray-900">
                                {new Date(profile.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Bio & Skills */}
                <div className="lg:col-span-2 space-y-8">
                    {/* About Section */}
                    <div className="bg-white p-10 rounded-3xl shadow-lg border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600"></div>
                        <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                            <User size={24} className="text-blue-600" /> About Me
                        </h2>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-lg font-medium opacity-90">
                            {profile.bio || "No professional bio added yet. This is your chance to shine and tell clients why you are the best fit for their projects."}
                        </p>
                    </div>

                    {/* Work Experience / Projects */}
                    <div className="bg-white p-10 rounded-3xl shadow-lg border border-gray-100">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                <Briefcase size={24} className="text-blue-600" /> Portfolio Showcase
                            </h2>
                            {isOwner && (
                                <button
                                    onClick={() => setIsProjectModalOpen(true)}
                                    className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-white bg-blue-50 px-5 py-2.5 rounded-full hover:bg-blue-600 transition-all border border-blue-100"
                                >
                                    <Plus size={18} /> Add New Project
                                </button>
                            )}
                        </div>
                        {profile.projects && profile.projects.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {profile.projects.map(project => (
                                    <div key={project.id} className="group p-6 rounded-2xl border border-gray-100 bg-gray-50/30 hover:bg-white hover:border-blue-400 hover:shadow-xl transition-all relative">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-lg font-black text-gray-900 group-hover:text-blue-600 transition-colors">{project.title}</h3>
                                            {isOwner && (
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => {
                                                            setEditingProject(project);
                                                            setIsProjectModalOpen(true);
                                                        }}
                                                        className="text-gray-300 hover:text-blue-500 transition-colors p-1.5 hover:bg-blue-50 rounded-lg"
                                                    >
                                                        <Edit3 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteProject(project.id)}
                                                        className="text-gray-300 hover:text-red-500 transition-colors p-1.5 hover:bg-red-50 rounded-lg"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500 mb-6 line-clamp-3 leading-relaxed font-medium">{project.description}</p>
                                        <div className="flex flex-wrap gap-3">
                                            {project.link && (
                                                <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                                                    Live Demo <ExternalLink size={14} />
                                                </a>
                                            )}
                                            {project.attachmentUrl && (
                                                <a href={project.attachmentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-black text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors">
                                                    Case Study <FileText size={14} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                                <Briefcase size={40} className="text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 font-semibold italic">No projects added to portfolio yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Sidebar Info */}
                <div className="space-y-8">
                    {/* Skills Card */}
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-black text-gray-900 flex items-center gap-3">
                                <Code size={22} className="text-blue-600" /> Core Skills
                            </h3>
                            {isOwner && (
                                <button
                                    onClick={() => setIsSkillsModalOpen(true)}
                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all border border-blue-50"
                                >
                                    <Plus size={20} />
                                </button>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                            {profile.skills ? profile.skills.split(',').map((skill, i) => (
                                <span key={i} className="px-4 py-2 bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700 rounded-xl text-xs font-bold border border-gray-100 hover:border-blue-200 hover:text-blue-600 transition-all cursor-default shadow-sm">
                                    {skill.trim()}
                                </span>
                            )) : (
                                <p className="text-sm text-gray-500 font-medium italic">No skills listed yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Education Card */}
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                        <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-3">
                            <GraduationCap size={22} className="text-blue-600" /> Academic & Background
                        </h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                                <p className="font-black text-gray-900 text-base">{profile.education || 'Self-Taught / Other'}</p>
                                <div className="flex items-center gap-2 mt-2 text-blue-600 font-bold text-sm">
                                    <Clock size={16} /> <span>{profile.experienceYears || '0'} Years Pro Experience</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Certifications Card */}
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-black text-gray-900 flex items-center gap-3">
                                <Award size={22} className="text-blue-600" /> Certifications
                            </h3>
                            {isOwner && (
                                <button
                                    onClick={() => setIsCertModalOpen(true)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-blue-50"
                                >
                                    <Plus size={20} />
                                </button>
                            )}
                        </div>
                        {profile.certifications && profile.certifications.length > 0 ? (
                            <div className="space-y-4">
                                {profile.certifications.map(cert => (
                                    <div key={cert.id} className="group relative bg-gray-50/50 p-4 rounded-2xl border border-gray-100 hover:border-blue-200 transition-all">
                                        <div className="pr-8">
                                            <p className="font-extrabold text-gray-900 text-sm">{cert.name}</p>
                                            <p className="text-xs text-gray-500 font-semibold mt-1">{cert.issuer}</p>
                                            {cert.link && (
                                                <a href={cert.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] uppercase tracking-tighter font-black text-blue-600 mt-2 hover:underline">
                                                    Verify Document <Award size={10} />
                                                </a>
                                            )}
                                        </div>
                                        {isOwner && (
                                            <button
                                                onClick={() => handleDeleteCertification(cert.id)}
                                                className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors p-1"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 font-medium italic">No formal certifications added.</p>
                        )}
                    </div>
                </div>
            </div>

            <ProfileEditModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                userType="freelancer"
                userData={profile}
            />
            <AddProjectModal
                isOpen={isProjectModalOpen}
                onClose={() => {
                    setIsProjectModalOpen(false);
                    setEditingProject(null);
                }}
                onSave={handleAddProject}
                initialData={editingProject}
                title={editingProject ? 'Edit Portfolio Project' : 'Add New Project'}
            />
            <AddCertificationModal
                isOpen={isCertModalOpen}
                onClose={() => setIsCertModalOpen(false)}
                onSave={handleAddCertification}
            />
            <AddSkillsModal
                isOpen={isSkillsModalOpen}
                onClose={() => setIsSkillsModalOpen(false)}
                onSave={handleSaveSkills}
                currentSkills={profile.skills}
            />
        </div>
    );
};

export default Profile;
