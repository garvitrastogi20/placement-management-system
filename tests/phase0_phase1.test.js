const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const fsp = require("node:fs/promises");
const path = require("node:path");
const http = require("node:http");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

process.env.JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret-for-unit-tests";

const {
  isValidObjectId,
  normalizeEmail,
  isValidEmail,
  isValidHttpUrl,
  parseOptionalNumber,
  sanitizeStringArray,
  escapeRegex,
} = require("../utils/validation");

const {
  UPLOADS_DIR,
  isPdfBuffer,
  isSupportedImageBuffer,
  isAllowedResumeUrl,
  fetchValidatedResumePdf,
  ResumeFetchError,
} = require("../utils/fileSecurity");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const User = require("../models/User");
const Student = require("../models/Student");
const Job = require("../models/Job");
const Application = require("../models/Application");
const cloudinary = require("../config/cloudinary");
const { app } = require("../server");

const startTestServer = () =>
  new Promise((resolve) => {
    const server = http.createServer(app);
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({
        server,
        baseUrl: `http://127.0.0.1:${port}`,
      });
    });
  });

const makeToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

test("validation helpers reject invalid URLs, NaN numbers, and malformed IDs", () => {
  assert.equal(isValidObjectId("507f1f77bcf86cd799439011"), true);
  assert.equal(isValidObjectId("not-an-id"), false);
  assert.equal(isValidObjectId({ $ne: "" }), false);

  assert.equal(normalizeEmail("  User@Example.COM "), "user@example.com");
  assert.equal(isValidEmail("user@example.com"), true);
  assert.equal(isValidEmail("invalid-email"), false);

  assert.equal(isValidHttpUrl("https://example.com/path"), true);
  assert.equal(isValidHttpUrl(""), true);
  assert.equal(isValidHttpUrl("javascript:alert(1)"), false);
  assert.equal(isValidHttpUrl("data:text/html,<script>"), false);

  assert.deepEqual(
    parseOptionalNumber("8.5", { min: 0, max: 10 }),
    { valid: true, provided: true, value: 8.5 },
  );
  assert.equal(parseOptionalNumber("abc", { min: 0, max: 10 }).valid, false);
  assert.equal(parseOptionalNumber(12, { min: 0, max: 10 }).valid, false);
  assert.equal(
    parseOptionalNumber(3.5, { min: 1, max: 12, integer: true }).valid,
    false,
  );

  assert.deepEqual(sanitizeStringArray(["  React ", 123, "", "Node"]), [
    "React",
    "Node",
  ]);
  assert.equal(escapeRegex("C++ (test).*"), "C\\+\\+ \\(test\\)\\.\\*");
});

