const jwt = require("jsonwebtoken");
const { config } = require("../config");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token manquant" });
  }

  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (err) return res.status(403).json({ error: "Token invalide" });
    req.user = user;
    next();
  });
}

function authorizeRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: "Accès refusé" });
    }
    next();
  };
}

module.exports = {
  authenticateToken,
  authorizeRole,
};
