const crypto = require("node:crypto");
const path = require("node:path");
const multer = require("multer");
const { ensureUploadsDir } = require("../utils/fileSecurity");

const ALLOWED_IMAGE_MIME_TO_EXT = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const ALLOWED_IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, ensureUploadsDir());
  },

  filename: (req, file, cb) => {
    const mime = (file.mimetype || "").toLowerCase();
    const ext = ALLOWED_IMAGE_MIME_TO_EXT[mime] || ".img";
    const uniqueName = `${Date.now()}-${crypto.randomUUID()}${ext}`;

    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const mime = (file.mimetype || "").toLowerCase();
  const ext = path.extname(file.originalname || "").toLowerCase();

  if (
    !ALLOWED_IMAGE_MIME_TO_EXT[mime] ||
    (ext && !ALLOWED_IMAGE_EXTENSIONS.has(ext))
  ) {
    const err = new Error(
      "Only JPEG, PNG, WebP, or GIF image files are allowed",
    );
    err.statusCode = 400;
    return cb(err, false);
  }

  return cb(null, true);
};

const profileUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 1,
  },
});

module.exports = profileUpload;