test("fileSecurity helpers validate PDF/image magic bytes and SSRF allowlist", async (t) => {
  assert.equal(isPdfBuffer(Buffer.from("%PDF-1.7\n...")), true);
  assert.equal(isPdfBuffer(Buffer.from("<html><script>")), false);

  assert.equal(
    isSupportedImageBuffer(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
    true,
  );
  assert.equal(isSupportedImageBuffer(Buffer.from("<svg onload=alert(1)>")), false);

  assert.equal(
    isAllowedResumeUrl("https://res.cloudinary.com/demo/raw/upload/resume.pdf"),
    true,
  );
  assert.equal(isAllowedResumeUrl("http://169.254.169.254/latest/meta-data/"), false);
  assert.equal(isAllowedResumeUrl("http://localhost:5000/secret"), false);

  await assert.rejects(
    () => fetchValidatedResumePdf("http://127.0.0.1:8080/internal.pdf"),
    (err) => err instanceof ResumeFetchError && err.status === 400,
  );

  const originalFetch = global.fetch;
  t.after(() => {
    global.fetch = originalFetch;
  });

  // Ensure application/octet-stream with valid %PDF- magic bytes succeeds
  global.fetch = async () =>
    new Response(Buffer.from("%PDF-1.4\nhello"), {
      status: 200,
      headers: { "content-type": "application/octet-stream" },
    });

  const pdfBuf = await fetchValidatedResumePdf(
    "https://res.cloudinary.com/demo/raw/upload/v1/resume.pdf",
  );
  assert.equal(isPdfBuffer(pdfBuf), true);
});

test("authMiddleware & roleMiddleware handle missing, invalid, and valid tokens safely", () => {
  const createRes = () => {
    const res = { statusCode: 200, body: null };
    res.status = (code) => {
      res.statusCode = code;
      return res;
    };
    res.json = (payload) => {
      res.body = payload;
      return res;
    };
    return res;
  };

  // Missing token
  const res1 = createRes();
  let called1 = false;
  protect({ headers: {} }, res1, () => {
    called1 = true;
  });
  assert.equal(called1, false);
  assert.equal(res1.statusCode, 401);

  // Malformed Bearer header
  const res2 = createRes();
  protect({ headers: { authorization: "BearerToken abc" } }, res2, () => {});
  assert.equal(res2.statusCode, 401);

  // Valid token
  const token = makeToken({ id: "507f1f77bcf86cd799439011", role: "student" });
  const req3 = { headers: { authorization: `Bearer ${token}` } };
  const res3 = createRes();
  let called3 = false;
  protect(req3, res3, () => {
    called3 = true;
  });
  assert.equal(called3, true);
  assert.equal(req3.user.role, "student");

  // roleMiddleware handles missing req.user without crashing
  const res4 = createRes();
  authorizeRoles("recruiter")({}, res4, () => {});
  assert.equal(res4.statusCode, 403);
});

test("HTTP integration: auth privilege escalation fix, password omission, and login", async (t) => {
  const { server, baseUrl } = await startTestServer();
  t.after(() => server.close());

  // 1. Registering as admin must be rejected
  const adminRes = await fetch(`${baseUrl}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Attacker",
      email: "attacker@example.com",
      password: "password123",
      role: "admin",
    }),
  });
  assert.equal(adminRes.status, 400);

  // 2. Successful student registration must not expose password hash
  const originalFindOne = User.findOne;
  const originalCreate = User.create;
  t.after(() => {
    User.findOne = originalFindOne;
    User.create = originalCreate;
  });

  User.findOne = async () => null;
  User.create = async (doc) => ({
    _id: "507f1f77bcf86cd799439011",
    name: doc.name,
    email: doc.email,
    password: doc.password,
    role: doc.role,
    profileImage: "",
    verified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const regRes = await fetch(`${baseUrl}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Test Student",
      email: "Student@Example.com",
      password: "password123",
      role: "student",
    }),
  });
  assert.equal(regRes.status, 201);
  const regJson = await regRes.json();
  assert.equal(regJson.user.password, undefined);
  assert.equal(regJson.user.email, "student@example.com");

  // 3. Login rejects bad credentials with 401 and returns token on match
  const hashed = await bcrypt.hash("password123", 4);
  User.findOne = async () => ({
    _id: "507f1f77bcf86cd799439011",
    name: "Test Student",
    email: "student@example.com",
    password: hashed,
    role: "student",
  });

  const badLogin = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "student@example.com",
      password: "wrong-password",
    }),
  });
  assert.equal(badLogin.status, 401);

  const goodLogin = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "student@example.com",
      password: "password123",
    }),
  });
  assert.equal(goodLogin.status, 200);
  const loginJson = await goodLogin.json();
  assert.ok(loginJson.token);
});

