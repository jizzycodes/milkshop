# Website Tracking Module

This module tracks public website engagement in a fail-safe way.

- `TrackingBootstrap.jsx` mounts the tracker on public pages.
- `useWebsiteTracker.js` captures:
  - section dwell time from explicit section markers (`data-track-section`)
  - nav click events
  - session-level route context

Current rules:

- Section time is recorded only on `section_view_end`.
- A section must be visible for at least **4 seconds** before tracking starts.
- Tracked section time is bounded to **7 minutes max** per event.
- Tracking watches only nodes with `data-track-section` to avoid noisy IDs/layout wrappers.
- Timing is tracked per DOM node instance to prevent key-collision bugs.

Safety:

- Non-blocking sends (`keepalive`), batched queue.
- If API fails, user UI is unaffected.
- Feature flag: `VITE_TRACKING_ENABLED=false` disables tracking.

Admin (Monitor page):

- **Reset metrics** calls `DELETE /api/admin/monitor/metrics` and wipes stored tracking events (cannot be undone).
