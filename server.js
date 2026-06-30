const normalizeCandidate = require("./src/normalizers/normalizeCandidate");

const candidate = {

  personal:{
      phones:[
          "9876543210"
      ],
      location:{
          country:"India"
      }
  },

  skills:[
      "ReactJS",
      "Node",
      "javascript"
  ]

};

console.log(normalizeCandidate(candidate));