test("HTTP integration: secure resume upload rejects spoofed PDF, cleans temp files, and deletes legacy/raw Cloudinary resumes", async (t) => {
  const { server, baseUrl } = await startTestServer();
  t.after(() => server.close());

  const studentToken = makeToken({
    id: "507f1f77bcf86cd799439011",
    role: "student",
  });

  const originalStudentFindOne = Student.findOne;
  const originalUpload = cloudinary.uploader.upload;
  const originalDestroy = cloudinary.uploader.destroy;

  t.after(() => {
    Student.findOne = originalStudentFindOne;
    cloudinary.uploader.upload = originalUpload;
    cloudinary.uploader.destroy = originalDestroy;
  });

  const beforeFiles = fs.existsSync(UPLOADS_DIR)
    ? await fsp.readdir(UPLOADS_DIR)
    : [];

  // 1. Non-PDF extension rejected by multer fileFilter
  const formBadExt = new FormData();
  formBadExt.append(
    "resume",
    new Blob(["alert(1)"], { type: "text/javascript" }),
    "exploit.js",
  );

  const badExtRes = await fetch(`${baseUrl}/api/student/upload-resume`, {
    method: "POST",
    headers: { Authorization: `Bearer ${studentToken}` },
    body: formBadExt,
  });
  assert.equal(badExtRes.status, 400);

  // 2. Spoofed .pdf without %PDF- magic bytes rejected AND temp file cleaned up
  const formSpoofed = new FormData();
  formSpoofed.append(
    "resume",
    new Blob(["<html>not a pdf</html>"], { type: "application/pdf" }),
    "fake.pdf",
  );

  const spoofRes = await fetch(`${baseUrl}/api/student/upload-resume`, {
    method: "POST",
    headers: { Authorization: `Bearer ${studentToken}` },
    body: formSpoofed,
  });
  assert.equal(spoofRes.status, 400);

  // 3. Valid PDF uploaded as raw resource_type, old resume destroyed, temp file deleted
  const destroyCalls = [];
  cloudinary.uploader.destroy = async (publicId, opts) => {
    destroyCalls.push({ publicId, opts });
    return { result: opts.resource_type === "raw" ? "not found" : "ok" };
  };
  cloudinary.uploader.upload = async (filePath, opts) => {
    assert.equal(opts.resource_type, "raw");
    assert.equal(fs.existsSync(filePath), true);
    return {
      secure_url: "https://res.cloudinary.com/demo/raw/upload/v1/new.pdf",
      public_id: "placement-resumes/new",
    };
  };

  let savedCalled = false;
  const fakeStudent = {
    user: "507f1f77bcf86cd799439011",
    resume: {
      url: "https://res.cloudinary.com/demo/image/upload/v1/old.pdf",
      publicId: "placement-resumes/old",
      originalName: "old.pdf",
    },
    save: async () => {
      savedCalled = true;
    },
  };
  Student.findOne = async () => fakeStudent;

  const formValid = new FormData();
  formValid.append(
    "resume",
    new Blob(["%PDF-1.7\nvalid-pdf-content"], { type: "application/pdf" }),
    "resume.pdf",
  );

  const validRes = await fetch(`${baseUrl}/api/student/upload-resume`, {
    method: "POST",
    headers: { Authorization: `Bearer ${studentToken}` },
    body: formValid,
  });
  assert.equal(validRes.status, 200);
  assert.equal(savedCalled, true);
  assert.equal(destroyCalls.length, 2);
  assert.equal(destroyCalls[0].opts.resource_type, "raw");
  assert.equal(destroyCalls[1].opts.resource_type, "image");

  const afterFiles = fs.existsSync(UPLOADS_DIR)
    ? await fsp.readdir(UPLOADS_DIR)
    : [];
  assert.deepEqual(afterFiles, beforeFiles);
});

