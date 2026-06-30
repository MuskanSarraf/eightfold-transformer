const mergeCandidates = require('../src/merger/mergeEngine');
const { createEmptyCandidate } = require('../src/models/canonicalProfile');

describe('Merge Engine', () => {
    it('should correctly merge non-overlapping fields from two sources', () => {
        const c1 = createEmptyCandidate();
        c1.full_name = "John Doe";
        c1.emails = ["john@example.com"];
        c1._source = "ats";
        
        const c2 = createEmptyCandidate();
        c2.phones = ["+1234567890"];
        c2.headline = "Software Engineer";
        c2._source = "csv";
        
        const merged = mergeCandidates([c1, c2]);
        
        expect(merged.full_name).toBe("John Doe");
        expect(merged.emails).toContain("john@example.com");
        expect(merged.phones).toContain("+1234567890");
        expect(merged.headline).toBe("Software Engineer");
        
        // Check provenance
        expect(merged.provenance.length).toBe(4);
        expect(merged.provenance.find(p => p.field === 'full_name').source).toBe('ats');
        expect(merged.provenance.find(p => p.field === 'phones').source).toBe('csv');
    });

    it('should correctly deduplicate array fields and update confidence', () => {
        const c1 = createEmptyCandidate();
        c1.skills = [{ name: "React", confidence: 1, sources: ["ats"] }];
        c1._source = "ats";
        
        const c2 = createEmptyCandidate();
        c2.skills = [{ name: "React", confidence: 1, sources: ["resume"] }];
        c2._source = "resume";
        
        const merged = mergeCandidates([c1, c2]);
        
        expect(merged.skills.length).toBe(1);
        expect(merged.skills[0].name).toBe("React");
        expect(merged.skills[0].sources).toContain("ats");
        expect(merged.skills[0].sources).toContain("resume");
        // resume has higher base confidence (0.90) than ats (0.85) in our confidenceCalculator
        expect(merged.skills[0].confidence).toBe(0.90); 
    });
});
