# Expose Vite to the Internet with ngrok (for Expo / mobile testing)

Use this to get a **public URL** for your local franchise form so phones can open it via QR code.

---

## All terminal commands (quick reference)

### One-time setup

```bash
# 1. Install ngrok globally
npm install -g ngrok

# 2. (Optional) Add authtoken to global config instead of ngrok.yml
ngrok config add-authtoken YOUR_AUTHTOKEN
```

In the project root `Milkshop`, ensure `ngrok.yml` has your **authtoken** at the top level (get it from https://dashboard.ngrok.com/get-started/your-authtoken).

### Every time you want to expose the app

Run these in **separate terminals**. Start each terminal at the repo root (`Milkshop`):

```bash
# Terminal 1 — Backend
cd MilkshopBackend
npm start

# Terminal 2 — Frontend (Vite)
cd MilkshopFrontend
npm run dev -- --host

# Terminal 3 — ngrok (run from repo root Milkshop, where ngrok.yml lives)
ngrok start --all --config=ngrok.yml
```

Then:

1. Copy the **backend** ngrok URL (forwarding port 4000) into `MilkshopFrontend\.env.local` as `VITE_API_BASE_URL=https://...`
2. Restart the frontend (Terminal 2: Ctrl+C, then `npm run dev -- --host` again).
3. Use the **frontend** ngrok URL (forwarding port 5173) on your phone or in the QR code.

---

## Step 1: Install ngrok (already done)

```bash
npm install -g ngrok
```

✅ **Done** — ngrok is installed globally.

---

## Step 2: Start Vite so it listens on the network

In a terminal:

```bash
npm run dev -- --host
```

**Confirm** you see:

- **Local:** http://localhost:5173/
- **Network:** http://172.x.x.x:5173/ (your LAN IP)

Leave this terminal open.

---

## Step 3: Expose both frontend and backend (so form submit works on phone)

The form posts to your **backend** (port 4000). On the phone, "localhost" is the phone, so you must expose the backend too and point the frontend at it.

1. **Start the backend** (in a terminal):
   ```bash
   cd MilkshopBackend
   npm start
   ```
   Leave it running.

2. **Stop any existing ngrok** (Ctrl+C in its terminal, or kill the process).

3. **Start ngrok with two tunnels** (from repo root `Milkshop`):
   ```bash
   ngrok start --all --config=ngrok.yml
   ```
   You’ll see **two** forwarding lines, e.g.:
   - `frontend` → https://xxxx.ngrok-free.app → localhost:5173
   - `backend`  → https://yyyy.ngrok-free.app → localhost:4000

4. **Point the frontend at the backend URL**  
   In `MilkshopFrontend`, create (or edit) `.env.local`:
   ```
   VITE_API_BASE_URL=https://YOUR-BACKEND-NGROK-URL
   ```
   Use the **backend** https URL from step 3 (no trailing slash). Example: `https://yyyy.ngrok-free.app`

5. **Restart Vite** (stop with Ctrl+C, then run again):
   ```bash
   cd MilkshopFrontend
   npm run dev -- --host
   ```

6. Use the **frontend** ngrok URL for the franchise form and QR code (e.g. `https://xxxx.ngrok-free.app/franchise`). Submissions will go to the backend ngrok URL.

---

## Step 4: Franchise form URL

Your public franchise form URL is:

```
https://YOUR-NGROK-URL.ngrok-free.app/franchise
```

Example: `https://abcd-1234-xyz.ngrok-free.app/franchise`

---

## Step 5: Verify on a phone

1. On your phone, open the browser.
2. Go to: `https://YOUR-NGROK-URL.ngrok-free.app/franchise`
3. The first time, ngrok may show a short “Visit Site” warning — tap it and the form should load.

---

## Step 6: Generate a QR code

**Option A — Local QR generator (in this project)**

1. Open in a browser:  
   `http://localhost:5173/qr-generator.html`  
   (after starting the dev server with `npm run dev -- --host`).
2. Paste your full franchise URL:  
   `https://YOUR-NGROK-URL.ngrok-free.app/franchise`
3. The page will show a QR code. Scan it with a phone or save/screenshot for testing.

**Option B — Online**

1. Go to https://www.qr-code-generator.com/ (or any QR generator).
2. Paste: `https://YOUR-NGROK-URL.ngrok-free.app/franchise`
3. Generate and download or screenshot the QR.

---

## Summary

| Item              | Value |
|-------------------|--------|
| Local app         | http://localhost:5173 |
| Franchise form    | http://localhost:5173/franchise |
| Public URL        | `https://YOUR-NGROK-URL.ngrok-free.app` (from ngrok terminal) |
| Public franchise  | `https://YOUR-NGROK-URL.ngrok-free.app/franchise` |
| QR code           | Encode the **public franchise** URL above |

- No backend or app code changes are required — only tunneling localhost.
- The ngrok URL changes each time you restart ngrok (on the free tier), so regenerate the QR if you restart the tunnel.
