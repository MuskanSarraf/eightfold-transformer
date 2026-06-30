const axios = require("axios");
const { buildCandidate } = require("../builders/candidateBuilder");

async function parseGitHub(username) {
  const { data } = await axios.get(
    `https://api.github.com/users/${username}`
  );

  return buildCandidate({
    personal: {
      fullName: data.name,
    },

    professional: {
      headline: data.bio,
    },

    social: {
      github: data.html_url,
    },

    metadata: {
      sources: ["github"],
    },
  });
}

module.exports = parseGitHub;