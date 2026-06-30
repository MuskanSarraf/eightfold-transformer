const { buildCandidate } = require("../builders/candidateBuilder");

function parseCsvRow(row) {
  return buildCandidate({
    full_name: row["Full Name"] || row["Name"] || "",
    emails: row.Email ? [row.Email] : [],
    phones: row.Phone ? [row.Phone] : [],
    experience: row.Company ? [{ company: row.Company, title: row.Designation }] : []
  }, "csv");
}

module.exports = parseCsvRow;