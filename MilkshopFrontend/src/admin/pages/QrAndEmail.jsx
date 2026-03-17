import { useState } from "react"

const STYLES = `
  .qe-root {
    padding: 20px 22px 32px;
    max-width: 1040px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .qe-header-title {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.03em;
    color: #1A2410;
  }

  .qe-header-sub {
    font-size: 12px;
    color: #5A6B4A;
    margin-top: 4px;
  }

  .qe-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
  }

  @media (min-width: 900px) {
    .qe-grid {
      grid-template-columns: minmax(0, 1.1fr) minmax(0, 1.1fr);
    }
  }

  .qe-card {
    background: #FFFFFF;
    border-radius: 18px;
    border: 1px solid #DDE8CF;
    padding: 18px 18px 20px;
    box-shadow: 0 10px 30px rgba(26,36,16,0.05);
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .qe-card-title {
    font-size: 14px;
    font-weight: 600;
    color: #1A2410;
  }

  .qe-card-sub {
    font-size: 11px;
    color: #5A6B4A;
  }

  .qe-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: #5A6B4A;
    margin-bottom: 6px;
  }

  .qe-input,
  .qe-textarea {
    width: 100%;
    border-radius: 10px;
    border: 1px solid #DDE8CF;
    padding: 8px 10px;
    font-size: 13px;
    color: #111827;
    background: #F9FBF6;
    outline: none;
    transition: border-color 0.12s, box-shadow 0.12s, background 0.12s;
    resize: vertical;
    min-height: 40px;
  }

  .qe-textarea {
    min-height: 120px;
  }

  .qe-input:focus,
  .qe-textarea:focus {
    border-color: #5A9216;
    box-shadow: 0 0 0 1px rgba(90,146,22,0.15);
    background: #FFFFFF;
  }

  .qe-qr-preview {
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 14px;
    border-radius: 14px;
    background: #F7F9F4;
    border: 1px dashed #DDE8CF;
  }

  .qe-qr-box {
    width: 160px;
    height: 160px;
    border-radius: 18px;
    background: radial-gradient(circle at 0 0, #C6F6D5 0, #F7F9F4 45%, #D1FAE5 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  .qe-qr-inner {
    width: 118px;
    height: 118px;
    background-image: radial-gradient(circle, #111827 1px, transparent 1px);
    background-size: 10px 10px;
    border-radius: 4px;
    box-shadow: 0 10px 25px rgba(15, 23, 42, 0.28);
  }

  .qe-qr-placeholder {
    position: absolute;
    bottom: 10px;
    left: 12px;
    right: 12px;
    display: flex;
    justify-content: space-between;
    font-size: 9px;
    font-family: 'DM Mono', monospace;
    color: rgba(15,23,42,0.68);
  }

  .qe-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 10px;
    color: #6B7280;
  }

  .qe-pill {
    padding: 3px 8px;
    border-radius: 999px;
    background: #ECFDF3;
    border: 1px solid #BBF7D0;
    font-size: 10px;
    font-weight: 500;
    color: #166534;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .qe-preview-box {
    margin-top: 10px;
    border-radius: 12px;
    border: 1px solid #E5E7EB;
    background: #F9FAFB;
    padding: 10px 12px;
    font-size: 12px;
    color: #111827;
    white-space: pre-line;
  }
`;

export default function QrAndEmail() {
  const [qrUrl, setQrUrl] = useState("https://milkshop.ph/franchise")
  const [emailTemplate, setEmailTemplate] = useState(
    "Hi {{name}},\n\nThank you for your interest in Milkshop.\nHere is the link to complete your next step.\n\nBest,\nMilkshop Team"
  )

  return (
    <>
      <style>{STYLES}</style>
      <div className="qe-root">
        <div>
          <h1 className="qe-header-title">QR and Email</h1>
          <p className="qe-header-sub">
            Quick tools for franchise campaigns – generate a QR destination and edit your email format.
          </p>
        </div>

        <div className="qe-grid">
          <section className="qe-card">
            <div>
              <p className="qe-card-title">QR Code Destination</p>
              <p className="qe-card-sub">
                Set the link where your QR code will point. This is UI only for now – export can be added later.
              </p>
            </div>

            <div>
              <p className="qe-label">Destination URL</p>
              <input
                type="text"
                className="qe-input"
                value={qrUrl}
                onChange={(e) => setQrUrl(e.target.value)}
                placeholder="https://"
              />
            </div>

            <div className="qe-qr-preview">
              <div className="qe-qr-box">
                <div className="qe-qr-inner" />
                <div className="qe-qr-placeholder">
                  <span>QR Preview</span>
                  <span>{qrUrl ? "Linked" : "No link"}</span>
                </div>
              </div>
            </div>

            <div className="qe-meta">
              <span>QR is visual only, not yet downloadable.</span>
              <span className="qe-pill">
                <span>●</span> UI only
              </span>
            </div>
          </section>

          <section className="qe-card">
            <div>
              <p className="qe-card-title">Gmail Email Format</p>
              <p className="qe-card-sub">
                Draft and tweak the email text you’ll paste into Gmail. Variables like {"{{name}}"} stay as placeholders.
              </p>
            </div>

            <div>
              <p className="qe-label">Email body</p>
              <textarea
                className="qe-textarea"
                value={emailTemplate}
                onChange={(e) => setEmailTemplate(e.target.value)}
              />
            </div>

            <div>
              <p className="qe-label">Preview</p>
              <div className="qe-preview-box">
                {emailTemplate}
              </div>
            </div>

            <div className="qe-meta">
              <span>Changes are kept only while this page is open.</span>
              <span className="qe-pill">
                <span>●</span> Hardcoded draft
              </span>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

