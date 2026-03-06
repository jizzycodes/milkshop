# Franchise Lead CRM – Spec (Phases 5–8 & Goal)

Internal mini-CRM for Philippine franchise operations: structured pipeline, sales follow-up tracking, scalable architecture. No duplicated tables, no spaghetti logic.

---

## Phase 5 – Frontend Structure (React + Tailwind)

```
frontend/src/
├── admin/
│   ├── pages/
│   │   ├── (existing: AdminDashboard, AdminRequests, AdminLogin)
│   │   ├── LeadsPage.jsx
│   │   └── LeadDetails.jsx
│   ├── components/
│   │   ├── LeadTable.jsx
│   │   ├── StatusBadge.jsx
│   │   ├── StageTabs.jsx
│   │   ├── FollowUpModal.jsx
│   │   └── ContactTimeline.jsx
│   └── services/
│       └── leadService.js
```

- **leadService.js** calls backend: `GET/PATCH /api/admin/leads`, `GET/PATCH /api/admin/leads/:id`, `GET/POST /api/admin/leads/:id/contact-logs`, with `tab`, `page`, `pageSize`, `search`, etc.

---

## Phase 6 – Frontend UI Design Logic

### 1. LeadsPage Layout

- **Top**
  - Search bar
  - Filter dropdown (Status)
  - Filter dropdown (Stage)
  - Assigned filter
- **Middle**
  - **LeadTable** – each row:
    - Name
    - Status badge
    - Stage badge
    - Followup count
    - Next followup date
    - Action button

### 2. LeadDetails Page

- **Sections**
  - Basic info
  - Stage selector dropdown
  - Status selector dropdown
  - Contact history timeline
  - Add Contact button

### 3. Status Colors (Tailwind)

| Status        | Color      |
|---------------|------------|
| NEW           | gray       |
| ACTIVE        | blue       |
| FOR_FOLLOWUP  | yellow     |
| APPROVED      | green      |
| DROPPED       | red        |
| ARCHIVED      | dark gray  |

(INACTIVE: define if needed, e.g. gray or slate.)

---

## Phase 7 – Workflow Logic

- **Stage (pipeline):** REGISTERED → ORIENTATION → ONBOARDING → CLOSED  
  - Manual stage movement only (dropdown on LeadDetails).
- **Status (activity):** NEW, ACTIVE, FOR_FOLLOWUP, DROPPED, ARCHIVED, APPROVED, etc.  
  - Handles activity and past-due (backend auto-sets FOR_FOLLOWUP when past due; Phase 4 will add APPROVED to exclusions).
- **Rule:** Stage = pipeline; Status = activity. No auto-move of stage.

---

## Phase 8 – Professional Features

- **Soft delete only** – no hard delete of leads (backend: consider `deleted_at` or status ARCHIVED/DROPPED).
- **Sorting** – For Follow Up tab: sort by `next_followup_at` ASC (already in backend).
- **Overdue badge** – if `now() > next_followup_at` and status not DROPPED/ARCHIVED, show “Overdue” (or similar) in UI.
- **Contact attempt counter** – visible (e.g. in LeadTable and LeadDetails; backend has `followup_count`).
- **Assigned manager filter** – filter by `assigned_to` (backend supports `assigned_to` on lead; add filter param if needed).

---

## Final Goal

- **Internal mini-CRM** for franchise leads.
- **Structured pipeline** (stage) + **sales follow-up tracking** (status, contact logs, next_followup_at).
- **Scalable architecture** – one source of truth (franchise_leads, lead_contact_logs), clear rules, no duplicated tables or spaghetti logic.
- Simplified enterprise-style CRM for internal Philippine franchise operations.

---

## Backend Reference

- **Leads list:** `GET /api/admin/leads?tab=all|new|active|for_follow_up|orientation|onboarding|dropped|archived&page=&pageSize=&search=&from=&to=`
- **Lead by id:** `GET /api/admin/leads/:id`
- **Update lead:** `PATCH /api/admin/leads/:id` (status, stage, contact_outcome, next_followup_at, assigned_to)
- **Contact logs:** `GET /api/admin/leads/:id/contact-logs`, `POST /api/admin/leads/:id/contact-logs` (contactType, notes, outcome?, nextFollowupAt?)
