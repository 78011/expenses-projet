# Fullstack Expenses - Gestionnaire de Dépenses

Application web fullstack de gestion des dépenses personnelles, avec un backend Django REST API et un frontend React TypeScript.

---

## Apercu

L'application permet de suivre ses revenus et dépenses via une interface moderne. Elle calcule automatiquement le solde total, le total des revenus, le total des dépenses ainsi que le ratio dépenses/revenus.

---

## Stack Technique

| Couche | Technologie | Version |
|--------|-------------|---------|
| Backend | Django + Django REST Framework | 5.2.12 / 3.17.1 |
| Frontend | React + TypeScript | 19.2.4 / ~5.9.3 |
| Build tool | Vite | 8.0.1 |
| CSS | Tailwind CSS + DaisyUI | 4.2.2 / 5.5.19 |
| HTTP client | Axios | 1.14.0 |
| Base de données | SQLite3 | - |
| Icones | Lucide React | 1.3.0 |
| Notifications | React Hot Toast | 2.6.0 |

---

## Structure du Projet

```
fullstack-expenses/
├── backend/
│   ├── api/                        # Application Django REST
│   │   ├── migrations/             # Migrations base de données
│   │   ├── models.py               # Modèle Transaction
│   │   ├── serializers.py          # Sérialiseur DRF
│   │   ├── views.py                # Vues API (ListCreate + CRUD)
│   │   ├── urls.py                 # Routes API
│   │   └── test.rest               # Fichier de tests API (REST Client)
│   ├── baclend/                    # Configuration Django
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── db.sqlite3                  # Base de données SQLite
│   └── manage.py
└── frontend/
    ├── src/
    │   ├── App.tsx                 # Composant principal (CRUD + UI)
    │   ├── api.ts                  # Client Axios configuré
    │   ├── main.tsx                # Point d'entrée React
    │   └── index.css               # Styles Tailwind
    ├── .env                        # Variables d'environnement
    ├── vite.config.ts
    ├── tsconfig.json
    └── package.json
```

---

## Backend

### Modele de données

```python
class Transaction(models.Model):
    id         = UUIDField(primary_key=True, auto-généré)
    text       = CharField(max_length=255)        # Description
    amount     = DecimalField(max_digits=10, decimal_places=2)  # Positif = revenu, Négatif = dépense
    created_at = DateTimeField(auto_now_add=True)
```

### Endpoints API

| Méthode | URL | Description |
|---------|-----|-------------|
| `GET` | `/api/transactions/` | Lister toutes les transactions |
| `POST` | `/api/transactions/` | Créer une transaction |
| `GET` | `/api/transactions/<uuid>/` | Détail d'une transaction |
| `PUT` | `/api/transactions/<uuid>/` | Modifier entièrement |
| `PATCH` | `/api/transactions/<uuid>/` | Modifier partiellement |
| `DELETE` | `/api/transactions/<uuid>/` | Supprimer |

### Exemple de payload

```json
{
  "text": "Salaire du mois",
  "amount": "2500.00"
}
```

---

## Frontend

### Fonctionnalités

- **Tableau de bord** : solde total, revenus, dépenses, ratio dépenses/revenus (barre de progression)
- **Tableau des transactions** : liste paginée avec date de création
- **CRUD complet** : ajout, modification (pré-remplissage du formulaire), suppression avec confirmation
- **Notifications** : retours visuels via `react-hot-toast`
- **Thème sombre** : DaisyUI "night"

### Architecture Frontend

```
App.tsx
├── État local (useState): transactions, text, amount, editingId, loading
├── Effets (useEffect): chargement initial des transactions
├── Calculs: balance, income, expenses, expenseRatio
└── Composants UI (inline):
    ├── Dashboard (solde + stats)
    ├── Barre de ratio dépenses/revenus
    ├── Tableau de transactions
    └── Modal (ajout / modification)
```

### Client API (`src/api.ts`)

```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/",
});
```

---

## Installation et Lancement

### Prérequis

- Python 3.10+
- Node.js 18+
- npm

---

### Backend

```bash
cd backend

# Créer et activer l'environnement virtuel
python -m venv env
source env/Scripts/activate        # Windows
# source env/bin/activate          # Linux/Mac

# Installer les dépendances
pip install django djangorestframework django-cors-headers

# Appliquer les migrations
python manage.py migrate

# Lancer le serveur
python manage.py runserver
# -> http://localhost:8000
```

---

### Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
# -> http://localhost:5173
```

---

### Variables d'environnement Frontend

Le fichier `frontend/.env` contient :

```env
VITE_API_URL=http://localhost:8000/
```

---

## Points d'attention pour la Production

| Point | Etat actuel | Action recommandée |
|-------|-------------|---------------------|
| `DEBUG` | `True` | Passer à `False` |
| `SECRET_KEY` | Valeur en dur | Utiliser une variable d'environnement |
| `ALLOWED_HOSTS` | `[]` (vide) | Restreindre aux domaines autorisés |
| Base de données | SQLite3 | Migrer vers PostgreSQL |
| Authentification | Aucune | Ajouter JWT ou session auth |
| CORS | localhost seulement | Configurer le domaine de production |

---

## Tests API

Un fichier `backend/api/test.rest` est fourni, compatible avec l'extension **REST Client** de VS Code.

```http
### Créer une transaction
POST http://localhost:8000/api/transactions/
Content-Type: application/json

{
  "text": "Courses alimentaires",
  "amount": -85.50
}

### Lister les transactions
GET http://localhost:8000/api/transactions/
```

---

## Auteur
Ousmane DIONE Developpeur Full Stack **ouse4481@gmail.com**<br/>
Projet de gestion des dépenses - Django + React TSX
