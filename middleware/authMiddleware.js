const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  const token = authHeader.slice(7).trim();

  if (!token) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not configured.");
    return res.status(500).json({
      message: "Authentication service misconfigured",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

module.exports = protect;
