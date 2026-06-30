const project = require('../src/projection/projectionEngine');
const { createEmptyCandidate } = require('../src/models/canonicalProfile');

describe('Projection Engine', () => {
    it('should correctly project based on config', () => {
        const candidate = createEmptyCandidate();
        candidate.full_name = "Jane Doe";
        candidate.phones = ["1234567890"];
        
        const config = {
            fields: [
                { path: "name", from: "full_name" },
                { path: "mobile", from: "phones[0]" }
            ],
            include_confidence: false
        };
        
        const output = project(candidate, config);
        
        expect(output.name).toBe("Jane Doe");
        expect(output.mobile).toBe("1234567890");
        expect(output.overall_confidence).toBeUndefined();
    });

    it('should handle missing values according to config', () => {
        const candidate = createEmptyCandidate();
        
        const configOmit = {
            fields: [{ path: "missing_field", from: "does_not_exist" }],
            on_missing: "omit"
        };
        
        const outputOmit = project(candidate, configOmit);
        expect(outputOmit).not.toHaveProperty("missing_field");
        
        const configNull = {
            fields: [{ path: "missing_field", from: "does_not_exist" }],
            on_missing: "null"
        };
        
        const outputNull = project(candidate, configNull);
        expect(outputNull.missing_field).toBeNull();
    });
});