test("HTTP integration: job application guards, recruiter dashboard shortlisted count, and AI ID validation", async (t) => {
  const { server, baseUrl } = await startTestServer();
  t.after(() => server.close());

  const studentToken = makeToken({
    id: "507f1f77bcf86cd799439011",
    role: "student",
  });
  const recruiterToken = makeToken({
    id: "507f1f77bcf86cd799439022",
    role: "recruiter",
  });

  const originalJobFindById = Job.findById;
  const originalJobCount = Job.countDocuments;
  const originalJobFind = Job.find;
  const originalAppCount = Application.countDocuments;
  const originalAppFind = Application.find;

  t.after(() => {
    Job.findById = originalJobFindById;
    Job.countDocuments = originalJobCount;
    Job.find = originalJobFind;
    Application.countDocuments = originalAppCount;
    Application.find = originalAppFind;
  });

  // Invalid jobId returns 400
  const invalidApply = await fetch(`${baseUrl}/api/jobs/bad-id/apply`, {
    method: "POST",
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  assert.equal(invalidApply.status, 400);

  // Nonexistent job returns 404
  Job.findById = async () => null;
  const missingApply = await fetch(
    `${baseUrl}/api/jobs/507f1f77bcf86cd799439099/apply`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${studentToken}` },
    },
  );
  assert.equal(missingApply.status, 404);

  // Expired job deadline returns 400
  Job.findById = async () => ({
    _id: "507f1f77bcf86cd799439099",
    deadline: new Date("2020-01-01T00:00:00Z"),
  });
  const expiredApply = await fetch(
    `${baseUrl}/api/jobs/507f1f77bcf86cd799439099/apply`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${studentToken}` },
    },
  );
  assert.equal(expiredApply.status, 400);

  // Recruiter dashboard returns real shortlisted count (not hardcoded 0)
  Job.countDocuments = async () => 2;
  Job.find = () => ({
    select: async () => [{ _id: "507f1f77bcf86cd799439031" }],
    sort: () => ({
      limit: () => ({
        lean: async () => [],
      }),
    }),
  });
  Application.countDocuments = async (query) =>
    query.status === "Shortlisted" ? 3 : 5;
  Application.find = () => ({
    populate: () => ({
      populate: () => ({
        sort: () => ({
          limit: () => ({
            lean: async () => [],
          }),
        }),
      }),
    }),
  });

  const dashRes = await fetch(`${baseUrl}/api/recruiter/dashboard`, {
    headers: { Authorization: `Bearer ${recruiterToken}` },
  });
  assert.equal(dashRes.status, 200);
  const dashJson = await dashRes.json();
  assert.equal(dashJson.stats.shortlisted, 3);
  assert.equal(dashJson.stats.totalApplicants, 5);

  // AI endpoints reject invalid IDs with 400
  const aiPrepBad = await fetch(`${baseUrl}/api/ai/interview-preparation`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${studentToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ jobId: "invalid" }),
  });
  assert.equal(aiPrepBad.status, 400);
});

