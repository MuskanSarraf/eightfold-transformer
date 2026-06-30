const { parsePhoneNumberFromString } = require("libphonenumber-js");

function normalizePhone(phone, defaultCountry = "IN") {
  if (!phone) return null;

  try {
    const parsed = parsePhoneNumberFromString(phone, defaultCountry);

    if (!parsed || !parsed.isValid()) {
      return phone;
    }

    return parsed.number; // E.164 format
  } catch {
    return phone;
  }
}

module.exports = normalizePhone;