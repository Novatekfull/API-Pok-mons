const mongoose = require("mongoose");

const PokemonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  image: { type: String, default: "" }, // ← pas un objet !
});

module.exports = mongoose.model("Pokemon", PokemonSchema);
