import React, { useState } from 'react';
import { X, Plus, Save } from 'lucide-react';

const AddSkillsModal = ({ isOpen, onClose, onSave, currentSkills }) => {
    const [skillsArr, setSkillsArr] = useState(currentSkills ? currentSkills.split(',').map(s => s.trim()) : []);
    const [newSkill, setNewSkill] = useState('');

    if (!isOpen) return null;

    const handleAdd = (e) => {
        e.preventDefault();
        if (newSkill.trim() && !skillsArr.includes(newSkill.trim())) {
            setSkillsArr([...skillsArr, newSkill.trim()]);
            setNewSkill('');
        }
    };

    const handleRemove = (skillToRemove) => {
        setSkillsArr(skillsArr.filter(s => s !== skillToRemove));
    };

    const handleSave = () => {
        onSave(skillsArr.join(', '));
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl transform transition-all border border-gray-100">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-t-3xl">
                    <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                        <Plus size={20} className="text-blue-600" />
                        Update Core Skills
                    </h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:bg-white hover:text-gray-600 rounded-full transition-all shadow-sm">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <form onSubmit={handleAdd} className="flex gap-2">
                            <input
                                type="text"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                                placeholder="Add a skill (e.g. React)..."
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                            >
                                <Plus size={20} />
                            </button>
                        </form>
                    </div>

                    <div className="flex flex-wrap gap-2 min-h-[100px] p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                        {skillsArr.length > 0 ? (
                            skillsArr.map((skill, index) => (
                                <span key={index} className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-gray-700 rounded-lg text-xs font-bold border border-gray-100 shadow-sm transition-all hover:border-red-200 group">
                                    {skill}
                                    <button onClick={() => handleRemove(skill)} className="text-gray-400 hover:text-red-500 transition-colors">
                                        <X size={14} />
                                    </button>
                                </span>
                            ))
                        ) : (
                            <p className="text-center w-full text-gray-400 text-sm font-medium italic mt-8">No skills added yet</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-8 py-2.5 bg-[#0F172A] text-white rounded-xl font-bold hover:bg-black transition-all shadow-xl active:scale-95"
                        >
                            <Save size={18} />
                            Save Skills
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddSkillsModal;
