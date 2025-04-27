require("dotenv").config();

module.exports = {
  server: {
    port: process.env.PORT || 3001,
    env: process.env.NODE_ENV || "development",
  },
  security: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN,
    corsOrigin: process.env.CORS_ORIGIN,
  },
  database: {
    path: process.env.DB_PATH || "./data/pokemons.json",
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS),
  },
  logging: {
    level: process.env.LOG_LEVEL || "info",
    file: process.env.LOG_FILE || "./logs/app.log",
  },
  defaultAccounts: {
    admin: {
      username: process.env.DEFAULT_ADMIN_USERNAME,
      password: process.env.DEFAULT_ADMIN_PASSWORD,
    },
    user: {
      username: process.env.DEFAULT_USER_USERNAME,
      password: process.env.DEFAULT_USER_PASSWORD,
    },
  },
};
