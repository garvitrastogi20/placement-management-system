const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");

const UPLOADS_DIR = path.resolve(process.cwd(), "uploads");
const MAX_RESUME_BYTES = 10 * 1024 * 1024;
const DEFAULT_FETCH_TIMEOUT_MS = 30000;

const ensureUploadsDir = () => {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  return UPLOADS_DIR;
};

const safeUnlink = async (filePath) => {
  if (!filePath) return;
  try {
    await fsp.unlink(filePath);
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.error("Temporary file deletion error:", err.message);
    }
  }
};

const readHeaderBytes = async (filePath, length = 12) => {
  const handle = await fsp.open(filePath, "r");
  try {
    const buffer = Buffer.alloc(length);
    const { bytesRead } = await handle.read(buffer, 0, length, 0);
    return buffer.subarray(0, bytesRead);
  } finally {
    await handle.close();
  }
};

const isPdfBuffer = (buffer) =>
  Buffer.isBuffer(buffer) &&
  buffer.length >= 5 &&
  buffer.subarray(0, 5).toString("ascii") === "%PDF-";

const isPdfFile = async (filePath) => {
  const header = await readHeaderBytes(filePath, 5);
  return isPdfBuffer(header);
};

const isSupportedImageBuffer = (buffer) => {
  if (!Buffer.isBuffer(buffer) || buffer.length < 4) {
    return false;
  }

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return true;
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return true;
  }

  // GIF: GIF87a or GIF89a
  if (buffer.length >= 6) {
    const gifHeader = buffer.subarray(0, 6).toString("ascii");
    if (gifHeader === "GIF87a" || gifHeader === "GIF89a") {
      return true;
    }
  }

  // WebP: RIFF....WEBP
  if (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return true;
  }

  return false;
};

const isSupportedImageFile = async (filePath) => {
  const header = await readHeaderBytes(filePath, 12);
  return isSupportedImageBuffer(header);
};

const isAllowedResumeUrl = (urlString) => {
  if (typeof urlString !== "string" || !urlString.trim()) {
    return false;
  }

  try {
    const parsed = new URL(urlString);
    if (parsed.protocol !== "https:") {
      return false;
    }

    const host = parsed.hostname.toLowerCase();
    return host === "res.cloudinary.com" || host.endsWith(".cloudinary.com");
  } catch {
    return false;
  }
};

class ResumeFetchError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "ResumeFetchError";
    this.status = status;
  }
}

const fetchValidatedResumePdf = async (
  resumeUrl,
  { maxBytes = MAX_RESUME_BYTES, timeoutMs = DEFAULT_FETCH_TIMEOUT_MS } = {},
) => {
  if (!isAllowedResumeUrl(resumeUrl)) {
    throw new ResumeFetchError(
      400,
      "Stored resume URL is invalid or from an untrusted host. Please upload your resume again.",
    );
  }

  const response = await fetch(resumeUrl, {
    signal: AbortSignal.timeout(timeoutMs),
    redirect: "error",
  });

  if (!response.ok) {
    throw new ResumeFetchError(
      502,
      "Unable to retrieve your stored resume. Please upload it again.",
    );
  }

  const contentType = (response.headers.get("content-type") || "").toLowerCase();

  if (
    contentType &&
    !contentType.includes("application/pdf") &&
    !contentType.includes("application/octet-stream")
  ) {
    throw new ResumeFetchError(
      415,
      "The stored file does not appear to be a PDF.",
    );
  }

  const contentLength = Number(response.headers.get("content-length") || 0);
  if (contentLength > maxBytes) {
    throw new ResumeFetchError(413, "Your resume must be 10 MB or smaller.");
  }

  const resumeBuffer = Buffer.from(await response.arrayBuffer());

  if (resumeBuffer.length === 0) {
    throw new ResumeFetchError(400, "Your uploaded resume is empty.");
  }

  if (resumeBuffer.length > maxBytes) {
    throw new ResumeFetchError(413, "Your resume must be 10 MB or smaller.");
  }

  if (!isPdfBuffer(resumeBuffer)) {
    throw new ResumeFetchError(
      415,
      "The uploaded file is not a valid PDF resume.",
    );
  }

  return resumeBuffer;
};

module.exports = {
  UPLOADS_DIR,
  MAX_RESUME_BYTES,
  ensureUploadsDir,
  safeUnlink,
  isPdfBuffer,
  isPdfFile,
  isSupportedImageBuffer,
  isSupportedImageFile,
  isAllowedResumeUrl,
  ResumeFetchError,
  fetchValidatedResumePdf,
};
