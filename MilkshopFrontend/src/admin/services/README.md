# Admin services

## `api.js`

Shared `fetch` helpers for the admin app:

- Admin API (`fetchAdminDashboard`, franchise requests). Sign-in uses Firebase on the login page.
- **Qr & Email:** `fetchQrEmailSettings(token)`, `updateQrEmailSettings(token, { qrUrl, emailTemplate })` → `GET/PUT /api/admin/settings/qr-email`. Email body: use `(name)` for the recipient.

Uses `VITE_API_BASE_URL` (defaults to `http://localhost:4000`).

## `leadService.js`

Lead CRM endpoints (`leads`, contact logs, patches).

## `auth.js`

Token storage for admin session.
