const { body } = require("express-validator");

const validPokemonTypes = [
  "Normal",
  "Feu",
  "Eau",
  "Plante",
  "Électrik",
  "Glace",
  "Combat",
  "Poison",
  "Sol",
  "Vol",
  "Psy",
  "Insecte",
  "Roche",
  "Spectre",
  "Dragon",
  "Ténèbres",
  "Acier",
  "Fée",
];

const pokemonValidationRules = {
  create: [
    body("name")
      .isString()
      .isLength({ min: 2 })
      .withMessage("Le nom doit faire au moins 2 caractères."),
    body("type")
      .isString()
      .notEmpty()
      .withMessage("Le type est obligatoire.")
      .isIn(validPokemonTypes)
      .withMessage("Le type doit être un type de Pokémon valide."),
    body("image").isURL().withMessage("L'URL de l'image doit être valide."),
  ],
  update: [
    body("name")
      .optional()
      .isString()
      .isLength({ min: 2 })
      .withMessage("Le nom doit faire au moins 2 caractères."),
    body("type")
      .optional()
      .isString()
      .notEmpty()
      .isIn(validPokemonTypes)
      .withMessage("Le type doit être un type de Pokémon valide."),
    body("image")
      .optional()
      .isURL()
      .withMessage("L'URL de l'image doit être valide."),
  ],
};

module.exports = {
  pokemonValidationRules,
  validPokemonTypes,
};
