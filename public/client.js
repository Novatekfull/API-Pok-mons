// Configuration de l'API
const API_URL = ""; // URL relative car le serveur sert les fichiers statiques

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
  try {
    const response = await fetch("http://localhost:3001/pokemons", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.status === 401 || response.status === 403) {
      logout();
      return;
    }

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des Pokémon");
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur:", error);
    throw error;
  }
}

async function getPokemon(id) {
  try {
    const response = await fetch(`${API_URL}/pokemons/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Pokémon non trouvé");
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur:", error);
    throw error;
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
  getPokemon,
  createPokemon,
  updatePokemon,
  deletePokemon,
  isAuthenticated,
  getToken,
};
