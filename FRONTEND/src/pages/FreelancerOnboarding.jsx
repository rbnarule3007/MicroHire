import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Upload, Plus, X, Briefcase, GraduationCap, Code, Trash2 } from 'lucide-react';
import { API } from '../config';

const FreelancerOnboarding = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        displayName: '',
        title: '',
        bio: '',
        skills: [],
        experienceYears: '',
        education: '',
        location: '',
        certifications: [],
        noCertifications: false,
        projects: []
    });

    const [currentSkill, setCurrentSkill] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [currentProject, setCurrentProject] = useState({ title: '', description: '', link: '', attachmentUrl: '' });
    const [currentCertification, setCurrentCertification] = useState({ name: '', issuer: '', link: '' });
    const [isUploading, setIsUploading] = useState(false);

    const SUGGESTED_SKILLS = [
        'React', 'Node.js', 'Python', 'Java', 'C++', 'JavaScript', 'TypeScript',
        'HTML', 'CSS', 'Tailwind CSS', 'Next.js', 'Vue.js', 'Angular',
        'UI/UX Design', 'Figma', 'Adobe XD', 'Photoshop', 'Illustrator',
        'SEO', 'Content Writing', 'Copywriting', 'Digital Marketing',
        'Data Analysis', 'Machine Learning', 'AWS', 'Docker', 'Kubernetes'
    ];

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Protect route
    useEffect(() => {
        if (!user.userId) {
            alert("Please login first.");
            navigate('/login');
        }
    }, [navigate, user.userId]);

    const handleNext = () => setStep((prev) => prev + 1);
    const handleBack = () => setStep((prev) => prev - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prevent accidental submission on earlier steps (e.g. pressing Enter)
        if (step < 3) {
            handleNext();
            return;
        }

        // Optional check for projects, but user said it's mandatory in UI text so let's keep it optional but encouraged
        let finalProjects = [...formData.projects];
        if (currentProject.title && currentProject.description) {
            finalProjects.push(currentProject);
        }

        if (finalProjects.length === 0) {
            alert('Please add at least one project to your portfolio.');
            return;
        }

        const finalData = {
            freelancerId: user.userId,
            displayName: formData.displayName,
            title: formData.title,
            bio: formData.bio,
            skills: formData.skills,
            experienceYears: formData.experienceYears,
            education: formData.education,
            location: formData.location,
            projects: finalProjects,
            certifications: formData.certifications
        };

        try {
            const res = await fetch(`${API}/api/freelancers/onboarding`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalData)
            });

            if (res.ok) {
                // Update local storage so login check knows we are done
                const updatedUser = { ...user, profileCompleteness: 100 };
                localStorage.setItem('user', JSON.stringify(updatedUser));

                alert("Profile completed successfully!");
                navigate('/freelancer-dashboard');
            } else {
                const err = await res.text();
                alert("Failed to save profile: " + err);
            }
        } catch (error) {
            console.error('Onboarding failed:', error);
            alert("Connection error. Check backend.");
        }
    };

    const handleSkillChange = (e) => {
        const value = e.target.value;
        setCurrentSkill(value);
        if (value.trim()) {
            const filtered = SUGGESTED_SKILLS.filter(skill =>
                skill.toLowerCase().includes(value.toLowerCase()) &&
                !formData.skills.includes(skill)
            );
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }
    };

    const selectSkill = (skill) => {
        if (!formData.skills.includes(skill)) {
            setFormData({ ...formData, skills: [...formData.skills, skill] });
        }
        setCurrentSkill('');
        setSuggestions([]);
    };

    const addSkill = (e) => {
        if (e.key === 'Enter' && currentSkill.trim()) {
            e.preventDefault();
            if (!formData.skills.includes(currentSkill.trim())) {
                setFormData({ ...formData, skills: [...formData.skills, currentSkill.trim()] });
            }
            setCurrentSkill('');
            setSuggestions([]);
        }
    };

    const removeSkill = (skillToRemove) => {
        setFormData({ ...formData, skills: formData.skills.filter(s => s !== skillToRemove) });
    };

    const addProject = () => {
        if (currentProject.title && currentProject.description) {
            setFormData({ ...formData, projects: [...formData.projects, currentProject] });
            setCurrentProject({ title: '', description: '', link: '', attachmentUrl: '' });
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const res = await fetch(`${API}/api/upload/file`, {
                method: 'POST',
                body: uploadData
            });

            if (res.ok) {
                const data = await res.json();
                setCurrentProject({ ...currentProject, attachmentUrl: data.url });
            } else {
                alert("Failed to upload file.");
            }
        } catch (err) {
            console.error(err);
            alert("Upload failed.");
        } finally {
            setIsUploading(false);
        }
    };

    const removeProject = (index) => {
        setFormData({ ...formData, projects: formData.projects.filter((_, i) => i !== index) });
    };

    const addCertification = () => {
        if (currentCertification.name && currentCertification.issuer) {
            setFormData({ ...formData, certifications: [...formData.certifications, currentCertification] });
            setCurrentCertification({ name: '', issuer: '', link: '' });
        }
    };

    const removeCertification = (index) => {
        setFormData({ ...formData, certifications: formData.certifications.filter((_, i) => i !== index) });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl">
                {/* Progress Bar */}
                <div className="bg-gray-100 h-2 w-full rounded-t-2xl overflow-hidden">
                    <div
                        className="bg-blue-600 h-full transition-all duration-300 ease-in-out"
                        style={{ width: `${(step / 3) * 100}%` }}
                    ></div>
                </div>

                <div className="p-8">
                    {/* ... header ... */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {step === 1 && "Let's start with your expertise"}
                            {step === 2 && "Tell us about your experience"}
                            {step === 3 && "Showcase your work"}
                        </h2>
                        <p className="text-gray-500 mt-2">
                            {step === 1 && "Define your professional identity to get matched with the right jobs."}
                            {step === 2 && "Clients look for experienced professionals. Highlight your journey."}
                            {step === 3 && "A strong portfolio is key. Add at least one previous project."}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Step 1: Basic Info & Skills */}
                        {step === 1 && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                                    <input
                                        type="text"
                                        value={formData.displayName}
                                        onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                        placeholder="Full Name"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        autoFocus
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Professional Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g. Senior Full Stack Developer"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Professional Bio</label>
                                    <textarea
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        rows={4}
                                        placeholder="Summarize your expertise and what you bring to the table..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Skills (Press Enter to add)</label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {formData.skills.map(skill => (
                                            <span key={skill} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                                                {skill}
                                                <button type="button" onClick={() => removeSkill(skill)}><X size={14} /></button>
                                            </span>
                                        ))}
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={currentSkill}
                                            onChange={handleSkillChange}
                                            onKeyDown={addSkill}
                                            placeholder="e.g. React, Node.js, Design"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                        {suggestions.length > 0 && (
                                            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                                {suggestions.map((skill, index) => (
                                                    <button
                                                        key={index}
                                                        type="button"
                                                        onClick={() => selectSkill(skill)}
                                                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm transition-colors"
                                                    >
                                                        {skill}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Experience */}
                        {step === 2 && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                                    <select
                                        value={formData.experienceYears}
                                        onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="">Select range</option>
                                        <option value="0-2">0-2 years</option>
                                        <option value="3-5">3-5 years</option>
                                        <option value="5-10">5-10 years</option>
                                        <option value="10+">10+ years</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                                    <select
                                        value={formData.education}
                                        onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="">Select education level</option>
                                        <option value="Below 10th">Below 10th</option>
                                        <option value="10th Pass">10th Pass</option>
                                        <option value="12th Pass">12th Pass</option>
                                        <option value="Graduated">Graduated</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            placeholder="e.g. London, UK"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Certifications</label>
                                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                placeholder="Certificate Name"
                                                value={currentCertification.name}
                                                onChange={(e) => setCurrentCertification({ ...currentCertification, name: e.target.value })}
                                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Issuing Organization"
                                                value={currentCertification.issuer}
                                                onChange={(e) => setCurrentCertification({ ...currentCertification, issuer: e.target.value })}
                                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Certificate Link / ID"
                                                value={currentCertification.link}
                                                onChange={(e) => setCurrentCertification({ ...currentCertification, link: e.target.value })}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                            <button
                                                type="button"
                                                onClick={addCertification}
                                                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm"
                                            >
                                                <Plus size={16} /> Add
                                            </button>
                                        </div>
                                    </div>

                                    {formData.certifications.length > 0 && (
                                        <div className="mt-3 space-y-2">
                                            {formData.certifications.map((cert, index) => (
                                                <div key={index} className="flex justify-between items-center bg-white border border-gray-200 p-3 rounded-lg text-sm">
                                                    <div>
                                                        <div className="font-semibold text-gray-900">{cert.name}</div>
                                                        <div className="text-gray-500">{cert.issuer}</div>
                                                    </div>
                                                    <button type="button" onClick={() => removeCertification(index)} className="text-gray-400 hover:text-red-500">
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="mt-4 flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="noCertifications"
                                            checked={formData.noCertifications}
                                            onChange={(e) => setFormData({ ...formData, noCertifications: e.target.checked })}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor="noCertifications" className="text-sm text-gray-600">
                                            I have relevant skills but no formal certifications
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Portfolio */}
                        {step === 3 && (
                            <div className="space-y-6">
                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Briefcase size={18} />
                                        Add a Project
                                        <span className="text-red-500 text-sm font-normal">(Mandatory: Add at least one)</span>
                                    </h3>
                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            placeholder="Project Title"
                                            value={currentProject.title}
                                            onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                        <textarea
                                            placeholder="Project Description"
                                            rows={2}
                                            value={currentProject.description}
                                            onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                        <div className="flex flex-col gap-4">
                                            <input
                                                type="text"
                                                placeholder="Link (Optional) - https://..."
                                                value={currentProject.link}
                                                onChange={(e) => setCurrentProject({ ...currentProject, link: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            />

                                            <div className="flex items-center gap-4">
                                                <div className="flex-1 border-2 border-dashed border-gray-200 rounded-lg p-3 text-center relative hover:bg-gray-50 transition-colors">
                                                    {currentProject.attachmentUrl ? (
                                                        <div className="flex items-center justify-between bg-blue-50 p-1.5 rounded-lg border border-blue-100">
                                                            <div className="flex items-center gap-2 text-blue-700 truncate">
                                                                <FileText size={16} />
                                                                <span className="text-xs truncate font-medium">{currentProject.attachmentUrl.split('/').pop()}</span>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => setCurrentProject({ ...currentProject, attachmentUrl: '' })}
                                                                className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors"
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="relative cursor-pointer py-1">
                                                            <input
                                                                type="file"
                                                                onChange={handleFileChange}
                                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                            />
                                                            <div className="flex flex-col items-center">
                                                                <Upload size={20} className="text-gray-400 mb-1" />
                                                                <p className="text-[11px] text-gray-500">{isUploading ? 'Uploading...' : 'Project File (PDF, Images, etc.)'}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={addProject}
                                                    disabled={isUploading}
                                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all font-bold shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50"
                                                >
                                                    <Plus size={18} className="inline mr-1" /> Add Project
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {formData.projects.length > 0 && (
                                    <div className="space-y-3">
                                        <h4 className="font-medium text-gray-700">Your Projects</h4>
                                        {formData.projects.map((project, index) => (
                                            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-start shadow-sm">
                                                <div>
                                                    <h5 className="font-bold text-gray-900">{project.title}</h5>
                                                    <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                                                    {project.link && <a href={project.link} className="text-xs text-blue-600 hover:underline mt-2 block" target="_blank" rel="noopener noreferrer">View Project</a>}
                                                </div>
                                                <button type="button" onClick={() => removeProject(index)} className="text-gray-400 hover:text-red-500">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-10 pt-6 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={handleBack}
                                className={`flex items-center gap-2 px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-50 rounded-lg transition-colors ${step === 1 ? 'invisible' : ''}`}
                            >
                                <ChevronLeft size={18} /> Back
                            </button>

                            {step < 3 ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
                                >
                                    Next Step <ChevronRight size={18} />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 px-8 py-2.5 bg-green-600 text-white font-bold hover:bg-green-700 rounded-lg transition-colors shadow-sm"
                                >
                                    Complete Profile
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FreelancerOnboarding;
