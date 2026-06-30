const { buildCandidate } = require("../builders/candidateBuilder");

const candidate = buildCandidate({
  personal: {
    fullName: row["Full Name"],
    emails: row.Email ? [row.Email] : [],
    phones: row.Phone ? [row.Phone] : [],
  },

  professional: {
    currentCompany: row.Company,
    designation: row.Designation,
  },

  metadata: {
    sources: ["csv"],
  },
});

candidates.push(candidate);