const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const cleanText = (value, maxLength = 1000) => {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxLength);
};

const normalizeEmail = (value) => cleanText(value, 254).toLowerCase();

const isValidEmail = (value) => EMAIL_PATTERN.test(value);

const escapeHtml = (value) =>
  String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

module.exports = {
  cleanText,
  escapeHtml,
  isValidEmail,
  normalizeEmail,
};
