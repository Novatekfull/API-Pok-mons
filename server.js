require("dotenv").config();
console.log("Variables d'environnement chargées:", {
  adminUsername: process.env.DEFAULT_ADMIN_USERNAME,
  adminPassword: process.env.DEFAULT_ADMIN_PASSWORD,
  userUsername: process.env.DEFAULT_USER_USERNAME,
  userPassword: process.env.DEFAULT_USER_PASSWORD,
});
console.log("JWT Secret configuré:", process.env.JWT_SECRET || "non configuré");

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const config = require("./src/config");
const pokemonRoutes = require("./src/routes/pokemon");
const { v4: uuidv4 } = require("uuid");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const app = express();

// Middleware de rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    error: "Trop de requêtes, veuillez réessayer plus tard",
  },
});

app.use(limiter);
app.use(helmet());

// Configuration CORS simplifiée
app.use(
  cors({
    origin: "*", // Autoriser toutes les origines en développement
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.static("public")); // Servir les fichiers statiques du dossier public

// Routes
app.use("/pokemons", pokemonRoutes);

// Route de login
app.post("/login", (req, res) => {
  console.log("Requête reçue sur /login");
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);

  const { username, password } = req.body;

  // Identifiants codés en dur pour déboguer
  const ADMIN_USERNAME = "admin";
  const ADMIN_PASSWORD = "admin123";
  const USER_USERNAME = "user";
  const USER_PASSWORD = "user123";

  console.log("Tentative de connexion avec:", { username, password });
  console.log("Identifiants attendus - Admin:", {
    username: ADMIN_USERNAME,
    password: ADMIN_PASSWORD,
  });
  console.log("Identifiants attendus - User:", {
    username: USER_USERNAME,
    password: USER_PASSWORD,
  });

  // Vérifier d'abord si c'est l'admin
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    console.log("Connexion admin réussie");
    const token = jwt.sign(
      { username, role: "admin" },
      config.security.jwtSecret || "maCleSecreteSuperSecurisee",
      { expiresIn: config.security.jwtExpiresIn || "1h" }
    );
    return res.json({ token });
  }

  // Vérifier si c'est un utilisateur normal
  if (username === USER_USERNAME && password === USER_PASSWORD) {
    console.log("Connexion user réussie");
    const token = jwt.sign(
      { username, role: "user" },
      config.security.jwtSecret || "maCleSecreteSuperSecurisee",
      { expiresIn: config.security.jwtExpiresIn || "1h" }
    );
    return res.json({ token });
  }

  console.log("Échec de connexion - identifiants invalides");
  res.status(401).json({ error: "Identifiants invalides" });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ error: "Route non trouvée" });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Erreur interne du serveur" });
});

app.listen(config.server.port, () => {
  console.log(
    `✅ API Pokémon en ligne sur http://localhost:${config.server.port}`
  );
});
