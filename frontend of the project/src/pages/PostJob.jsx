import React, { useState, useEffect, useRef } from 'react';
import { Upload, X, Calendar, DollarSign, Briefcase, FileText } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PostJob = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isEditMode = searchParams.get('mode') === 'edit';
    const editJobId = searchParams.get('jobId');

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        customCategory: '',
        budget: '',
        requiredSkills: [],
        completionDate: ''
    });
    const [skillInput, setSkillInput] = useState('');
    const [isPosting, setIsPosting] = useState(false);

    const categories = [
        "Web Development",
        "Mobile Development",
        "Software Design",
        "Data Science",
        "Cybersecurity",
        "DevOps",
        "Cloud Computing",
        "AI & Machine Learning",
        "Other"
    ];

    useEffect(() => {
        if (isEditMode && editJobId) {
            fetchJobDetails();
        }
    }, [isEditMode, editJobId]);

    const fetchJobDetails = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/jobs/${editJobId}`);
            if (res.ok) {
                const data = await res.json();
                const isCustomCategory = !categories.includes(data.category) && data.category !== 'Other';

                setFormData({
                    title: data.title,
                    description: data.description,
                    category: isCustomCategory ? 'Other' : (data.category || ''),
                    customCategory: isCustomCategory ? data.category : '',
                    budget: data.budget,
                    requiredSkills: data.requiredSkills ? data.requiredSkills.split(',').map(s => s.trim()) : [],
                    completionDate: data.completionDate || ''
                });
            } else {
                alert("Failed to fetch job details");
            }
        } catch (err) {
            console.error("Error fetching job:", err);
        }
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    // Skills Logic
    const addSkill = (skill) => {
        const trimmed = skill.trim().replace(/,$/, '');
        if (trimmed && !formData.requiredSkills.includes(trimmed)) {
            setFormData(prev => ({
                ...prev,
                requiredSkills: [...prev.requiredSkills, trimmed]
            }));
        }
        setSkillInput('');
    };

    const handleSkillKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSkill(skillInput);
        }
    };

    const handleSkillChange = (e) => {
        const value = e.target.value;
        if (value.endsWith(',')) {
            addSkill(value);
        } else {
            setSkillInput(value);
        }
    };

    const removeSkill = (skillToRemove) => {
        setFormData({
            ...formData,
            requiredSkills: formData.requiredSkills.filter(skill => skill !== skillToRemove)
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const finalCategory = formData.category === 'Other' ? formData.customCategory : formData.category;

        if (!formData.title || !formData.description || !formData.budget || !finalCategory || !formData.completionDate) {
            alert("Please fill in all required fields.");
            return;
        }

        setIsPosting(true);
        try {
            const url = isEditMode
                ? `http://localhost:8080/api/jobs/${editJobId}`
                : 'http://localhost:8080/api/jobs/post';

            const method = isEditMode ? 'PUT' : 'POST';

            const payload = {
                clientId: user.userId,
                clientName: user.fullName,
                clientEmail: user.email,
                title: formData.title,
                description: formData.description,
                category: finalCategory,
                budget: formData.budget,
                requiredSkills: formData.requiredSkills.join(', '),
                completionDate: formData.completionDate
            };

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert(isEditMode ? "Job updated successfully!" : "Job posted successfully!");
                navigate('/client-dashboard/my-jobs');
            } else {
                alert(isEditMode ? "Failed to update job." : "Failed to post job.");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">{isEditMode ? 'Edit Job' : 'Post a New Job'}</h1>

            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
                <form className="space-y-8" onSubmit={handleSubmit}>

                    {/* Basic Info Section */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-slate-800 border-b pb-2">Project Details</h2>

                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
                            <input
                                type="text"
                                id="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. React Frontend Developer needed for E-commerce site"
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">Job Description</label>
                            <textarea
                                id="description"
                                rows={6}
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe the project details, requirements, and deliverables..."
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-y"
                                required
                            ></textarea>
                        </div>
                    </div>

                    {/* Requirements Section */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-slate-800 border-b pb-2">Requirements & Details</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Category (IT Only)</label>
                                <select
                                    id="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    required
                                >
                                    <option value="">Select a category</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                {formData.category === 'Other' && (
                                    <input
                                        type="text"
                                        id="customCategory"
                                        value={formData.customCategory}
                                        onChange={handleChange}
                                        placeholder="Specify category"
                                        className="mt-2 w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        required
                                    />
                                )}
                            </div>

                            <div>
                                <label htmlFor="completionDate" className="block text-sm font-medium text-slate-700 mb-1">Completion Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                    <input
                                        type="date"
                                        id="completionDate"
                                        value={formData.completionDate}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Required Skills</label>
                            <div className="border border-slate-200 rounded-lg p-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all bg-white">
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {formData.requiredSkills.map(skill => (
                                        <span key={skill} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                                            {skill}
                                            <button type="button" onClick={() => removeSkill(skill)} className="hover:text-blue-900"><X size={14} /></button>
                                        </span>
                                    ))}
                                </div>
                                <input
                                    type="text"
                                    value={skillInput}
                                    onChange={handleSkillChange}
                                    onKeyDown={handleSkillKeyDown}
                                    onBlur={() => addSkill(skillInput)}
                                    placeholder={formData.requiredSkills.length === 0 ? "Type a skill and press Enter or comma (e.g. React,)" : "Add another skill..."}
                                    className="w-full outline-none text-sm px-1 py-1"
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Press Enter to add tags</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="budget" className="block text-sm font-medium text-slate-700 mb-1">Budget (in Rupees)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3.5 text-slate-500 font-semibold text-xs pt-0.5">Rs.</span>
                                    <input
                                        type="number"
                                        id="budget"
                                        value={formData.budget}
                                        onChange={handleChange}
                                        placeholder="e.g. 5000"
                                        className="w-full pl-8 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="pt-6 flex justify-end gap-3 border-t border-slate-100">
                        <button type="button" onClick={() => navigate('/client-dashboard/my-jobs')} className="px-6 py-2.5 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPosting}
                            className="px-8 py-2.5 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none"
                        >
                            {isPosting ? 'Saving...' : (isEditMode ? 'Update Job' : 'Post Job')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostJob;
