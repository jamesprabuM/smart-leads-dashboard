# Deploy in 10 minutes (minimal clicks)

Your repo: https://github.com/jamesprabuM/smart-leads-dashboard

## Step 1 — Build MongoDB URI (one password prompt)

In Terminal:

```bash
cd /Users/freeky10/smart-leads-dashboard
chmod +x scripts/atlas-uri.sh
./scripts/atlas-uri.sh
```

Paste your Atlas password when asked. The script prints `MONGODB_URI` and copies it to your clipboard.

> Atlas connection string is read-only on their website — you edit it with this script instead.

---

## Step 2 — Render (API)

1. Open https://dashboard.render.com/select-repo?type=blueprint
2. Connect **smart-leads-dashboard**
3. Paste clipboard into **MONGODB_URI**
4. **CLIENT_URL** → `https://example.com` (temporary)
5. **Apply** → wait for **Live**
6. Copy API URL → test: `https://YOUR-API.onrender.com/api/health`

---

## Step 3 — Vercel (website)

**Option A — Dashboard (easiest)**

1. https://vercel.com/new → import **smart-leads-dashboard**
2. **Root Directory** → `client`
3. Environment variable:
   - `VITE_API_URL` = `https://YOUR-API.onrender.com/api`
4. Deploy → copy site URL

**Option B — GitHub Actions (after one-time setup)**

Add secrets at https://github.com/jamesprabuM/smart-leads-dashboard/settings/secrets/actions

| Secret | Value |
|--------|--------|
| `VERCEL_TOKEN` | From vercel.com/account/tokens |
| `VERCEL_ORG_ID` | Vercel project settings → General |
| `VERCEL_PROJECT_ID` | Same page |
| `VITE_API_URL` | `https://YOUR-API.onrender.com/api` |

Push to `main` → auto-deploys client.

---

## Step 4 — Fix CORS

Render → **smart-leads-api** → **Environment** → set:

```text
CLIENT_URL=https://your-app.vercel.app
```

(no trailing slash) → **Manual Deploy**

---

## Atlas checklist

- [ ] **Network Access** → `0.0.0.0/0` allowed (for Render)
- [ ] Cluster **Active**

---

## Local production test (no cloud)

```bash
docker compose up --build -d
# http://localhost
```