test("HTTP integration: change-password, Helmet headers, rate limiting, and concurrent applyJob lock", async (t) => {
  const { server, baseUrl } = await startTestServer();
  t.after(() => server.close());

  const studentId = "507f1f77bcf86cd799439011";
  const studentToken = makeToken({ id: studentId, role: "student" });

  // 1. Helmet headers present on responses
  const testRes = await fetch(`${baseUrl}/api/auth/test`);
  assert.equal(testRes.status, 200);
  assert.equal(testRes.headers.get("x-content-type-options"), "nosniff");
  assert.ok(testRes.headers.get("x-frame-options"));

  // 2. PUT /api/auth/change-password validation & password hashing
  const unauthPwRes = await fetch(`${baseUrl}/api/auth/change-password`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      currentPassword: "password123",
      newPassword: "newpassword123",
    }),
  });
  assert.equal(unauthPwRes.status, 401);

  const originalFindById = User.findById;
  t.after(() => {
    User.findById = originalFindById;
  });

  const initialHash = await bcrypt.hash("password123", 4);
  let savedHash = initialHash;
  User.findById = async () => ({
    _id: studentId,
    password: savedHash,
    set password(val) {
      savedHash = val;
    },
    get password() {
      return savedHash;
    },
    save: async () => {},
  });

  const wrongCurPw = await fetch(`${baseUrl}/api/auth/change-password`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${studentToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      currentPassword: "wrong-password",
      newPassword: "newpassword123",
    }),
  });
  assert.equal(wrongCurPw.status, 400);

  const samePw = await fetch(`${baseUrl}/api/auth/change-password`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${studentToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      currentPassword: "password123",
      newPassword: "password123",
    }),
  });
  assert.equal(samePw.status, 400);

  const okPw = await fetch(`${baseUrl}/api/auth/change-password`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${studentToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      currentPassword: "password123",
      newPassword: "newpassword123",
    }),
  });
  assert.equal(okPw.status, 200);
  assert.equal(await bcrypt.compare("newpassword123", savedHash), true);

  // 3. Rate limiter middleware returns 429 once limit exceeded
  const express = require("express");
  const {
    createAuthRateLimiter,
    createAiRateLimiter,
  } = require("../middleware/rateLimitMiddleware");

  const limitedApp = express();
  const tinyAuthLimiter = createAuthRateLimiter({ limit: 2, windowMs: 60_000 });
  const tinyAiLimiter = createAiRateLimiter({ limit: 1, windowMs: 60_000 });
  limitedApp.post("/auth", tinyAuthLimiter, (req, res) => res.json({ ok: true }));
  limitedApp.post(
    "/ai",
    (req, res, next) => {
      req.user = { id: studentId };
      next();
    },
    tinyAiLimiter,
    (req, res) => res.json({ ok: true }),
  );

  const limitedServer = await new Promise((resolve) => {
    const s = http.createServer(limitedApp);
    s.listen(0, "127.0.0.1", () => resolve(s));
  });
  t.after(() => limitedServer.close());
  const limitedBase = `http://127.0.0.1:${limitedServer.address().port}`;

  assert.equal((await fetch(`${limitedBase}/auth`, { method: "POST" })).status, 200);
  assert.equal((await fetch(`${limitedBase}/auth`, { method: "POST" })).status, 200);
  assert.equal((await fetch(`${limitedBase}/auth`, { method: "POST" })).status, 429);

  assert.equal((await fetch(`${limitedBase}/ai`, { method: "POST" })).status, 200);
  assert.equal((await fetch(`${limitedBase}/ai`, { method: "POST" })).status, 429);

  // 4. Concurrent applyJob race prevention
  const originalJobFindById = Job.findById;
  const originalAppFindOne = Application.findOne;
  const originalAppCreate = Application.create;
  t.after(() => {
    Job.findById = originalJobFindById;
    Application.findOne = originalAppFindOne;
    Application.create = originalAppCreate;
  });

  const jobId = "507f1f77bcf86cd799439088";
  Job.findById = async () => {
    await new Promise((r) => setTimeout(r, 30));
    return { _id: jobId, deadline: new Date("2099-01-01T00:00:00Z") };
  };
  let createCalls = 0;
  Application.findOne = async () => null;
  Application.create = async (doc) => {
    createCalls += 1;
    return { _id: "507f1f77bcf86cd799439077", ...doc };
  };

  const [r1, r2] = await Promise.all([
    fetch(`${baseUrl}/api/jobs/${jobId}/apply`, {
      method: "POST",
      headers: { Authorization: `Bearer ${studentToken}` },
    }),
    fetch(`${baseUrl}/api/jobs/${jobId}/apply`, {
      method: "POST",
      headers: { Authorization: `Bearer ${studentToken}` },
    }),
  ]);

  const statuses = [r1.status, r2.status].sort((a, b) => a - b);
  assert.deepEqual(statuses, [201, 409]);
  assert.equal(createCalls, 1);
});

