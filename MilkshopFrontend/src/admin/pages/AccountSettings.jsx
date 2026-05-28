import { useEffect, useMemo, useState } from "react";
import { useAdminAuth } from "../context/AdminAuthContext";
import {
  fetchMyAccountSettings,
  updateMyAccountSettings,
  fetchAllAccounts,
  createAccountByAdmin,
  updateAccountByAdmin,
} from "../services/api";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap');

  :root {
    --gp: #97b64c;
    --gd: #62840b;
    --gl: #b7cd7f;
    --bg: #f5f8ef;
    --bd: #d0e0b0;
    --tp: #1e1e1e;
    --ts: #374151;
    --wh: #ffffff;
  }

  *, *::before, *::after { box-sizing: border-box; }

  .as-root {
    min-height: 100vh;
    background: var(--bg);
    font-family: 'DM Sans', sans-serif;
    color: var(--tp);
    padding: 32px 28px 56px;
  }

  .as-inner {
    max-width: 780px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 22px;
  }

  /* ── Page Header ── */
  .as-page-eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--ts);
    opacity: 0.6;
    margin-bottom: 5px;
  }

  .as-page-title {
    font-size: 22px;
    font-weight: 700;
    color: var(--tp);
    letter-spacing: -0.03em;
    line-height: 1.1;
  }

  .as-page-sub {
    font-size: 13px;
    color: var(--ts);
    margin-top: 5px;
    opacity: 0.6;
  }

  /* ── Feedback ── */
  .as-feedback {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 11px 16px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 500;
    animation: as-in 0.2s ease both;
  }

  @keyframes as-in {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .as-feedback.ok  { background: #eef5df; border: 1px solid var(--bd); color: var(--gd); }
  .as-feedback.err { background: #fef2f2; border: 1px solid #fca5a5; color: #c0392b; }

  /* ── Section card ── */
  .as-section {
    background: var(--wh);
    border: 1px solid var(--bd);
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 2px 16px rgba(10,20,5,0.04);
  }

  .as-section-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 18px 24px;
    border-bottom: 1px solid var(--bd);
  }

  .as-section-icon {
    width: 36px; height: 36px;
    border-radius: 10px;
    background: #eef5df;
    border: 1px solid var(--bd);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--gd);
    flex-shrink: 0;
  }

  .as-section-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--tp);
    letter-spacing: -0.01em;
  }

  .as-section-sub {
    font-size: 12px;
    color: var(--ts);
    opacity: 0.6;
    margin-top: 2px;
  }

  .as-section-body { padding: 24px; }

  /* ── Profile row ── */
  .as-profile-row {
    display: flex;
    align-items: center;
    gap: 16px;
    padding-bottom: 22px;
    margin-bottom: 22px;
    border-bottom: 1px solid #f0f5e8;
  }

  .as-avatar-big {
    width: 52px; height: 52px;
    border-radius: 50%;
    background: linear-gradient(135deg, #d4e8a0 0%, #97b64c 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Mono', monospace;
    font-size: 20px;
    font-weight: 700;
    color: var(--wh);
    flex-shrink: 0;
  }

  .as-profile-name {
    font-size: 15px;
    font-weight: 600;
    color: var(--tp);
    letter-spacing: -0.01em;
  }

  .as-profile-email {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: var(--ts);
    opacity: 0.55;
    margin-top: 2px;
  }

  .as-role-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: #eef5df;
    border: 1px solid var(--bd);
    border-radius: 99px;
    padding: 3px 10px;
    font-family: 'DM Mono', monospace;
    font-size: 9.5px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--gd);
    margin-top: 5px;
  }

  .as-role-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--gp); }

  /* ── Fields grid ── */
  .as-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 15px;
  }

  @media (min-width: 560px) { .as-grid { grid-template-columns: 1fr 1fr; } }

  .as-label {
    display: block;
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--ts);
    margin-bottom: 7px;
    opacity: 0.65;
  }

  .as-input {
    width: 100%;
    padding: 10px 13px;
    border: 1.5px solid var(--bd);
    border-radius: 11px;
    font-size: 13.5px;
    font-family: 'DM Sans', sans-serif;
    color: var(--tp);
    background: var(--bg);
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
    box-sizing: border-box;
  }

  .as-input::placeholder { color: var(--ts); opacity: 0.3; }

  .as-input:focus {
    border-color: var(--gp);
    box-shadow: 0 0 0 3px rgba(151,182,76,0.1);
    background: var(--wh);
  }

  .as-input:disabled { opacity: 0.45; cursor: not-allowed; }

  .as-select {
    width: 100%;
    padding: 10px 36px 10px 13px;
    border: 1.5px solid var(--bd);
    border-radius: 11px;
    font-size: 13.5px;
    font-family: 'DM Sans', sans-serif;
    color: var(--tp);
    background: var(--bg) url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%235a5a5a' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat right 13px center;
    appearance: none;
    outline: none;
    cursor: pointer;
    transition: border-color 0.15s, box-shadow 0.15s;
    box-sizing: border-box;
  }

  .as-select:focus { border-color: var(--gp); box-shadow: 0 0 0 3px rgba(151,182,76,0.1); }

  /* ── Section footer ── */
  .as-section-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 14px 24px 18px;
    border-top: 1px solid #f0f5e8;
  }

  /* ── Buttons ── */
  .as-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 9px 20px;
    border-radius: 10px;
    border: none;
    background: var(--gd);
    font-size: 13px;
    font-weight: 600;
    color: var(--wh);
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    letter-spacing: -0.01em;
    transition: background 0.15s, transform 0.1s;
    white-space: nowrap;
  }

  .as-btn-primary:hover:not(:disabled) { background: #4e6909; transform: translateY(-1px); }
  .as-btn-primary:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

  /* ── Table ── */
  .as-table-scroll { overflow-x: auto; }

  .as-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }

  .as-thead { background: var(--bg); border-bottom: 1px solid var(--bd); }

  .as-th {
    padding: 10px 16px;
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--ts);
    text-align: left;
    opacity: 0.6;
    white-space: nowrap;
  }

  .as-tr { transition: background 0.1s; }
  .as-tr:not(:last-child) td { border-bottom: 1px solid #f0f5e8; }
  .as-tr:hover { background: #fafcf6; }

  .as-td { padding: 11px 16px; vertical-align: middle; }

  .as-td-email {
    font-family: 'DM Mono', monospace;
    font-size: 11.5px;
    color: var(--ts);
    opacity: 0.7;
  }

  .as-ti {
    width: 100%;
    padding: 7px 10px;
    border: 1.5px solid var(--bd);
    border-radius: 8px;
    font-size: 12.5px;
    font-family: 'DM Sans', sans-serif;
    color: var(--tp);
    background: var(--bg);
    outline: none;
    transition: border-color 0.13s, box-shadow 0.13s;
    box-sizing: border-box;
    min-width: 90px;
  }

  .as-ti:focus { border-color: var(--gp); box-shadow: 0 0 0 3px rgba(151,182,76,0.1); background: var(--wh); }

  .as-ts {
    padding: 7px 28px 7px 10px;
    border: 1.5px solid var(--bd);
    border-radius: 8px;
    font-size: 12.5px;
    font-family: 'DM Sans', sans-serif;
    color: var(--tp);
    background: var(--bg) url("data:image/svg+xml,%3Csvg width='10' height='7' viewBox='0 0 10 7' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%235a5a5a' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat right 10px center;
    appearance: none;
    outline: none;
    cursor: pointer;
    transition: border-color 0.13s;
  }

  .as-ts:focus { border-color: var(--gp); box-shadow: 0 0 0 3px rgba(151,182,76,0.1); }

  .as-btn-row {
    display: inline-flex;
    align-items: center;
    padding: 7px 14px;
    border-radius: 8px;
    border: none;
    background: var(--gp);
    font-size: 12px;
    font-weight: 600;
    color: var(--wh);
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.13s;
    white-space: nowrap;
  }

  .as-btn-row:hover { background: var(--gd); }

  /* Loading */
  .as-loading {
    padding: 52px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .as-spinner {
    width: 22px; height: 22px;
    border: 2px solid var(--bd);
    border-top-color: var(--gp);
    border-radius: 50%;
    animation: as-spin 0.7s linear infinite;
  }

  @keyframes as-spin { to { transform: rotate(360deg); } }

  .as-loading-text {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: var(--ts);
    opacity: 0.5;
  }
`;

export default function AccountSettings() {
  const { token, admin, setAdminProfile } = useAdminAuth();
  const isAdmin = admin?.role === "admin";

  const [me, setMe]                 = useState(null);
  const [myUsername, setMyUsername] = useState("");
  const [myPassword, setMyPassword] = useState("");
  const [accounts, setAccounts]     = useState([]);
  const [createForm, setCreateForm] = useState({ email: "", username: "", password: "", role: "user" });
  const [editMap, setEditMap]       = useState({});
  const [msg, setMsg]               = useState("");
  const [err, setErr]               = useState("");
  const [loading, setLoading]       = useState(true);

  async function loadAll() {
    if (!token) return;
    setLoading(true); setErr("");
    try {
      const meRes  = await fetchMyAccountSettings(token);
      const meData = meRes?.data || null;
      setMe(meData);
      setMyUsername(meData?.username || "");
      if (meData) {
        setAdminProfile({
          id: meData.id,
          email: meData.email,
          username: meData.username,
          role: meData.role,
        });
      }
      if (meData?.role === "admin") {
        const listRes = await fetchAllAccounts(token);
        const list    = listRes?.data || [];
        setAccounts(list);
        const m = {};
        list.forEach((a) => { m[a.id] = { username: a.username || "", role: a.role || "user", password: "" }; });
        setEditMap(m);
      } else {
        setAccounts([]);
        setEditMap({});
      }
    } catch (e) {
      if (e?.status === 403) {
        setErr("");
      } else {
        setErr(e?.message || "Failed to load account settings");
      }
    }
    finally { setLoading(false); }
  }

  useEffect(() => { loadAll(); }, [token, isAdmin]);

  const canSaveMe = useMemo(() => myUsername.trim().length > 0 || myPassword.trim().length > 0, [myUsername, myPassword]);

  async function handleSaveMe(e) {
    e.preventDefault(); setErr(""); setMsg("");
    try {
      const payload = {};
      if (myUsername.trim()) payload.username = myUsername.trim();
      if (myPassword.trim()) payload.password = myPassword;
      const res = await updateMyAccountSettings(token, payload);
      const u   = res?.data;
      setMe(u); setMyUsername(u?.username || ""); setMyPassword("");
      setAdminProfile({ id: u.id, email: u.email, username: u.username, role: u.role });
      setMsg("Account updated successfully.");
    } catch (e2) { setErr(e2?.message || "Failed to update my account"); }
  }

  async function handleCreateAccount(e) {
    e.preventDefault(); setErr(""); setMsg("");
    try {
      await createAccountByAdmin(token, createForm);
      setCreateForm({ email: "", username: "", password: "", role: "user" });
      setMsg("Account created. They can sign in at /admin/login with this email and password.");
      await loadAll();
    } catch (e2) { setErr(e2?.message || "Failed to create account"); }
  }

  async function handleSaveRow(id) {
    setErr(""); setMsg("");
    const row = editMap[id] || {};
    try {
      const payload = { username: row.username, role: row.role };
      if (row.password?.trim()) payload.password = row.password;
      await updateAccountByAdmin(token, id, payload);
      setMsg("Account updated successfully.");
      await loadAll();
    } catch (e2) { setErr(e2?.message || "Failed to update account"); }
  }

  const avatarLetter = (me?.email?.[0] || me?.username?.[0] || "A").toUpperCase();

  return (
    <>
      <style>{STYLES}</style>
      <div className="as-root">
        <div className="as-inner">

          {/* Header */}
          <div>
            <p className="as-page-eyebrow">Settings</p>
            <h1 className="as-page-title">Account Settings</h1>
            <p className="as-page-sub">Manage login credentials and user accounts.</p>
          </div>

          {/* Feedback */}
          {err       && <div className="as-feedback err">{err}</div>}
          {msg && !err && <div className="as-feedback ok">{msg}</div>}

          {loading ? (
            <div className="as-section">
              <div className="as-loading">
                <div className="as-spinner" />
                <span className="as-loading-text">Loading settings...</span>
              </div>
            </div>
          ) : (
            <>
              {/* My Account */}
              <div className="as-section">
                <div className="as-section-header">
                  <div className="as-section-icon">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div>
                    <p className="as-section-title">My Account</p>
                    <p className="as-section-sub">Update your username or change your password.</p>
                  </div>
                </div>

                <div className="as-section-body">
                  <div className="as-profile-row">
                    <div className="as-avatar-big">{avatarLetter}</div>
                    <div>
                      <p className="as-profile-name">{me?.username || me?.email || "Admin"}</p>
                      <p className="as-profile-email">{me?.email || ""}</p>
                      <div className="as-role-pill"><span className="as-role-dot" />{me?.role || "user"}</div>
                    </div>
                  </div>

                  <div className="as-grid">
                    <div>
                      <label className="as-label">Email</label>
                      <input value={me?.email || ""} disabled className="as-input" />
                    </div>
                    <div>
                      <label className="as-label">Username</label>
                      <input value={myUsername} onChange={(e) => setMyUsername(e.target.value)} placeholder="Enter username" className="as-input" />
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label className="as-label">New Password <span style={{ opacity: 0.45, fontStyle: "italic", textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
                      <input type="password" value={myPassword} onChange={(e) => setMyPassword(e.target.value)} placeholder="Min. 6 chars — updates Firebase sign-in" className="as-input" />
                    </div>
                  </div>
                </div>

                <div className="as-section-footer">
                  <button type="button" disabled={!canSaveMe} onClick={handleSaveMe} className="as-btn-primary">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    Save Changes
                  </button>
                </div>
              </div>

              {isAdmin && (
                <>
                  {/* Create Account */}
                  <div className="as-section">
                    <div className="as-section-header">
                      <div className="as-section-icon">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                          <line x1="19" y1="8" x2="19" y2="14"/>
                          <line x1="22" y1="11" x2="16" y2="11"/>
                        </svg>
                      </div>
                      <div>
                        <p className="as-section-title">Create Account</p>
                        <p className="as-section-sub">Adds database access and a Firebase login (same email and password at admin sign-in).</p>
                      </div>
                    </div>

                    <div className="as-section-body">
                      <div className="as-grid">
                        <div>
                          <label className="as-label">Email</label>
                          <input placeholder="user@milkshop.com" value={createForm.email} onChange={(e) => setCreateForm((p) => ({ ...p, email: e.target.value }))} className="as-input" />
                        </div>
                        <div>
                          <label className="as-label">Username</label>
                          <input placeholder="username" value={createForm.username} onChange={(e) => setCreateForm((p) => ({ ...p, username: e.target.value }))} className="as-input" />
                        </div>
                        <div>
                          <label className="as-label">Password</label>
                          <input type="password" placeholder="••••••••" value={createForm.password} onChange={(e) => setCreateForm((p) => ({ ...p, password: e.target.value }))} className="as-input" />
                        </div>
                        <div>
                          <label className="as-label">Role</label>
                          <select value={createForm.role} onChange={(e) => setCreateForm((p) => ({ ...p, role: e.target.value }))} className="as-select">
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="as-section-footer">
                      <button type="button" onClick={handleCreateAccount} className="as-btn-primary">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Create Account
                      </button>
                    </div>
                  </div>

                  {/* Accounts List */}
                  <div className="as-section">
                    <div className="as-section-header">
                      <div className="as-section-icon">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                      </div>
                      <div>
                        <p className="as-section-title">All Accounts</p>
                        <p className="as-section-sub">{accounts.length} account{accounts.length !== 1 ? "s" : ""} registered.</p>
                      </div>
                    </div>

                    <div className="as-table-scroll">
                      <table className="as-table">
                        <thead className="as-thead">
                          <tr>
                            <th className="as-th">Email</th>
                            <th className="as-th">Username</th>
                            <th className="as-th">Role</th>
                            <th className="as-th">New Password</th>
                            <th className="as-th"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {accounts.map((a) => (
                            <tr key={a.id} className="as-tr">
                              <td className="as-td as-td-email">{a.email}</td>
                              <td className="as-td">
                                <input value={editMap[a.id]?.username || ""} onChange={(e) => setEditMap((p) => ({ ...p, [a.id]: { ...p[a.id], username: e.target.value } }))} className="as-ti" />
                              </td>
                              <td className="as-td">
                                <select value={editMap[a.id]?.role || "user"} onChange={(e) => setEditMap((p) => ({ ...p, [a.id]: { ...p[a.id], role: e.target.value } }))} className="as-ts">
                                  <option value="user">User</option>
                                  <option value="admin">Admin</option>
                                </select>
                              </td>
                              <td className="as-td">
                                <input type="password" placeholder="Min. 6 chars" value={editMap[a.id]?.password || ""} onChange={(e) => setEditMap((p) => ({ ...p, [a.id]: { ...p[a.id], password: e.target.value } }))} className="as-ti" />
                              </td>
                              <td className="as-td">
                                <button type="button" onClick={() => handleSaveRow(a.id)} className="as-btn-row">Save</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}