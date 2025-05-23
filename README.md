# API Pokémon

Une API RESTful pour gérer une collection de Pokémon avec authentification et autorisation.

## Fonctionnalités

- Authentification JWT
- Gestion des rôles (admin/user)
- CRUD complet pour les Pokémon
- Interface utilisateur web

## Structure du projet

```
mon-api-pokemon/
├── server.js           # Serveur Express
├── package.json        # Dépendances
├── data/              # Base de données JSON
└── public/            # Interface utilisateur
    ├── client.js      # API Client
    ├── index.html     # Page d'accueil
    └── login.html     # Page de connexion
```

## Installation

1. Installer les dépendances :

```bash
npm install
```

2. Démarrer le serveur :

```bash
node server.js
```

## Utilisation

### Comptes disponibles

- Admin : username="admin", password="pikachu123"
- User : username="sacha", password="pikachu"

### Endpoints API

- `POST /login` - Connexion
- `GET /pokemons` - Liste des Pokémon
- `POST /pokemons` - Créer un Pokémon
- `PUT /pokemons/:id` - Modifier un Pokémon
- `DELETE /pokemons/:id` - Supprimer un Pokémon (admin uniquement)

## Sécurité

- Authentification par token JWT
- Validation des données
- Protection contre les injections
- Gestion des rôles
#   A P I - P o k - m o n s  
 