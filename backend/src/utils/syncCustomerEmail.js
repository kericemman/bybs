const Subscriber = require("../models/Subscriber");
const { cleanText, isValidEmail, normalizeEmail } = require("./inputValidation");

const syncCustomerEmail = async ({ email, name, source, marketingConsent = false }) => {
  const normalizedEmail = normalizeEmail(email);
  const cleanName = cleanText(name, 120);
  const cleanSource = cleanText(source, 80) || "customer";

  if (!isValidEmail(normalizedEmail)) return null;

  const set = {};
  if (cleanName) set.name = cleanName;
  if (marketingConsent) {
    set.isActive = true;
    set.consentAt = new Date();
  }

  return Subscriber.findOneAndUpdate(
    { email: normalizedEmail },
    {
      ...(Object.keys(set).length ? { $set: set } : {}),
      $addToSet: { sources: cleanSource },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );
};

module.exports = syncCustomerEmail;
