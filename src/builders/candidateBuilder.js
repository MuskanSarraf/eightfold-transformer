const { createEmptyCandidate } = require("../models/canonicalProfile");

function buildCandidate(data = {}, sourceName = "unknown") {
  const candidate = createEmptyCandidate();

  if (data.full_name) candidate.full_name = data.full_name;
  if (data.emails) candidate.emails = data.emails;
  if (data.phones) candidate.phones = data.phones;
  if (data.location) candidate.location = { ...candidate.location, ...data.location };
  if (data.links) candidate.links = { ...candidate.links, ...data.links };
  if (data.headline) candidate.headline = data.headline;
  if (data.years_experience) candidate.years_experience = data.years_experience;
  
  if (data.skills) {
      candidate.skills = data.skills.map(s => typeof s === 'string' ? { name: s, confidence: 1, sources: [sourceName] } : s);
  }
  
  if (data.experience) candidate.experience = data.experience;
  if (data.education) candidate.education = data.education;
  
  candidate._source = sourceName;
  
  return candidate;
}

module.exports = { buildCandidate };