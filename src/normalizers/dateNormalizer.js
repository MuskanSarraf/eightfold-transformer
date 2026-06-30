const dayjs=require("dayjs");

function normalizeDate(date){

    if(!date) return null;

    const parsed=dayjs(date);

    if(!parsed.isValid())
        return date;

    return parsed.format("YYYY-MM-DD");

}

module.exports=normalizeDate;