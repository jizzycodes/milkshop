## Quick Docker Deploy (Debian)

This deploy flow is built for your backend-only Docker setup.

### 1) One-time setup on server

```bash
cd /path/to/MilkshopBackend
cp .env.example .env
nano .env
```

Set correct DB values in `.env` (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, etc.).

### 2) Deploy command (build + migrate + restart)

```bash
cd /path/to/MilkshopBackend
chmod +x deploy/deploy-docker.sh
./deploy/deploy-docker.sh
```

### 3) Optional custom container/image names

```bash
APP_NAME=milkshop-backend IMAGE_NAME=milkshop-backend:latest PORT_MAP=4000:4000 ./deploy/deploy-docker.sh
```

### 4) Verify

```bash
docker ps --filter "name=milkshop-backend"
docker logs -f milkshop-backend
```

### Notes

- Script is safe to re-run.
- It always runs migration before starting the app container.
- If you use reverse proxy only, keep `PORT_MAP` internal as needed.
