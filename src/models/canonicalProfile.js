const createEmptyCandidate = () => ({
  candidate_id: null,
  full_name: null,
  emails: [],
  phones: [],
  location: {
    city: null,
    region: null,
    country: null
  },
  links: {
    linkedin: null,
    github: null,
    portfolio: null,
    other: []
  },
  headline: null,
  years_experience: null,
  skills: [], // { name, confidence, sources: [] }
  experience: [], // { company, title, start, end, summary }
  education: [], // { institution, degree, field, end_year }
  provenance: [], // { field, source, method }
  overall_confidence: 0
});

module.exports = {
  createEmptyCandidate
};