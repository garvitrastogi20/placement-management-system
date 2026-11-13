const { rateLimit, ipKeyGenerator } = require("express-rate-limit");

const createAuthRateLimiter = ({
  windowMs = 15 * 60 * 1000,
  limit = Number(process.env.AUTH_RATE_LIMIT_MAX) || 20,
} = {}) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
      success: false,
      message: "Too many authentication attempts. Please try again later.",
    },
  });

const createAiRateLimiter = ({
  windowMs = 15 * 60 * 1000,
  limit = Number(process.env.AI_RATE_LIMIT_MAX) || 30,
} = {}) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    keyGenerator: (req) =>
      req.user?.id ? `user:${req.user.id}` : ipKeyGenerator(req.ip || "unknown"),
    message: {
      success: false,
      message: "Too many AI requests. Please wait before trying again.",
    },
  });

const authRateLimiter = createAuthRateLimiter();
const aiRateLimiter = createAiRateLimiter();

module.exports = {
  createAuthRateLimiter,
  createAiRateLimiter,
  authRateLimiter,
  aiRateLimiter,
};
