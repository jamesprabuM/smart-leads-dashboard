# Smart Leads Dashboard

A full-stack lead management app: React + Vite frontend, Express + MongoDB API, JWT auth, and role-based access (`admin` / `sales`).

## Live deployment

| Service   | URL (update after deploy)        |
|-----------|----------------------------------|
| Frontend  | `https://YOUR-APP.vercel.app`    |
| API       | `https://YOUR-API.onrender.com`  |
| Health    | `https://YOUR-API.onrender.com/api/health` |

See [Deploy to production](#deploy-to-production) below.

## Prerequisites

- Node.js 18+ (20+ recommended)
- npm
- MongoDB (local install or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free tier)
- GitHub account (for hosted deploy)
- [Render](https://render.com) account (API) and [Vercel](https://vercel.com) account (frontend)

## Quick start (local)

```bash
# 1. Environment
cp .env.example server/.env
grep -E '^(PORT|MONGODB|JWT|CLIENT)' .env.example >> server/.env 2>/dev/null || true
echo 'VITE_API_URL=http://localhost:5001/api' > client/.env

# 2. Install
cd server && npm install
cd ../client && npm install

# 3. MongoDB — local
# macOS (Homebrew): brew services start mongodb-community
# Or use Atlas URI in server/.env → MONGODB_URI=mongodb+srv://...

# 4. Run (two terminals)
cd server && npm run dev    # http://localhost:5001
cd client && npm run dev    # http://localhost:5173
```

Register a user at `/register`, then use the dashboard to create and filter leads.

### Environment reference

All variables and inline API docs live in [`.env.example`](.env.example).

| Variable        | Where        | Description                          |
|-----------------|--------------|--------------------------------------|
| `PORT`          | server       | API port (default `5001`)            |
| `MONGODB_URI`   | server       | MongoDB connection string            |
| `JWT_SECRET`    | server       | Secret for signing tokens            |
| `JWT_EXPIRES_IN`| server       | Token lifetime (e.g. `7d`)           |
| `CLIENT_URL`    | server       | Frontend origin for CORS             |
| `VITE_API_URL`  | client       | API base URL (must end with `/api`)  |

## Project structure

```
smart-leads-dashboard/
├── client/          # React + Vite + Tailwind
├── server/          # Express + Mongoose API
├── .env.example     # Env template + API documentation
├── render.yaml      # Render backend deploy config
└── vercel.json      # Vercel frontend deploy config
```

## API overview

Base URL: `http://localhost:5001/api` (local) or your Render URL + `/api`.

| Method | Endpoint           | Auth     | Description              |
|--------|--------------------|----------|--------------------------|
| GET    | `/health`          | Public   | Health check             |
| POST   | `/auth/register`   | Public   | Create account           |
| POST   | `/auth/login`      | Public   | Get JWT                  |
| GET    | `/auth/me`         | Bearer   | Current user             |
| GET    | `/leads`           | Bearer   | List leads (paginated)   |
| GET    | `/leads/export`    | Bearer   | Export CSV               |
| GET    | `/leads/:id`       | Bearer   | Single lead              |
| POST   | `/leads`           | Bearer   | Create lead              |
| PUT    | `/leads/:id`       | Bearer   | Update lead              |
| DELETE | `/leads/:id`       | Admin    | Delete lead              |

Full request/response details: [`.env.example`](.env.example).

## Deploy to production

End-to-end: **MongoDB Atlas → Render (API) → Vercel (UI)**.

### 1. MongoDB Atlas

1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com).
2. **Database Access** → add a database user (username + password).
3. **Network Access** → allow `0.0.0.0/0` (or Render’s IPs) for development.
4. **Connect** → Drivers → copy the connection string.
5. Replace `<password>` and set database name, e.g.  
   `mongodb+srv://user:pass@cluster.mongodb.net/smart-leads?retryWrites=true&w=majority`

### 2. Push code to GitHub

```bash
cd smart-leads-dashboard
git init
git add .
git commit -m "Initial commit: Smart Leads Dashboard"
gh repo create smart-leads-dashboard --public --source=. --push
```

(Or create a repo on GitHub and `git remote add origin` + `git push`.)

### 3. Deploy API on Render

1. [dashboard.render.com](https://dashboard.render.com) → **New** → **Blueprint** (or **Web Service**).
2. Connect your GitHub repo.
3. If using **Blueprint**, Render reads [`render.yaml`](render.yaml) (`rootDir: server`).
4. Set environment variables in Render:

   | Key            | Value                                      |
   |----------------|--------------------------------------------|
   | `MONGODB_URI`  | Your Atlas connection string               |
   | `JWT_SECRET`   | Long random string (32+ characters)        |
   | `JWT_EXPIRES_IN` | `7d`                                   |
   | `CLIENT_URL`   | `https://YOUR-APP.vercel.app` (after step 4)|

5. Deploy and note the URL, e.g. `https://smart-leads-api.onrender.com`.
6. Verify: `curl https://YOUR-API.onrender.com/api/health`

### 4. Deploy frontend on Vercel

1. [vercel.com/new](https://vercel.com/new) → import the same GitHub repo.
2. **Root Directory**: `client`
3. **Environment variable**:

   | Name             | Value                              |
   |------------------|------------------------------------|
   | `VITE_API_URL`   | `https://YOUR-API.onrender.com/api`|

4. Deploy. Copy the Vercel URL (e.g. `https://smart-leads-dashboard.vercel.app`).

### 5. Finish CORS

In Render, set `CLIENT_URL` to your exact Vercel URL (no trailing slash), then **Manual Deploy** → redeploy the API.

Update [`.env.example`](.env.example) deployment link comments and the table at the top of this README with your live URLs.

## Docker (full stack on your machine)

Runs MongoDB, API, and UI together — good for a one-command local “deploy”:

```bash
docker compose up --build -d
```

| Service  | URL                          |
|----------|------------------------------|
| App (UI) | http://localhost             |
| API      | http://localhost/api/health  |

MongoDB and the API run only on the Docker network (no host ports for 27017/5000), so this works alongside a local MongoDB or dev server.

Stop: `docker compose down`

The client image proxies `/api` to the server (see `client/nginx.conf`). No `VITE_API_URL` needed for this path.

## Production build (self-hosted)

```bash
cd server && npm run build && npm start
cd client && npm run build
# Serve client/dist with any static host; point VITE_API_URL at your API.
```

## Scripts

| Location | Command        | Description        |
|----------|----------------|--------------------|
| server   | `npm run dev`  | Dev API with hot reload |
| server   | `npm run build`| Compile TypeScript |
| server   | `npm start`    | Run production API |
| client   | `npm run dev`  | Vite dev server    |
| client   | `npm run build`| Production bundle  |

## Troubleshooting

- **CORS errors**: `CLIENT_URL` on the server must match the browser origin exactly (scheme + host + port).
- **401 on all leads**: Log in again; token is stored in `localStorage`.
- **MongoDB connection failed**: Check Atlas IP allowlist and URI encoding for special characters in passwords.
- **Render cold start**: Free tier sleeps after inactivity; first request may take ~30s.

## License

Private / MIT — adjust as needed for your use.
