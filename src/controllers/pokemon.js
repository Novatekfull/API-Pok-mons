const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const db = require("../utils/db");

// Récupérer tous les Pokémon
exports.getAllPokemons = (req, res) => {
  try {
    const pokemons = db.readDB();
    res.json(pokemons);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des Pokémon" });
  }
};

// Récupérer un Pokémon par son ID
exports.getPokemonById = (req, res) => {
  try {
    const pokemons = db.readDB();
    const found = pokemons.find((p) => p.id === req.params.id);
    if (found) {
      res.json(found);
    } else {
      res.status(404).json({ error: "Pokémon introuvable" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération du Pokémon" });
  }
};

// Créer un nouveau Pokémon
exports.createPokemon = (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, type } = req.body;
    const pokemons = db.readDB();

    // 🔥 Vérifier l'existence d'un doublon de nom (insensible à la casse)
    const nameExists = pokemons.some(
      (p) => p.name.toLowerCase() === name.toLowerCase()
    );
    if (nameExists) {
      return res.status(409).json({ error: "Un Pokémon avec ce nom existe déjà." });
    }

    const newPokemon = {
      id: uuidv4(),
      name,
      type,
    };
    pokemons.push(newPokemon);
    db.writeDB(pokemons);
    res.status(201).json(newPokemon);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création du Pokémon" });
  }
};


// Mettre à jour un Pokémon
exports.updatePokemon = (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const pokemons = db.readDB();
    const index = pokemons.findIndex((p) => p.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: "Pokémon introuvable" });
    }

    const { name, type } = req.body;

    // 🔥 Vérifier si on tente de changer le nom vers un nom déjà utilisé par un autre Pokémon
    const nameExists = pokemons.some(
      (p) =>
        p.id !== req.params.id && // ne pas se comparer soi-même !
        p.name.toLowerCase() === name.toLowerCase()
    );
    if (nameExists) {
      return res.status(409).json({ error: "Un autre Pokémon possède déjà ce nom." });
    }

    // ✅ Mise à jour autorisée
    pokemons[index] = { id: req.params.id, name, type };
    db.writeDB(pokemons);
    res.json(pokemons[index]);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour du Pokémon" });
  }
};

// Supprimer un Pokémon
exports.deletePokemon = (req, res) => {
  try {
    let pokemons = db.readDB();
    pokemons = pokemons.filter((p) => p.id !== req.params.id);
    db.writeDB(pokemons);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression du Pokémon" });
  }
};
