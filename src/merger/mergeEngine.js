const { createEmptyCandidate } = require("../models/canonicalProfile");
const { getConfidence } = require("./confidenceCalculator");

function track(target, field, source, method = "direct") {
    if (!target.provenance.find(p => p.field === field && p.source === source)) {
        target.provenance.push({ field, source, method });
    }
}

function mergeCandidates(candidates){
    const merged = createEmptyCandidate();
    let totalConf = 0;
    let fieldCount = 0;

    for(const candidate of candidates){
        const s = candidate._source || 'unknown';
        const conf = getConfidence(s);
        
        if (candidate.full_name) {
            merged.full_name = merged.full_name || candidate.full_name;
            track(merged, 'full_name', s);
            totalConf += conf; fieldCount++;
        }
        
        if (candidate.emails && candidate.emails.length > 0) {
            merged.emails = [...new Set([...merged.emails, ...candidate.emails])];
            track(merged, 'emails', s);
            totalConf += conf; fieldCount++;
        }
        
        if (candidate.phones && candidate.phones.length > 0) {
            merged.phones = [...new Set([...merged.phones, ...candidate.phones])];
            track(merged, 'phones', s);
            totalConf += conf; fieldCount++;
        }
        
        if (candidate.location && (candidate.location.city || candidate.location.region || candidate.location.country)) {
            merged.location = { ...merged.location, ...candidate.location };
            track(merged, 'location', s);
        }

        if (candidate.links && (candidate.links.linkedin || candidate.links.github || candidate.links.portfolio || (candidate.links.other && candidate.links.other.length > 0))) {
            merged.links = { ...merged.links, ...candidate.links };
            track(merged, 'links', s);
        }

        if (candidate.headline) {
            merged.headline = merged.headline || candidate.headline;
            track(merged, 'headline', s);
        }

        if (candidate.years_experience) {
            merged.years_experience = merged.years_experience || candidate.years_experience;
            track(merged, 'years_experience', s);
        }

        if (candidate.experience && candidate.experience.length > 0) {
            merged.experience = [...merged.experience, ...candidate.experience];
            track(merged, 'experience', s);
            totalConf += conf; fieldCount++;
        }

        if (candidate.skills && candidate.skills.length > 0) {
            for (const skill of candidate.skills) {
                const existing = merged.skills.find(sk => sk.name.toLowerCase() === skill.name.toLowerCase());
                if (existing) {
                    if (!existing.sources.includes(s)) existing.sources.push(s);
                    existing.confidence = Math.max(existing.confidence, conf);
                } else {
                    merged.skills.push({ name: skill.name, confidence: conf, sources: [s] });
                }
            }
            track(merged, 'skills', s);
            totalConf += conf; fieldCount++;
        }
        
        if (candidate.education && candidate.education.length > 0) {
            merged.education = [...merged.education, ...candidate.education];
            track(merged, 'education', s);
        }
    }
    
    merged.overall_confidence = fieldCount > 0 ? (totalConf / fieldCount) : 0;
    
    return merged;
}

module.exports=mergeCandidates;