const normalizePhone = require("./phoneNormalizer");
const normalizeSkill = require("./skillNormalizer");
const normalizeCountry = require("./countryNormalizer");
const normalizeDate = require("./dateNormalizer");

function normalizeCandidate(candidate) {
  if (candidate.phones && candidate.phones.length) {
    candidate.phones = candidate.phones.map(p => normalizePhone(p)).filter(Boolean);
  }
  
  if (candidate.skills && candidate.skills.length) {
    candidate.skills = candidate.skills.map(s => {
        s.name = normalizeSkill(s.name) || s.name;
        return s;
    });
  }

  if (candidate.location && candidate.location.country) {
    candidate.location.country = normalizeCountry(candidate.location.country);
  }
  
  if (candidate.experience && candidate.experience.length) {
      candidate.experience = candidate.experience.map(exp => {
          if (exp.start) exp.start = normalizeDate(exp.start);
          if (exp.end) exp.end = normalizeDate(exp.end);
          return exp;
      });
  }
  
  if (candidate.education && candidate.education.length) {
      candidate.education = candidate.education.map(edu => {
          if (edu.end_year) {
              const yearStr = normalizeDate(edu.end_year.toString());
              if (yearStr && yearStr.includes('-')) edu.end_year = yearStr.split('-')[0];
          }
          return edu;
      });
  }

  return candidate;
}

module.exports = normalizeCandidate;