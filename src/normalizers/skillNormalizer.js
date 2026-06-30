const SKILL_MAP = {
  js: "JavaScript",
  javascript: "JavaScript",
  "java script": "JavaScript",

  node: "Node.js",
  nodejs: "Node.js",

  reactjs: "React",
  "react.js": "React",

  mongodb: "MongoDB"
};

function normalizeSkill(skill) {

  if (!skill) return null;

  const key = skill
    .trim()
    .toLowerCase();

  return SKILL_MAP[key] || skill.trim();
}

module.exports = normalizeSkill;