const DEFAULT_FRANCHISE_CONFIRMATION_TEMPLATE = `Good day, (name)!

Thank you for signing up with Milkshop Franchise! 🎉

We're excited to help you explore this amazing opportunity.

What to expect:

Our team will review your application
We'll reach out to schedule an initial call within 3–5 business days
If you're ready, we'd love to connect sooner to discuss our franchise process, current promos, and answer any questions you may have. Just reply to this email or message us directly!

Looking forward to chatting with you soon!

Warm regards,
Milkshop Team`

const DEFAULT_LEAD_OUTCOME_EMAILS = {
  DROP: {
    subject: 'Milkshop Franchise - Application Update',
    template: `Hello (name),

Thank you for your interest in franchising with Milkshop. We understand that you're unable to proceed with your franchise application at this time. Should your plans change in the future, we'd be happy to discuss opportunities with you. We look forward to welcoming you to the Milkshop family.`,
  },
  ARCHIVE: {
    subject: 'Milkshop Franchise - Staying in Touch',
    template: `Hello (name),

Thank you for your interest in Milkshop Franchising. We've attempted to reach you regarding your franchise inquiry but have been unable to connect. To keep you informed about franchise opportunities, promotions, and business updates, we may keep your contact information on file. Feel free to reach out anytime if you'd like to continue the discussion.`,
  },
  CONFIRMED_SCHEDULE: {
    subject: 'Milkshop Franchise - Schedule Confirmed',
    template: `Hello (name),

Thank you for choosing Milkshop. We are pleased to confirm that your franchise application has been received and successfully scheduled for the next stage of evaluation. Our team will contact you with further details, requirements, and instructions. We look forward to exploring this opportunity with you.`,
  },
  PAID_RESERVATION: {
    subject: 'Milkshop Franchise - Reservation Payment Received',
    template: `Hello (name),

Thank you for securing your Milkshop franchise reservation. We have successfully received your reservation payment and your preferred location is now being reserved for the evaluation process. Our franchising team will contact you shortly regarding the next requirements and steps toward franchise approval.`,
  },
  PAID: {
    subject: 'Milkshop Franchise - Franchise Fee Payment Received',
    template: `Hello (name),

Congratulations! We have successfully received your Milkshop Franchise Fee payment. You are now officially moving forward as a Milkshop Franchise Partner. Our team will coordinate with you regarding onboarding, store development, training, and the succeeding phases of your franchise journey. We look forward to building a successful business together.`,
  },
  CANCEL: {
    subject: 'Milkshop Franchise - Schedule Cancelled',
    template: `Hello (name),

Thank you for your interest in Milkshop Franchising. We understand that you need to cancel or postpone your scheduled franchise meeting. No worries—our team will be happy to assist you in arranging a new schedule at your convenience. Simply contact us when you're ready to continue your franchise journey with Milkshop. We look forward to speaking with you soon.`,
  },
}

function cloneDefaultOutcomeEmails() {
  return Object.fromEntries(
    Object.entries(DEFAULT_LEAD_OUTCOME_EMAILS).map(([key, value]) => [
      key,
      { subject: value.subject, template: value.template },
    ]),
  )
}

function mergeOutcomeEmails(stored) {
  const merged = cloneDefaultOutcomeEmails()
  if (!stored || typeof stored !== 'object') return merged

  for (const [key, value] of Object.entries(stored)) {
    if (!merged[key] || !value || typeof value !== 'object') continue
    if (value.subject != null && String(value.subject).trim()) {
      merged[key].subject = String(value.subject)
    }
    if (value.template != null && String(value.template).trim()) {
      merged[key].template = String(value.template)
    }
  }

  return merged
}

module.exports = {
  DEFAULT_FRANCHISE_CONFIRMATION_TEMPLATE,
  DEFAULT_LEAD_OUTCOME_EMAILS,
  cloneDefaultOutcomeEmails,
  mergeOutcomeEmails,
}
