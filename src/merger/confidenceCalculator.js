const SOURCE_CONFIDENCE = {
    github: 0.95,
    resume: 0.90,
    ats: 0.85,
    csv: 0.70,
    notes: 0.40
};

function getConfidence(source) {
    return SOURCE_CONFIDENCE[source] || 0.50;
}

module.exports = {
    getConfidence
};