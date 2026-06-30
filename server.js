const extractText = require("./src/parsers/resumeParser");

(async()=>{

const text=await extractText("./data/Copy of VINIT_RESUME_JAN07.pdf.pdf (2).pdf");

console.log(text);

})();