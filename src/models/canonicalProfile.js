const createEmptyCandidate = () => ({
  personal: {
    fullName: null,
    emails: [],
    phones: [],
    location: {
      city: null,
      country: null
    }
  },

  professional: {
    headline: null,
    currentCompany: null,
    designation: null,
    experience: []
  },

  education: [],

  skills: [],

  social: {
    github: null,
    linkedin: null
  },

  metadata: {
    confidence: {},
    provenance: {},
    sources: []
  }
});

module.exports = {
  createEmptyCandidate
};