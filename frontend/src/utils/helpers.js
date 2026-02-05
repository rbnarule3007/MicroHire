/**
 * Safely parses skills input into an array of strings.
 * Handles null, undefined, strings (CSV), and arrays.
 * Filters out invalid entries.
 */
const calculateSkillsBreakdown = (freelancerSkills, jobSkills) => {
    const matches = freelancerSkills.filter(skill =>
        jobSkills.some(js => js.toLowerCase() === skill.toLowerCase())
    );

    const missing = jobSkills.filter(s =>
        !matches.some(m => m.toLowerCase() === s.toLowerCase())
    );

    return { matches, missing };
};

/**
 * Safely parses skills input into an array of strings.
 * Handles null, undefined, strings (CSV), and arrays.
 * Filters out invalid entries.
 */
export const parseSkills = (skillsInput) => {
    if (!skillsInput) return [];

    let skillsArray = [];
    if (Array.isArray(skillsInput)) {
        skillsArray = skillsInput;
    } else if (typeof skillsInput === 'string') {
        // Corrected regex to split by common separators
        skillsArray = skillsInput.split(/[,;|\n]+/).map(s => s.trim());
    } else {
        return [];
    }

    // Defensive filter: Ensure all items are non-empty strings
    return skillsArray.filter(s => s && typeof s === 'string' && s.trim().length > 0);
};

/**
 * Safely calculates match percentage between freelancer skills and job skills.
 * Prevents crashes if inputs contain non-string values.
 */
export const calculateMatch = (freelancerSkills, jobSkills) => {
    const safeJobSkills = parseSkills(jobSkills);
    const safeFreelancerSkills = parseSkills(freelancerSkills);

    const { matches, missing } = calculateSkillsBreakdown(safeFreelancerSkills, safeJobSkills);

    // If no skills required, it's a 100% match by default
    if (safeJobSkills.length === 0) return { percentage: 100, matches: [], missing: [] };

    const percentage = Math.round((matches.length / safeJobSkills.length) * 100);

    return { percentage, matches, missing };
};

/**
 * Safe user extraction from localStorage
 */
export const getStoredUser = () => {
    try {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : {};
    } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        return {};
    }
};
