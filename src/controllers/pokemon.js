// src/controllers/pokemon.js
const Pokemon = require("../models/Pokemon");

// Récupérer tous les Pokémon avec recherche, tri et pagination
exports.getAllPokemons = async (req, res) => {
  try {
    const { search = "", sort = "name", page = 1, limit = 5 } = req.query;

    const query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { type: { $regex: search, $options: "i" } },
      ],
    };

    const total = await Pokemon.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    const pokemons = await Pokemon.find(query)
      .sort({ [sort]: 1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages,
      data: pokemons,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Récupérer un Pokémon par ID
exports.getPokemonById = async (req, res) => {
  try {
    const pokemon = await Pokemon.findById(req.params.id);
    if (!pokemon) return res.status(404).json({ error: "Pokémon non trouvé" });

    res.json(pokemon);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Créer un nouveau Pokémon
exports.createPokemon = async (req, res) => {
  try {
    const { name, type, image } = req.body;
    const newPokemon = new Pokemon({ name, type, image });
    const saved = await newPokemon.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Erreur lors de la création :", err); // ← ICI
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

// Modifier un Pokémon
exports.updatePokemon = async (req, res) => {
  try {
    const { name, type, image } = req.body;

    const pokemon = await Pokemon.findByIdAndUpdate(
      req.params.id,
      { name, type, image },
      { new: true }
    );

    if (!pokemon) return res.status(404).json({ error: "Pokémon non trouvé" });

    res.json(pokemon);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Supprimer un Pokémon
exports.deletePokemon = async (req, res) => {
  try {
    const pokemon = await Pokemon.findByIdAndDelete(req.params.id);
    if (!pokemon) return res.status(404).json({ error: "Pokémon non trouvé" });

    res.json({ message: "Pokémon supprimé" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
