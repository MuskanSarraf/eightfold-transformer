const { buildCandidate } = require("../builders/candidateBuilder");

function parseAts(data) {
    return buildCandidate({
        full_name: data.candidateName,
        emails: data.emailAddress ? [data.emailAddress] : [],
        phones: data.phoneNumber ? [data.phoneNumber] : [],
        experience: data.currentEmployer ? [{ company: data.currentEmployer, title: data.jobTitle }] : [],
        skills: data.skills || []
    }, "ats");
}

module.exports = parseAts;