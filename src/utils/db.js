const fs = require("fs");
const config = require("../config");

// 🔄 Lecture de la base
function readDB() {
  try {
    const data = fs.readFileSync(config.database.path);
    return JSON.parse(data);
  } catch (error) {
    // Si le fichier n'existe pas, retourner un tableau vide
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

// 💾 Écriture de la base
function writeDB(data) {
  // Créer le dossier data s'il n'existe pas
  const dir = config.database.path.split("/").slice(0, -1).join("/");
  if (dir && !fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(config.database.path, JSON.stringify(data, null, 2));
}

module.exports = {
  readDB,
  writeDB,
};
