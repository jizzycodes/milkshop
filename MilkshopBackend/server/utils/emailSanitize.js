const GMAIL_CLIP_BYTES = 102 * 1024
const SAFE_LOGO_URL = 'https://milk-shop.ph/mlogo.webp'

function sanitizeLogoUrl(url) {
  const u = String(url || '').trim()
  if (!u || /^data:/i.test(u) || !/^https?:\/\//i.test(u)) {
    return SAFE_LOGO_URL
  }
  return u
}

/**
 * Strip embedded images / accidental base64 pastes from plain-text templates.
 * Gmail clips HTML over ~102KB (common when a logo is inlined as data: URI).
 */
function sanitizeEmailTemplate(template) {
  let s = String(template || '')
  s = s.replace(/data:image\/[a-z0-9+.-]+;base64,[a-z0-9+/=\r\n\s]+/gi, '')
  s = s.replace(/<img\b[^>]*\bsrc=["']data:image[^"']*["'][^>]*>/gi, '')
  s = s.replace(/^[A-Za-z0-9+/]{200,}={0,2}$/gm, '')
  return s.trim()
}

function sanitizeOutcomeEmails(outcomeEmails) {
  if (!outcomeEmails || typeof outcomeEmails !== 'object') return outcomeEmails
  const out = { ...outcomeEmails }
  for (const key of Object.keys(out)) {
    const item = out[key]
    if (!item || typeof item !== 'object') continue
    out[key] = {
      ...item,
      subject: item.subject != null ? String(item.subject) : item.subject,
      template: sanitizeEmailTemplate(item.template),
    }
  }
  return out
}

module.exports = {
  GMAIL_CLIP_BYTES,
  SAFE_LOGO_URL,
  sanitizeLogoUrl,
  sanitizeEmailTemplate,
  sanitizeOutcomeEmails,
}
