const jwt = require("jsonwebtoken");
const config = require("../config");

// Middleware d'authentification
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token manquant" });
  }

  jwt.verify(token, config.security.jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token invalide" });
    }
    req.user = user;
    next();
  });
}

// Middleware d'autorisation
function authorizeRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: "Accès non autorisé" });
    }
    next();
  };
}

module.exports = {
  authenticateToken,
  authorizeRole,
};
