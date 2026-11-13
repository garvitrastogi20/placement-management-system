const crypto = require("node:crypto");
const path = require("node:path");
const multer = require("multer");
const { ensureUploadsDir, MAX_RESUME_BYTES } = require("../utils/fileSecurity");

const ALLOWED_PDF_MIME_TYPES = new Set([
  "application/pdf",
  "application/x-pdf",
]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, ensureUploadsDir());
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${crypto.randomUUID()}.pdf`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname || "").toLowerCase();
  const mime = (file.mimetype || "").toLowerCase();

  if (ext !== ".pdf" || !ALLOWED_PDF_MIME_TYPES.has(mime)) {
    const err = new Error("Only PDF files are allowed for resumes");
    err.statusCode = 400;
    return cb(err, false);
  }

  return cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_RESUME_BYTES,
    files: 1,
  },
});

module.exports = upload;
