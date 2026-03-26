import { useCallback, useEffect, useMemo, useState } from "react";
import { useAdminAuth } from "../context/AdminAuthContext";
import { getAdminToken } from "../services/auth";
import { fetchQrEmailSettings, updateQrEmailSettings } from "../services/api";

function resolveAdminToken(contextToken) {
  return contextToken || getAdminToken() || null;
}

const DEFAULT_EMAIL_TEMPLATE = `Good day, (name)!

Thank you for signing up with Milkshop Franchise! 🎉

We're excited to help you explore this amazing opportunity.

What to expect:

Our team will review your application
We'll reach out to schedule an initial call within 3–5 business days
If you're ready, we'd love to connect sooner to discuss our franchise process, current promos, and answer any questions you may have. Just reply to this email or message us directly!

Looking forward to chatting with you soon!

Warm regards,
Milkshop Team`;

function normalizeEmailTemplateFromServer(raw) {
  const s = raw == null ? "" : String(raw).trim();
  return s === "" ? DEFAULT_EMAIL_TEMPLATE : raw;
}

function previewWithSampleName(text) {
  if (!text) return "";
  return String(text).replace(/\(name\)/gi, "Juan");
}

function qrImageSrc(url) {
  if (!url || !String(url).trim()) return "";
  const enc = encodeURIComponent(String(url).trim());
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${enc}`;
}

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap');

  :root {
    --green-primary: #97b64c;
    --green-dark:    #62840b;
    --green-light:   #b7cd7f;
    --surface-bg:    #f5f8ef;
    --border:        #d0e0b0;
    --text-primary:  #1e1e1e;
    --text-secondary:#374151;
    --white:         #ffffff;
  }

  .qe-root {
    max-width: 1040px;
    margin: 0 auto;
    padding: 28px 28px 48px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    font-family: 'DM Sans', sans-serif;
    color: var(--text-primary);
  }

  /* ── Page Header ── */
  .qe-page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }

  .qe-header-eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-secondary);
    opacity: 0.6;
    margin-bottom: 4px;
  }

  .qe-header-title {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.025em;
    color: var(--text-primary);
    line-height: 1.1;
  }

  .qe-header-sub {
    font-size: 12.5px;
    color: var(--text-secondary);
    margin-top: 5px;
    opacity: 0.65;
    max-width: 540px;
    line-height: 1.5;
  }

  /* ── Save button + feedback ── */
  .qe-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 4px;
  }

  .qe-btn-save {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 10px 20px;
    border-radius: 10px;
    border: none;
    background: var(--green-primary);
    font-size: 13px;
    font-weight: 600;
    color: var(--white);
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    letter-spacing: -0.01em;
    transition: background 0.15s, transform 0.1s;
    white-space: nowrap;
  }

  .qe-btn-save:hover:not(:disabled) {
    background: var(--green-dark);
    transform: translateY(-1px);
  }

  .qe-btn-save:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  .qe-msg-err {
    font-size: 12px;
    color: #c0392b;
    font-family: 'DM Mono', monospace;
  }

  .qe-msg-ok {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--green-dark);
    font-family: 'DM Mono', monospace;
  }

  /* ── Grid ── */
  .qe-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 18px;
  }

  @media (min-width: 860px) {
    .qe-grid { grid-template-columns: 1fr 1fr; }
  }

  /* ── Cards ── */
  .qe-card {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 18px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 2px 16px rgba(10,20,5,0.05);
  }

  .qe-card-header {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 18px 20px 16px;
    border-bottom: 1px solid var(--border);
  }

  .qe-card-icon {
    width: 36px; height: 36px;
    border-radius: 10px;
    background: #eef5df;
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--green-dark);
    flex-shrink: 0;
    margin-top: 1px;
  }

  .qe-card-title {
    font-size: 13.5px;
    font-weight: 600;
    color: var(--text-primary);
    letter-spacing: -0.01em;
    line-height: 1.2;
  }

  .qe-card-sub {
    font-size: 11.5px;
    color: var(--text-secondary);
    margin-top: 3px;
    opacity: 0.65;
    line-height: 1.5;
  }

  .qe-card-body {
    padding: 18px 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    flex: 1;
  }

  /* ── Field ── */
  .qe-field {}

  .qe-label {
    display: block;
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--text-secondary);
    margin-bottom: 7px;
    opacity: 0.65;
  }

  .qe-input {
    width: 100%;
    border-radius: 10px;
    border: 1px solid var(--border);
    padding: 9px 13px;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    color: var(--text-primary);
    background: var(--surface-bg);
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
    box-sizing: border-box;
  }

  .qe-input:focus {
    border-color: var(--green-primary);
    box-shadow: 0 0 0 3px rgba(151,182,76,0.12);
    background: var(--white);
  }

  .qe-input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .qe-textarea {
    width: 100%;
    border-radius: 10px;
    border: 1px solid var(--border);
    padding: 10px 13px;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    color: var(--text-primary);
    background: var(--surface-bg);
    outline: none;
    resize: vertical;
    min-height: 180px;
    line-height: 1.6;
    transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
    box-sizing: border-box;
  }

  .qe-textarea:focus {
    border-color: var(--green-primary);
    box-shadow: 0 0 0 3px rgba(151,182,76,0.12);
    background: var(--white);
  }

  .qe-textarea:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* ── QR Preview ── */
  .qe-qr-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    border-radius: 12px;
    background: var(--surface-bg);
    border: 1px dashed var(--border);
    min-height: 160px;
  }

  .qe-qr-img {
    width: 180px; height: 180px;
    object-fit: contain;
    border-radius: 10px;
    background: var(--white);
    box-shadow: 0 2px 12px rgba(10,20,5,0.08);
  }

  .qe-qr-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: var(--text-secondary);
    opacity: 0.4;
  }

  .qe-qr-empty-icon {
    width: 40px; height: 40px;
    border-radius: 12px;
    background: var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .qe-qr-empty-text {
    font-family: 'DM Mono', monospace;
    font-size: 10.5px;
  }

  /* ── Email Preview box ── */
  .qe-preview-box {
    background: var(--surface-bg);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 12px 14px;
    font-size: 12px;
    color: var(--text-primary);
    white-space: pre-line;
    line-height: 1.6;
    opacity: 0.85;
    min-height: 80px;
  }

  /* ── Card footer meta ── */
  .qe-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px;
    border-top: 1px solid var(--border);
    gap: 8px;
    flex-wrap: wrap;
  }

  .qe-meta-text {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: var(--text-secondary);
    opacity: 0.5;
  }

  .qe-meta-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 9px;
    border-radius: 20px;
    background: #eef5df;
    border: 1px solid var(--border);
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    color: var(--green-dark);
    white-space: nowrap;
  }

  .qe-meta-pill-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--green-primary);
    flex-shrink: 0;
  }
`;

export default function QrAndEmail() {
  const { token } = useAdminAuth();
  const authToken = resolveAdminToken(token);
  const [qrUrl, setQrUrl]                   = useState("");
  const [emailTemplate, setEmailTemplate]   = useState(DEFAULT_EMAIL_TEMPLATE);
  const [loading, setLoading]               = useState(true);
  const [saving, setSaving]                 = useState(false);
  const [error, setError]                   = useState(null);
  const [savedMsg, setSavedMsg]             = useState(null);

  const load = useCallback(async () => {
    const t = resolveAdminToken(token);
    if (!t) { setLoading(false); setError("Sign in again — your session has no admin token."); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await fetchQrEmailSettings(t);
      const d   = res?.data || {};
      setQrUrl(d.qrUrl ?? "");
      setEmailTemplate(normalizeEmailTemplateFromServer(d.emailTemplate));
    } catch (e) {
      setError(e?.message || "Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const previewText = useMemo(() => previewWithSampleName(emailTemplate), [emailTemplate]);

  async function handleSave() {
    const t = resolveAdminToken(token);
    if (!t) { setError("Sign in again — your session has no admin token."); return; }
    setSaving(true);
    setError(null);
    setSavedMsg(null);
    try {
      await updateQrEmailSettings(t, { qrUrl, emailTemplate });
      setSavedMsg("Saved. New franchise inquiries will use this email body.");
      await load();
    } catch (e) {
      setError(e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const qrSrc = qrImageSrc(qrUrl);

  return (
    <>
      <style>{STYLES}</style>
      <div className="qe-root">

        {/* ── Page Header ── */}
        <div className="qe-page-header">
          <div>
            <p className="qe-header-eyebrow">Settings</p>
            <h1 className="qe-header-title">QR & Email</h1>
            <p className="qe-header-sub">
              Configure the franchise QR destination and the confirmation email sent to every new inquiry.
              Use <strong>(name)</strong> where the recipient's name should appear.
            </p>
          </div>

          <div className="qe-actions">
            <button
              type="button"
              className="qe-btn-save"
              onClick={handleSave}
              disabled={loading || saving || !authToken}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              {saving ? "Saving…" : "Save Settings"}
            </button>
            {error    && <span className="qe-msg-err">{error}</span>}
            {savedMsg && !error && (
              <span className="qe-msg-ok">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {savedMsg}
              </span>
            )}
          </div>
        </div>

        {/* ── Grid ── */}
        <div className="qe-grid">

          {/* QR Card */}
          <section className="qe-card">
            <div className="qe-card-header">
              <div className="qe-card-icon">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1"/>
                  <rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/>
                  <rect x="14" y="14" width="3" height="3" rx="0.5"/>
                  <rect x="18" y="14" width="3" height="3" rx="0.5"/>
                  <rect x="14" y="18" width="3" height="3" rx="0.5"/>
                  <rect x="18" y="18" width="3" height="3" rx="0.5"/>
                </svg>
              </div>
              <div>
                <p className="qe-card-title">QR Code Destination</p>
                <p className="qe-card-sub">
                  This URL is encoded in printed materials. Point it to your public franchise inquiry page.
                </p>
              </div>
            </div>

            <div className="qe-card-body">
              <div className="qe-field">
                <label className="qe-label">Destination URL</label>
                <input
                  type="text"
                  className="qe-input"
                  value={qrUrl}
                  onChange={(e) => setQrUrl(e.target.value)}
                  placeholder="https://yoursite.com/franchise#inquiry"
                  disabled={loading}
                />
              </div>

              <div className="qe-qr-wrap">
                {qrSrc ? (
                  <img className="qe-qr-img" src={qrSrc} alt="QR preview" />
                ) : (
                  <div className="qe-qr-empty">
                    <div className="qe-qr-empty-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7" rx="1"/>
                        <rect x="14" y="3" width="7" height="7" rx="1"/>
                        <rect x="3" y="14" width="7" height="7" rx="1"/>
                      </svg>
                    </div>
                    <p className="qe-qr-empty-text">Enter a URL to preview</p>
                  </div>
                )}
              </div>
            </div>

            <div className="qe-card-footer">
              <span className="qe-meta-text">Preview via external QR service</span>
              <span className="qe-meta-pill">
                <span className="qe-meta-pill-dot" />
                Global
              </span>
            </div>
          </section>

          {/* Email Card */}
          <section className="qe-card">
            <div className="qe-card-header">
              <div className="qe-card-icon">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <polyline points="2 6 12 13 22 6"/>
                </svg>
              </div>
              <div>
                <p className="qe-card-title">Franchise Confirmation Email</p>
                <p className="qe-card-sub">
                  Plain text body. Milkshop logo is added automatically in the sent HTML email.
                </p>
              </div>
            </div>

            <div className="qe-card-body">
              <div className="qe-field">
                <label className="qe-label">Email Body</label>
                <textarea
                  className="qe-textarea"
                  value={emailTemplate}
                  onChange={(e) => setEmailTemplate(e.target.value)}
                  disabled={loading}
                  placeholder="Edit the confirmation email. Use (name) for the recipient."
                />
              </div>

              <div className="qe-field">
                <label className="qe-label">Preview — Sample Name: Juan</label>
                <div className="qe-preview-box">
                  {previewText || "(Nothing to preview — type your email body above.)"}
                </div>
              </div>
            </div>

            <div className="qe-card-footer">
              <span className="qe-meta-text">
                {loading ? "Loading…" : "Edits apply after you click Save."}
              </span>
              <span className="qe-meta-pill">
                <span className="qe-meta-pill-dot" />
                Gmail send
              </span>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}