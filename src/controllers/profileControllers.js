const parseAts = require("../parsers/atsParser");
const parseCsvRow = require("../parsers/csvParser");
const parseResume = require("../parsers/resumeParser");
const normalizeCandidate = require("../normalizers/normalizeCandidate");
const mergeEngine = require("../merger/mergeEngine");
const project = require("../projection/projectionEngine");
const { validateOutput } = require("../validators/candidateSchema");
const stream = require('stream');
const csv = require('csv-parser');

function parseCsvBuffer(buffer) {
    return new Promise((resolve, reject) => {
        const results = [];
        const bufferStream = new stream.PassThrough();
        bufferStream.end(buffer);
        bufferStream
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', reject);
    });
}

exports.uploadFiles = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "No files uploaded." });
        }

        let config;
        try {
            if (req.body.config) {
                config = JSON.parse(req.body.config);
            } else {
                config = {
                  "fields": [
                    { "path": "full_name", "type": "string", "required": true },
                    { "path": "primary_email", "from": "emails[0]", "type": "string", "required": true },
                    { "path": "phone", "from": "phones[0]", "type": "string", "normalize": "E164" },
                    { "path": "skills", "from": "skills[].name", "type": "string[]", "normalize": "canonical" }
                  ],
                  "include_confidence": true,
                  "on_missing": "null"
                };
            }
        } catch (err) {
            return res.status(400).json({ error: "Invalid JSON config" });
        }

        const candidates = [];

        for (const file of req.files) {
            const ext = file.originalname.split('.').pop().toLowerCase();
            if (ext === 'json') {
                const data = JSON.parse(file.buffer.toString());
                candidates.push(parseAts(data));
            } else if (ext === 'csv') {
                const rows = await parseCsvBuffer(file.buffer);
                if (rows.length > 0) {
                    candidates.push(parseCsvRow(rows[0]));
                }
            } else if (ext === 'pdf') {
                const candidate = await parseResume(file.buffer);
                candidates.push(candidate);
            }
        }

        const normalizedCandidates = candidates.map(normalizeCandidate);
        const mergedCandidate = mergeEngine(normalizedCandidates);
        
        let projectedOutput;
        try {
            projectedOutput = project(mergedCandidate, config);
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
        
        const validationResult = validateOutput(projectedOutput, config);
        
        if (!validationResult.success) {
            return res.status(400).json({ 
                error: "Validation failed", 
                details: validationResult.error.errors,
                data: projectedOutput 
            });
        }

        res.json({
            message: "Files processed successfully",
            data: projectedOutput
        });

    } catch (error) {
        console.error("Error processing files:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
