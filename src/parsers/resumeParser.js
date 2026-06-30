const candidate = buildCandidate({

    personal:{
        fullName:extractName(text),
        emails:[extractEmail(text)],
        phones:[extractPhone(text)]
    },

    skills:extractSkills(text),

    education:extractEducation(text),

    metadata:{
        sources:["resume"]
    }

});

candidates.push(candidate);