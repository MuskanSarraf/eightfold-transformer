const countries = require("i18n-iso-countries");

countries.registerLocale(
    require("i18n-iso-countries/langs/en.json")
);

function normalizeCountry(name){

    if(!name) return null;

    const code=countries.getAlpha2Code(name,"en");

    return code||name;

}

module.exports=normalizeCountry;