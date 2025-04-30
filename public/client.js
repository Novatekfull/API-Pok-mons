// Configuration de l'API
const API_URL = "https://ton-api.onrender.com"; // URL relative car le serveur sert les fichiers statiques

// Fonctions d'authentification
async function login(username, password) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error("Identifiants invalides");
    }

    const data = await response.json();
    localStorage.setItem("token", data.token);
    return data;
  } catch (error) {
    console.error("Erreur de connexion:", error);
    throw error;
  }
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

// Fonctions CRUD pour les Pokémon
async function getPokemons() {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch("http://localhost:3001/pokemons", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();

    if (Array.isArray(result.data)) {
      return result.data; // ✅ Important
    } else {
      console.error("❌ Mauvais format de données :", result);
      return [];
    }
  } catch (err) {
    console.error("❌ Erreur dans getPokemons :", err.message);
    return [];
  }
}

async function createPokemon(name, type) {
  try {
    const response = await fetch(`${API_URL}/pokemons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ name, type }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.errors?.[0]?.msg || "Erreur lors de la création"
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur:", error);
    throw error;
  }
}

async function updatePokemon(id, name, type) {
  try {
    const response = await fetch(`${API_URL}/pokemons/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ name, type }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.errors?.[0]?.msg || "Erreur lors de la mise à jour"
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur:", error);
    throw error;
  }
}

async function deletePokemon(id) {
  try {
    const response = await fetch(`${API_URL}/pokemons/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la suppression");
    }

    return true;
  } catch (error) {
    console.error("Erreur:", error);
    throw error;
  }
}

// Fonctions utilitaires
function isAuthenticated() {
  return !!localStorage.getItem("token");
}

function getToken() {
  return localStorage.getItem("token");
}

// Export des fonctions
window.api = {
  login,
  logout,
  getPokemons,
  createPokemon,
  updatePokemon,
  deletePokemon,
  isAuthenticated,
  getToken,
};
