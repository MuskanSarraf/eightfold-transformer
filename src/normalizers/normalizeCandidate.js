const normalizePhone = require("./phoneNormalizer");
const normalizeSkill = require("./skillNormalizer");
const normalizeCountry = require("./countryNormalizer");

function normalizeCandidate(candidate) {

  if (candidate.personal.phones.length) {
    candidate.personal.phones =
      candidate.personal.phones.map(normalizePhone);
  }

  candidate.skills =
    candidate.skills.map(normalizeSkill);

  if (candidate.personal.location.country) {
    candidate.personal.location.country =
      normalizeCountry(
        candidate.personal.location.country
      );
  }

  return candidate;
}

module.exports = normalizeCandidate;