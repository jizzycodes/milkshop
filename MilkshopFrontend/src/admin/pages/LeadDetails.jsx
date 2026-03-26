import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import {
  fetchLeadById,
  fetchLeadContactLogs,
  createLeadContactLog,
  updateLead,
} from "../services/leadService";
import AdminErrorBanner from "../components/AdminErrorBanner";
import StatusBadge from "../components/StatusBadge";
import ContactTimeline from "../components/ContactTimeline";
import FollowUpModal from "../components/FollowUpModal";

export default function LeadDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAdminAuth();
  const [lead, setLead] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      if (!token || !id) return;
      setIsLoading(true);
      setErrorMessage("");
      try {
        const [leadRes, logsRes] = await Promise.all([
          fetchLeadById(token, id),
          fetchLeadContactLogs(token, id),
        ]);
        if (!isMounted) return;
        setLead(leadRes.data);
        setLogs(logsRes.data || []);
      } catch (err) {
        if (!isMounted) return;
        setErrorMessage(err?.message || "Unable to load lead.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [token, id]);

  const handleStageChange = async (e) => {
    if (!lead) return;
    const stage = e.target.value;
    try {
      const res = await updateLead(token, id, { stage });
      setLead(res.data);
    } catch (err) {
      setErrorMessage(err?.message || "Unable to update stage.");
    }
  };

  const handleStatusChange = async (e) => {
    if (!lead) return;
    const status = e.target.value;
    try {
      const res = await updateLead(token, id, { status });
      setLead(res.data);
    } catch (err) {
      setErrorMessage(err?.message || "Unable to update status.");
    }
  };

  const handleCreateContact = async (payload) => {
    try {
      await createLeadContactLog(token, id, payload);
      setModalOpen(false);
      const freshLogs = await fetchLeadContactLogs(token, id);
      setLogs(freshLogs.data || []);
      const freshLead = await fetchLeadById(token, id);
      setLead(freshLead.data);
      setSuccessMessage("Contact record saved.");
    } catch (err) {
      setErrorMessage(err?.message || "Unable to save contact record.");
    }
  };

  /* ---------- Loading ---------- */
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F9F4] flex-col gap-3">
        <div className="h-6 w-6 rounded-full border-2 border-[#DDE8CF] border-t-[#5A9216] animate-spin" />
        <span className="font-mono text-xs text-[#374151]">Loading lead...</span>
      </div>
    );
  }

  /* ---------- Not found ---------- */
  if (!lead) {
    return (
      <div className="min-h-screen bg-[#F7F9F4] p-8">
        <AdminErrorBanner message={errorMessage || "Lead not found."} />
        <button
          type="button"
          onClick={() => navigate("/admin/leads")}
          className="mt-4 text-xs font-medium text-[#374151] hover:text-[#1A2410] transition"
        >
          ← Back to leads
        </button>
      </div>
    );
  }

  /* ---------- Main ---------- */
  return (
    <div className="min-h-screen bg-[#F7F9F4] px-6 py-7">
      <div className="mx-auto max-w-5xl relative">

        <AdminErrorBanner message={errorMessage} />

        {/* Back */}
        <button
          type="button"
          onClick={() => navigate("/admin/leads")}
          className="mb-5 inline-flex items-center gap-1.5 text-xs font-medium text-[#374151] hover:text-[#1A2410] transition"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to leads
        </button>

        {/* Hero */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-[#5A9216]">
              Lead Details
            </p>
            <h1 className="text-xl font-semibold tracking-tight text-[#1A2410]">
              {lead.full_name || "—"}
            </h1>
            <p className="mt-1 font-mono text-[11px] text-[#374151]">
              {lead.email} · {lead.contact_number}
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-end gap-3">
            {/* Stage */}
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[9.5px] font-semibold uppercase tracking-widest text-[#374151]">
                Stage
              </span>
              <select
                value={lead.stage || ""}
                onChange={handleStageChange}
                className="min-w-[138px] appearance-none rounded-lg border border-[#DDE8CF] bg-white px-3 py-2 text-xs font-medium text-[#1A2410] outline-none transition focus:border-[#5A9216] focus:ring-1 focus:ring-[#5A9216] cursor-pointer"
              >
                <option value="REGISTERED">Registered</option>
                <option value="ORIENTATION">Orientation</option>
                <option value="ATTENDED">Attended</option>
                <option value="ONBOARDING">Onboarding</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[9.5px] font-semibold uppercase tracking-widest text-[#374151]">
                Status
              </span>
              <select
                value={lead.status || ""}
                onChange={handleStatusChange}
                className="min-w-[138px] appearance-none rounded-lg border border-[#DDE8CF] bg-white px-3 py-2 text-xs font-medium text-[#1A2410] outline-none transition focus:border-[#5A9216] focus:ring-1 focus:ring-[#5A9216] cursor-pointer"
              >
                <option value="NEW">New</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="FOR_FOLLOWUP">For Follow Up</option>
                <option value="APPROVED">Approved</option>
                <option value="DROPPED">Dropped</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            {/* Current Badge */}
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[9.5px] font-semibold uppercase tracking-widest text-[#374151]">
                Current
              </span>
              <div className="flex items-center h-[34px]">
                <StatusBadge status={lead.status} />
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_340px]">

          {/* Basic Info */}
          <div className="overflow-hidden rounded-xl border border-[#DDE8CF] bg-white shadow-sm">
            <div className="border-b border-[#DDE8CF] px-5 py-3.5">
              <h2 className="text-[11px] font-semibold uppercase tracking-widest text-[#374151]">
                Basic Info
              </h2>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 gap-3">

                <InfoItem label="Contact" value={lead.contact_number} />
                <InfoItem label="Best Contact Time" value={lead.best_contact_time} />
                <InfoItem label="Proposed Location" value={lead.proposed_location} />
                <InfoItem label="Package Type" value={lead.preferred_package || lead.package_type} />
                <div className="col-span-2">
                  <InfoItem label="Remarks" value={lead.remarks} />
                </div>

              </div>
            </div>
          </div>

          {/* Contact History */}
          <div className="overflow-hidden rounded-xl border border-[#DDE8CF] bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-[#DDE8CF] px-5 py-3.5">
              <h2 className="text-[11px] font-semibold uppercase tracking-widest text-[#374151]">
                Contact History
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-1 rounded-full bg-[#5A9216] px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm hover:bg-[#3E6610] transition"
              >
                + Add Contact
              </button>
            </div>
            <ContactTimeline logs={logs} />
          </div>

        </div>

        <FollowUpModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleCreateContact}
        />

        {/* Floating success toast */}
        {successMessage && !errorMessage && (
          <div className="pointer-events-none fixed inset-0 z-50 flex items-start justify-center pt-20">
            <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-[#166534] px-4 py-2 text-xs font-medium text-white shadow-lg">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {successMessage}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

/* ---------- Info Item ---------- */
function InfoItem({ label, value }) {
  return (
    <div className="rounded-lg border border-[#DDE8CF] bg-[#F7F9F4] px-3.5 py-3">
      <p className="mb-1 font-mono text-[9.5px] uppercase tracking-widest text-[#374151]">
        {label}
      </p>
      <p className="text-[12.5px] font-medium text-[#1A2410]">
        {value || "—"}
      </p>
    </div>
  );
}