const axios = require("axios");
const { buildCandidate } = require("../builders/candidateBuilder");

async function parseGitHub(username) {
  const { data } = await axios.get(`https://api.github.com/users/${username}`);
  return buildCandidate({
    full_name: data.name,
    headline: data.bio,
    links: { github: data.html_url }
  }, "github");
}

module.exports = parseGitHub;