const logger = (req, res, next) => {
  const safePath = (req.originalUrl || req.url || "").split("?")[0];
  console.log(req.method, safePath);

  next();
};

module.exports = logger;
