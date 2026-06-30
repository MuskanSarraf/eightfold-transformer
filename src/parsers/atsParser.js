const candidate = buildCandidate({

    personal:{
        fullName:data.candidateName,
        emails:[data.emailAddress],
        phones:[data.phoneNumber]
    },

    professional:{
        currentCompany:data.currentEmployer,
        designation:data.jobTitle
    },

    skills:data.skills,

    metadata:{
        sources:["ats"]
    }

});

candidates.push(candidate);