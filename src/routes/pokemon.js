const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeRole } = require("../middleware/auth");
const pokemonController = require("../controllers/pokemon");
const { pokemonValidationRules } = require("../validators/pokemon");
const validate = require("../middleware/validate");

// ✅ Toutes les routes nécessitent une connexion (admin ou user)
router.get("/", authenticateToken, pokemonController.getAllPokemons);
router.get("/:id", authenticateToken, pokemonController.getPokemonById);

// ✅ Ajouter et Modifier accessible aux user ET admin
router.post(
  "/",
  authenticateToken,
  pokemonValidationRules.create,
  validate,
  pokemonController.createPokemon
);
router.put(
  "/:id",
  authenticateToken,
  pokemonValidationRules.update,
  validate,
  pokemonController.updatePokemon
);

// ✅ Supprimer uniquement réservé aux ADMIN
router.delete(
  "/:id",
  authenticateToken,
  authorizeRole("admin"),
  pokemonController.deletePokemon
);

module.exports = router;
