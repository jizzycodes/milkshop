# Milkshop — Beginner Deployment Notes (Linode)

This repo contains:

- **`MilkshopFrontend/`**: React + Vite static site (served by **Nginx**).
- **`MilkshopBackend/`**: Node/Express API + PostgreSQL (Neon) + Firebase Admin auth (run by **PM2**).

Below are the exact notes from our deployment troubleshooting.

## What “deployed” means

- Your site is public when it’s reachable via **Linode public IP / domain** and your server allows traffic on **port 80 (HTTP)** and/or **443 (HTTPS)**.
- Browsers on other networks must be able to reach `http://<public-ip>` (or your domain).

## One-time setup (Linode)

### 1) SSH into Linode (Windows CMD)

```bat
ssh root@YOUR_LINODE_IP
```

### 2) Install essentials

```sh
apt update && apt -y upgrade
apt -y install nginx git curl
curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
apt -y install nodejs
node -v
npm -v
```

### 3) Clone repo

```sh
mkdir -p /var/www
cd /var/www
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git milkshop
```

## Backend (API) setup

### 1) Create backend `.env`

Backend reads:

- `/var/www/milkshop/MilkshopBackend/.env`

Create/edit:

```sh
cd /var/www/milkshop/MilkshopBackend
nano .env
```

Minimum working config (example; use your real values):

```env
PORT=4000

# App runtime can use DATABASE_URL (Neon, etc.)
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DB?sslmode=require
DB_SSL=true

# IMPORTANT: migrations use DB_* (not DATABASE_URL)
DB_HOST=HOST
DB_PORT=5432
DB_USER=USER
DB_PASSWORD=PASSWORD
DB_NAME=milkshop_backend

# Use your frontend URL (or * while testing)
CORS_ORIGIN=*

# Firebase Admin (required for /api/admin/*)
FIREBASE_PROJECT_ID=milkshoplogin
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
```

### 2) Create `firebase-service-account.json` on Linode

File must exist at:

- `/var/www/milkshop/MilkshopBackend/firebase-service-account.json`

Create:

```sh
cd /var/www/milkshop/MilkshopBackend
nano firebase-service-account.json
chmod 600 firebase-service-account.json
ls -la firebase-service-account.json
```

### 3) Install deps + run migrations + start

```sh
cd /var/www/milkshop/MilkshopBackend
npm install
node server/db/run-migration.js
npm start
```

Health check (from the Linode):

```sh
curl -i http://127.0.0.1:4000/api/health
```

## Run backend forever (PM2)

One-time:

```sh
npm i -g pm2
cd /var/www/milkshop/MilkshopBackend
pm2 start npm --name milkshop-backend -- start
pm2 save
pm2 startup
```

After `pm2 startup`, run the command PM2 prints, then:

```sh
pm2 save
```

Daily commands:

```sh
pm2 status
pm2 logs milkshop-backend --lines 200
pm2 restart all
```

## Frontend (Vite) setup

### 1) Configure Vite env and build

On Linode:

```sh
cd /var/www/milkshop/MilkshopFrontend
nano .env.production
```

Set at minimum:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...

# Recommended (use Nginx proxy below)
VITE_API_BASE_URL=http://YOUR_LINODE_IP
```

Build:

```sh
npm install
npm run build
```

### 2) Nginx config (serve SPA + proxy /api)

Edit:

```sh
nano /etc/nginx/sites-available/milkshop
```

Example (important parts: `location /api/` and SPA `try_files`):

```nginx
server {
  listen 80;
  server_name YOUR_LINODE_IP;

  root /var/www/milkshop/MilkshopFrontend/dist;
  index index.html;

  location /api/ {
    proxy_pass http://127.0.0.1:4000/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

Enable site:

```sh
ln -s /etc/nginx/sites-available/milkshop /etc/nginx/sites-enabled/milkshop
nginx -t
systemctl reload nginx
```

Verify proxy works (must return JSON):

```sh
curl -i http://YOUR_LINODE_IP/api/health
```

## Errors we hit (and fixes)

### 1) `supabaseUrl is required`

Cause: frontend built without `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`.

Fix: set them in `.env.production` **before** `npm run build`, then rebuild.

### 2) `ERR_CONNECTION_REFUSED` calling `localhost:4000`

Cause: `VITE_API_BASE_URL` was `http://localhost:4000`. In production, users’ browsers treat `localhost` as **their own PC**.

Fix: set `VITE_API_BASE_URL` to your Linode host OR use Nginx `/api` proxy.

### 3) Leads page crash: `Cannot read properties of null (reading 'data')`

Cause: request to `/api/...` returned **HTML** (the SPA `index.html`) instead of JSON because Nginx was not proxying `/api`.

Proof we saw:

- `curl http://127.0.0.1:4000/api/health` → JSON ✅
- `curl http://<ip>/api/health` → HTML ❌

Fix: add the `location /api/ { proxy_pass ... }` block and reload Nginx.

### 4) “Works on my network but not other networks”

Common causes:

- firewall blocks **80/443**
- Linode Cloud Firewall blocks **80/443**

Check on Linode:

```sh
ss -lntp | rg ":80|:443|nginx"
ufw status verbose
```

If UFW is on, allow HTTP/HTTPS:

```sh
ufw allow 80/tcp
ufw allow 443/tcp
ufw reload
```

## Update / Deploy when you push new changes (GitHub → Linode)

### Backend update

```sh
cd /var/www/milkshop
git pull
cd MilkshopBackend
npm install
node server/db/run-migration.js
pm2 restart all
```

### Frontend update

```sh
cd /var/www/milkshop
git pull
cd MilkshopFrontend
npm install
npm run build
systemctl reload nginx
```

## Quick “is everything healthy?” checklist

On Linode:

```sh
curl -i http://127.0.0.1:4000/api/health
curl -i http://YOUR_LINODE_IP/api/health
pm2 status
systemctl status nginx --no-pager
```
