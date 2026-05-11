# Light Pollution Visualizer

Application de visualisation de la pollution lumineuse mondiale, composée d'un frontend Angular et d'un backend Express/MongoDB.

## Prérequis

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- Une instance [MongoDB](https://www.mongodb.com/) accessible (locale ou cloud)

## Installation

Cloner le dépôt puis installer toutes les dépendances depuis la racine :

```bash
git clone <url-du-repo>
cd app_module165
npm install
```

## Configuration

Créer un fichier `.env` à la racine du projet :

```env
MONGO_URI=mongodb://localhost:27017/i165
PORT=3000
```

| Variable    | Description                              | Valeur par défaut               |
|-------------|------------------------------------------|---------------------------------|
| `MONGO_URI` | URI de connexion MongoDB                 | `mongodb://localhost:27017/i165` |
| `PORT`      | Port d'écoute du serveur backend         | `3000`                           |

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
