# Light Pollution Visualizer


Application de visualisation de la pollution lumineuse mondiale, composée d'un frontend Angular et d'un backend Express/MongoDB.

## Architecture générale

L’application est structurée en deux parties principales :

- **Frontend** : Angular 21 (TypeScript, SCSS)
	- UI Material Design, gestion d’état par signaux, affichage dynamique des données
- **Backend** : Express.js (Node.js) avec Mongoose (MongoDB)
	- API REST, accès aux données, agrégations
- **Base de données** : MongoDB (local)

**Technologies principales** :
- Angular, TypeScript, SCSS, Material, Express, Node.js, Mongoose, MongoDB

## Fonctionnalités principales

L’application propose trois affichages interactifs des données :

1. **Carte interactive** : Visualisation mondiale de la pollution lumineuse par pays et par année, avec légende couleur et popup d’information.
2. **Tableau** : Synthèse chiffrée des valeurs LimitingMag par pays/année (moyenne, min, max, etc.).
3. **Frise chronologique** : Évolution temporelle de la pollution lumineuse, navigation par années, affichage des tendances.

Chaque vue permet de filtrer par année et d’obtenir des détails sur chaque pays.

## Prérequis

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- Une instance [MongoDB](https://www.mongodb.com/) accessible

## Installation

Cloner le dépôt puis installer toutes les dépendances depuis la racine :

```bash
git clone https://www.github.com/giadv/app_module165.git
cd app_module165
npm install
```

## Configuration

Adaptez le fichier `.env` à la racine du projet si besoin, en fonction de votre configuration MongoDB et du port souhaité pour le backend:

```env
MONGO_URI=mongodb://user:password@localhost:27017/database_name
PORT=3000
```

| Variable    | Description                              | 
|-------------|------------------------------------------|
| `MONGO_URI` | URI de connexion MongoDB                 |
| `PORT`      | Port d'écoute du serveur backend         |

## Lancer le projet

### Développement (frontend + backend simultanément)

```bash
npm start
```

- Frontend Angular : [http://localhost:4200](http://localhost:4200)
- Backend Express  : [http://localhost:3000](http://localhost:3000)

### Lancer séparément

```bash
# Backend uniquement
npm run start:backend

# Frontend uniquement
npm run start:frontend
```

## Structure du projet

```
app_module165/
├── apps/
│   ├── backend/        # API Express + Mongoose
│   │   └── src/
│   │       ├── index.ts
│   │       ├── models/
│   │       └── routes/
│   └── frontend/       # Application Angular
│       └── src/
│           └── app/
│               ├── core/       # Layout, services
│               ├── features/   # Map, Board, Timeline
│               └── shared/     # Modèles partagés
├── .env                # Variables d'environnement (à créer)
└── package.json        # Scripts racine (npm workspaces)
```

## API

| Méthode | Endpoint                | Description                                      |
|---------|-------------------------|--------------------------------------------------|
| GET     | `/api/health`           | Vérifie que le serveur est opérationnel          |
| GET     | `/api/light-pollution`  | Retourne la moyenne de LimitingMag par pays/année |


### GET /api/light-pollution

Comme discuté lors du cours, nous n'avons qu'une seule requête GET pour récupérer les données de pollution lumineuse, qui sont ensuite utilisées dans les différentes vues (carte, tableau, frise). Nous utilisons différentes méthodes d'agrégation MongoDB pour préparer les données :

#### Match

La requête filtre les données pour garder les pays et les années non nulles ainsi que les valeurs positives de LimitingMag.

#### Group

Elle agrège les résultats pour calculer la moyenne de LimitingMag par pays et par année. 

#### Project

Elle fait également une projection pour ne retourner que les champs nécessaires (pays, année, moyenne de LimitingMag).

#### Sort

Elle trie les résultats par pays et par année.
