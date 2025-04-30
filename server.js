require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { config, connectDB } = require("./src/config");
const pokemonRoutes = require("./src/routes/pokemon");
const { v4: uuidv4 } = require("uuid");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const seedPokemons = require("./src/utils/seed");

const app = express();

// Middlewares
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.static("public"));
app.use(helmet());
app.use(
  rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    message: { error: "Trop de requêtes, veuillez réessayer plus tard" },
  })
);

// Routes
app.use("/pokemons", pokemonRoutes);

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const ADMIN_USERNAME = "admin";
  const ADMIN_PASSWORD = "admin123";
  const USER_USERNAME = "user";
  const USER_PASSWORD = "user123";

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ username, role: "admin" }, config.jwtSecret, {
      expiresIn: "1h",
    });
    return res.json({ token });
  }

  if (username === USER_USERNAME && password === USER_PASSWORD) {
    const token = jwt.sign({ username, role: "user" }, config.jwtSecret, {
      expiresIn: "1h",
    });
    return res.json({ token });
  }

  res.status(401).json({ error: "Identifiants invalides" });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Route non trouvée" });
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Erreur interne du serveur" });
});

// ✅ Connexion MongoDB et lancement serveur
connectDB()
  .then(() => seedPokemons())
  .then(() => {
    app.listen(config.port, () => {
      console.log(
        `✅ API Pokémon en ligne – environnement Render, port ${config.port}`
      );
    });
  })

  .catch((error) => {
    console.error("❌ Impossible de démarrer l'API :", error.message);
    process.exit(1);
  });
