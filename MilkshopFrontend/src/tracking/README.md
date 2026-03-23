# Website Tracking Module

This module tracks public website engagement in a fail-safe way.

- `TrackingBootstrap.jsx` mounts the tracker on public pages.
- `useWebsiteTracker.js` captures:
  - section dwell time (only counted after **4+ seconds** visible, then on leave/navigation)
  - nav click events
  - session-level route context

Safety:

- Non-blocking sends (`keepalive`), batched queue.
- If API fails, user UI is unaffected.
- Feature flag: `VITE_TRACKING_ENABLED=false` disables tracking.

Admin (Monitor page):

- **Reset metrics** calls `DELETE /api/admin/monitor/metrics` and wipes stored tracking events (cannot be undone).
