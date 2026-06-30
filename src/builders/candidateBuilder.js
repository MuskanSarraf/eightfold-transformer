const { createEmptyCandidate } = require("../models/canonicalProfile");

function buildCandidate(data = {}) {
  const candidate = createEmptyCandidate();

  Object.assign(candidate.personal, data.personal || {});
  Object.assign(candidate.professional, data.professional || {});

  candidate.education = data.education || [];
  candidate.skills = data.skills || [];

  Object.assign(candidate.social, data.social || {});

  candidate.metadata.sources = data.metadata?.sources || [];

  return candidate;
}

module.exports = {
  buildCandidate,
};