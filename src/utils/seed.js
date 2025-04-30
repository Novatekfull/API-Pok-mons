// src/utils/seed.js

const Pokemon = require("../models/Pokemon");

const seedPokemons = async () => {
  try {
    const count = await Pokemon.countDocuments();
    if (count > 0) {
      console.log("⚡ Pokémon déjà existants, pas de seed nécessaire");
      return;
    }

    const pokemons = [
      {
        name: "Bulbizarre",
        type: "Plante",
        image:
          "https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png",
      },
      {
        name: "Salamèche",
        type: "Feu",
        image:
          "https://assets.pokemon.com/assets/cms2/img/pokedex/full/004.png",
      },
      {
        name: "Carapuce",
        type: "Eau",
        image:
          "https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png",
      },
      {
        name: "Pikachu",
        type: "Électrik",
        image:
          "https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png",
      },
      {
        name: "Rondoudou",
        type: "Fée",
        image:
          "https://assets.pokemon.com/assets/cms2/img/pokedex/full/039.png",
      },
    ];

    await Pokemon.insertMany(pokemons);
    console.log("✅ Pokémons insérés avec succès");
  } catch (error) {
    console.error("❌ Erreur lors du seed :", error.message);
    // Ne pas crasher l'API si seed échoue, juste afficher l'erreur
  }
};

module.exports = seedPokemons;
