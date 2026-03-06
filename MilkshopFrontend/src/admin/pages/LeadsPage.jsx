import { useState } from "react"
import StatusTabs from "../components/StatusTabs"
import Register from "./Register"
import Orientation from "./Orientation"
import Attended from "./Attended"
import Onboarding from "./Onboarding"
import Archived from "./Archived"
import Dropped from "./Dropped"

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap');

  .lp-root {
    min-height: 100vh;
    background: #F7F9F4;
    font-family: 'DM Sans', sans-serif;
    color: #1A2410;
  }

  .lp-wrapper {
    max-width: 1400px;
    margin: 0 auto;
    padding: 16px;
  }

  .lp-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #FFFFFF;
    border: 1px solid #DDE8CF;
    border-radius: 16px;
    padding: 14px 16px;
    margin-bottom: 20px;
    gap: 16px;
    flex-wrap: wrap;
  }

  .lp-eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #5A9216;
    margin-bottom: 4px;
  }

  .lp-title {
    font-size: 17px;
    font-weight: 700;
    color: #1A2410;
    letter-spacing: -0.02em;
    line-height: 1.1;
  }

  @media (min-width: 769px) {
    .lp-wrapper { padding: 28px 32px; }
    .lp-topbar  { padding: 16px 24px; }
    .lp-title   { font-size: 20px; }
  }
`

const STAGE_TABS = [
  { value: "register",    label: "Register"    },
  { value: "orientation", label: "Orientation" },
  { value: "attended",    label: "Attended"    },
  { value: "onboarding",  label: "Onboarding"  },
  { value: "archived",    label: "Archived"    },
  { value: "dropped",     label: "Dropped"     },
]

export default function LeadsPage() {
  const [stage, setStage] = useState("register")

  let content = null
  if (stage === "register")         content = <Register />
  else if (stage === "orientation") content = <Orientation />
  else if (stage === "attended")    content = <Attended />
  else if (stage === "onboarding")  content = <Onboarding />
  else if (stage === "archived")    content = <Archived />
  else if (stage === "dropped")     content = <Dropped />

  return (
    <>
      <style>{STYLES}</style>
      <div className="lp-root">
        <div className="lp-wrapper">
          <div className="lp-topbar">
            <div>
              <p className="lp-eyebrow">Admin CRM</p>
              <h1 className="lp-title">Leads Pipeline</h1>
            </div>
            <StatusTabs options={STAGE_TABS} value={stage} onChange={setStage} />
          </div>
          <div>{content}</div>
        </div>
      </div>
    </>
  )
}