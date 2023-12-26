function logging(req, res, next) {
  console.log("Logging Middleware");
  next();
}

module.exports = logging;
