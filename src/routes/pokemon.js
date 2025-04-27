const express = require("express");
const router = express.Router();
const { validationResult } = require("express-validator");
const { authenticateToken, authorizeRole } = require("../middleware/auth");
const pokemonController = require("../controllers/pokemon");
const { pokemonValidationRules } = require("../validators/pokemon");

// Routes protégées avec authentification
router.get("/", authenticateToken, pokemonController.getAllPokemons);
router.get("/:id", authenticateToken, pokemonController.getPokemonById);

// Routes protégées avec authentification et validation
router.post(
  "/",
  authenticateToken,
  pokemonValidationRules.create,
  pokemonController.createPokemon
);

router.put(
  "/:id",
  authenticateToken,
  pokemonValidationRules.update,
  pokemonController.updatePokemon
);

// Route protégée avec authentification et autorisation admin
router.delete(
  "/:id",
  authenticateToken,
  authorizeRole("admin"),
  pokemonController.deletePokemon
);

module.exports = router;