test("HTTP integration: recruiter profile image upload, job deadline validation, and recruiter applicants route", async (t) => {
  const { server, baseUrl } = await startTestServer();
  t.after(() => server.close());

  const recruiterId = "507f1f77bcf86cd799439022";
  const recruiterToken = makeToken({ id: recruiterId, role: "recruiter" });

  const originalFindById = User.findById;
  const originalUpload = cloudinary.uploader.upload;
  const originalJobCreate = Job.create;
  const originalJobFindOne = Job.findOne;
  const originalAppFind = Application.find;

  t.after(() => {
    User.findById = originalFindById;
    cloudinary.uploader.upload = originalUpload;
    Job.create = originalJobCreate;
    Job.findOne = originalJobFindOne;
    Application.find = originalAppFind;
  });

  // 1. Rejects SVG upload and spoofed PNG, accepts real PNG header and cleans up uploads/
  const beforeFiles = fs.existsSync(UPLOADS_DIR)
    ? await fsp.readdir(UPLOADS_DIR)
    : [];

  const svgForm = new FormData();
  svgForm.append(
    "profileImage",
    new Blob(["<svg onload=alert(1)></svg>"], { type: "image/svg+xml" }),
    "avatar.svg",
  );
  const svgRes = await fetch(`${baseUrl}/api/auth/profile/image`, {
    method: "POST",
    headers: { Authorization: `Bearer ${recruiterToken}` },
    body: svgForm,
  });
  assert.equal(svgRes.status, 400);

  let savedImage = "";
  User.findById = async () => ({
    _id: recruiterId,
    profileImage: "",
    save: async function () {
      savedImage = this.profileImage;
    },
  });
  cloudinary.uploader.upload = async (filePath) => {
    assert.equal(fs.existsSync(filePath), true);
    return {
      secure_url: "https://res.cloudinary.com/demo/image/upload/v1/avatar.png",
    };
  };

  const pngBytes = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]);
  const pngForm = new FormData();
  pngForm.append(
    "profileImage",
    new Blob([pngBytes], { type: "image/png" }),
    "avatar.png",
  );
  const pngRes = await fetch(`${baseUrl}/api/auth/profile/image`, {
    method: "POST",
    headers: { Authorization: `Bearer ${recruiterToken}` },
    body: pngForm,
  });
  assert.equal(pngRes.status, 200);
  const pngJson = await pngRes.json();
  assert.equal(
    pngJson.profileImage,
    "https://res.cloudinary.com/demo/image/upload/v1/avatar.png",
  );
  assert.equal(savedImage, pngJson.profileImage);

  const afterFiles = fs.existsSync(UPLOADS_DIR)
    ? await fsp.readdir(UPLOADS_DIR)
    : [];
  assert.deepEqual(afterFiles, beforeFiles);

  // 2. Create job validates deadline
  const badDeadlineRes = await fetch(`${baseUrl}/api/jobs`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${recruiterToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "SDE",
      company: "Acme",
      location: "Remote",
      package: 12,
      description: "Build APIs",
      deadline: "not-a-date",
    }),
  });
  assert.equal(badDeadlineRes.status, 400);

  Job.create = async (doc) => ({ _id: "507f1f77bcf86cd799439055", ...doc });
  const okJobRes = await fetch(`${baseUrl}/api/jobs`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${recruiterToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "SDE",
      company: "Acme",
      location: "Remote",
      package: 12,
      description: "Build APIs",
      skillsRequired: ["Node.js"],
      deadline: "2099-12-31T23:59:59.000Z",
    }),
  });
  assert.equal(okJobRes.status, 201);
  const okJobJson = await okJobRes.json();
  assert.ok(okJobJson.job.deadline);

  // 3. Recruiter job applicants endpoint checks ownership and returns list
  const jobId = "507f1f77bcf86cd799439055";
  Job.findOne = async () => ({ _id: jobId, recruiter: recruiterId });
  Application.find = () => ({
    populate: () => ({
      sort: async () => [
        {
          _id: "507f1f77bcf86cd799439066",
          status: "Applied",
          student: null,
        },
      ],
    }),
  });

  const applicantsRes = await fetch(
    `${baseUrl}/api/recruiter/jobs/${jobId}/applicants`,
    {
      headers: { Authorization: `Bearer ${recruiterToken}` },
    },
  );
  assert.equal(applicantsRes.status, 200);
  const applicantsJson = await applicantsRes.json();
  assert.equal(applicantsJson.length, 1);
  assert.equal(applicantsJson[0].student, null);
});
