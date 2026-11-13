const mongoose = require("mongoose");

const isValidObjectId = (id) =>
  typeof id === "string" && mongoose.Types.ObjectId.isValid(id);

const normalizeEmail = (email) =>
  typeof email === "string" ? email.trim().toLowerCase() : "";

const isValidEmail = (email) =>
  typeof email === "string" &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const isValidHttpUrl = (value) => {
  if (value === undefined || value === null || value === "") {
    return true;
  }

  if (typeof value !== "string") {
    return false;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return true;
  }

  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const parseOptionalNumber = (
  value,
  { min = -Infinity, max = Infinity, integer = false, emptyValue = null } = {},
) => {
  if (value === undefined) {
    return { valid: true, provided: false, value: undefined };
  }

  if (value === "" || value === null) {
    return { valid: true, provided: true, value: emptyValue };
  }

  const num = Number(value);

  if (!Number.isFinite(num)) {
    return { valid: false, provided: true, value: undefined };
  }

  if (integer && !Number.isInteger(num)) {
    return { valid: false, provided: true, value: undefined };
  }

  if (num < min || num > max) {
    return { valid: false, provided: true, value: undefined };
  }

  return { valid: true, provided: true, value: num };
};

const sanitizeStringArray = (value) => {
  if (!Array.isArray(value)) {
    return null;
  }

  return value
    .filter((item) => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
};

const escapeRegex = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

module.exports = {
  isValidObjectId,
  normalizeEmail,
  isValidEmail,
  isValidHttpUrl,
  parseOptionalNumber,
  sanitizeStringArray,
  escapeRegex,
};
