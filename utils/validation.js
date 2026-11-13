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

const parsePagination = (query, defaultLimit = 10, maxLimit = 50) => {
  let page = parseInt(query?.page, 10);
  if (Number.isNaN(page) || page < 1) {
    page = 1;
  }

  let limit = parseInt(query?.limit, 10);
  if (Number.isNaN(limit) || limit < 1) {
    limit = defaultLimit;
  } else if (limit > maxLimit) {
    limit = maxLimit;
  }

  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const formatPaginationResponse = ({ data, totalRecords, page, limit }) => {
  const totalPages = Math.ceil(totalRecords / limit) || 0;
  return {
    success: true,
    data,
    pagination: {
      currentPage: page,
      totalPages,
      totalRecords,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

module.exports = {
  isValidObjectId,
  normalizeEmail,
  isValidEmail,
  isValidHttpUrl,
  parseOptionalNumber,
  sanitizeStringArray,
  escapeRegex,
  parsePagination,
  formatPaginationResponse,
};
