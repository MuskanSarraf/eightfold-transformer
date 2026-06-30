const pdfParse = require("pdf-parse");
const { buildCandidate } = require("../builders/candidateBuilder");

function extractName(text) {
    const match = text.match(/Name:\s*([A-Za-z\s]+)/i);
    return match ? match[1].trim() : "Unknown";
}

function extractEmail(text) {
    const match = text.match(/[\w.-]+@[\w.-]+\.\w+/);
    return match ? match[0] : undefined;
}

function extractPhone(text) {
    const match = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    return match ? match[0] : undefined;
}

function extractSkills(text) {
    const skills = ["React", "Node.js", "Python", "JavaScript", "SQL", "MongoDB", "Java", "C\\+\\+", "AWS"];
    const found = [];
    skills.forEach(skill => {
        if (new RegExp(skill, "i").test(text)) {
            found.push(skill.replace(/\\/g, ''));
        }
    });
    return found;
}

async function parseResume(buffer) {
    const data = await pdfParse(buffer);
    const text = data.text;
    
    return buildCandidate({
        full_name: extractName(text),
        emails: [extractEmail(text)].filter(Boolean),
        phones: [extractPhone(text)].filter(Boolean),
        skills: extractSkills(text),
        education: []
    }, "resume");
}

module.exports = parseResume;