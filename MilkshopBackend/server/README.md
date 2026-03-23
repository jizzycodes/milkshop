## Milkshop Backend Server

This folder contains the Express backend for the Milkshop brand site.

### Structure

- `config/` – database connection and configuration.
- `constants/` – single source of truth for lead CRM (stage, status, contact type, outcome).
- `controllers/` – request handlers containing business logic.
- `routes/` – Express routers that map URLs to controllers.
- `models/` – database access helpers (franchise_requests, franchise_leads, lead_contact_logs, admin).
- `middleware/` – reusable Express middleware (logging, errors, auth).
- `utils/` – small utility helpers (environment loading, JWT).
- `db/` – migrations and migration runner for franchise_leads CRM.
- `server.js` – application entrypoint.

### Phase 2 – Lead CRM (admin only)

- **Rule 1 (past due):** On `GET /api/admin/leads`, leads with `next_followup_at < now()` and status not DROPPED/ARCHIVED are auto-set to `FOR_FOLLOWUP`.
- **Rule 2 (contact log):** `POST /api/admin/leads/:id/contact-logs` updates the lead’s `last_contacted_at`, increments `followup_count`, and sets `next_followup_at` from the request body.
- **Rule 3 (stage):** Stage is updated only by managers via `PATCH /api/admin/leads/:id/stage` or `PATCH /api/admin/leads/:id`.

Endpoints: `GET/PATCH /api/admin/leads`, `GET/PATCH /api/admin/leads/:id`, `GET/POST /api/admin/leads/:id/contact-logs`.

### Phase 3 – Dashboard tabs (filter only, no extra tables)

`GET /api/admin/leads?tab=<tab>` – each tab is a simple filter on `franchise_leads`:

| Tab            | Filter                         | Order                 |
|----------------|--------------------------------|------------------------|
| `all`          | none                           | updated_at DESC       |
| `new`          | status = NEW                   | updated_at DESC       |
| `active`       | status = ACTIVE                | updated_at DESC       |
| `for_follow_up`| status = FOR_FOLLOWUP          | next_followup_at ASC   |
| `orientation`  | stage = ORIENTATION            | updated_at DESC       |
| `onboarding`   | stage = ONBOARDING             | updated_at DESC       |
| `dropped`      | status = DROPPED               | updated_at DESC       |
| `archived`     | status = ARCHIVED              | updated_at DESC       |

Pagination and search still apply: `page`, `pageSize`, `search`, `from`, `to`.

### Environment variables

At minimum configure:

- `PORT` – HTTP port (defaults to `4000`).
- `DATABASE_URL` – full PostgreSQL connection string _or_:
  - `DB_HOST`
  - `DB_PORT`
  - `DB_USER`
  - `DB_PASSWORD`
  - `DB_NAME` (defaults to `milkshop_backend`).
- `GMAIL_USER` – Gmail address used to send franchise confirmation emails.
- `GMAIL_APP_PASSWORD` – [Gmail App Password](https://support.google.com/accounts/answer/185833) for that account (not your normal password). If unset, franchise form still works but no email is sent.
- `FRONTEND_PUBLIC_LOGO_URL` (optional) – logo URL in HTML confirmation emails.

### App settings (Qr & Email)

Global key/value table `app_settings` (migration **006**):

- `franchise_qr_url` – URL encoded in QR materials (default seeded in migration).
- `franchise_confirmation_email_template` – plain-text body for `sendFranchiseConfirmation`; use the literal text `(name)` where the recipient’s name goes. If empty, the server uses a built-in default.

Admin API (requires `Authorization: Bearer <admin JWT>`):

- `GET /api/admin/settings/qr-email` → `{ success, data: { qrUrl, emailTemplate } }`
- `PUT /api/admin/settings/qr-email` → body `{ qrUrl?, emailTemplate? }` → same shape.

### Account settings (roles: admin/user)

Migration **007** adds `user_accounts` and role-based login.

- Roles: `admin`, `user`.
- Login stays on `POST /api/admin/login` for both roles.
- Admin endpoints (JWT required):
  - `GET /api/admin/settings/account/me`
  - `PUT /api/admin/settings/account/me`
  - `GET /api/admin/settings/account/accounts` (admin only)
  - `POST /api/admin/settings/account/accounts` (admin only)
  - `PUT /api/admin/settings/account/accounts/:id` (admin only)

### Website tracking + monitor

Migration **008** adds `website_tracking_events`.

- Public tracking endpoint:
  - `POST /api/track/events` (batched website events).
- Admin monitor endpoints (admin role only):
  - `GET /api/admin/monitor/summary?days=14` (totals, top sections, daily trend, top menu clicks).
  - `DELETE /api/admin/monitor/metrics` — clears all rows in `website_tracking_events` (Monitor resets to zero).

