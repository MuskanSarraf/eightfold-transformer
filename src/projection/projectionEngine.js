const getValue = require("../utils/getValue");
const setValue = require("../utils/setValue");
const normalizePhone = require("../normalizers/phoneNormalizer");
const normalizeSkill = require("../normalizers/skillNormalizer");

function project(candidate, config) {
    const output = {};
    const onMissing = config.on_missing || "omit";
    
    if (config.include_confidence !== false) {
        output.overall_confidence = candidate.overall_confidence;
        output.provenance = candidate.provenance;
    }

    if (!config.fields) return output;

    for (const field of config.fields) {
        let sourcePath = field.from || field.path;
        let value = getValue(candidate, sourcePath);

        if (value === undefined || value === null || (Array.isArray(value) && value.length === 0)) {
            if (field.required || onMissing === "error") {
                throw new Error(`Required field missing: ${field.path}`);
            }
            if (onMissing === "null") {
                setValue(output, field.path, null);
            }
            continue;
        }

        if (field.normalize === "E164") {
            if (Array.isArray(value)) {
                value = value.map(v => normalizePhone(v)).filter(Boolean);
            } else {
                value = normalizePhone(value);
            }
        } else if (field.normalize === "canonical") {
            if (Array.isArray(value)) {
                value = value.map(v => normalizeSkill(v) || v);
            } else {
                value = normalizeSkill(value) || value;
            }
        }

        setValue(output, field.path, value);
    }

    return output;
}

module.exports = project;