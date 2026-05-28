const fs = require('fs')
const path = require('path')
const admin = require('firebase-admin')

let initialized = false

function isFirebaseAdminConfigured() {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      (process.env.FIREBASE_SERVICE_ACCOUNT_PATH || process.env.FIREBASE_SERVICE_ACCOUNT_JSON),
  )
}

function loadServiceAccount() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
  }

  const relativePath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH
  if (!relativePath) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_SERVICE_ACCOUNT_JSON is required')
  }

  const absolutePath = path.isAbsolute(relativePath)
    ? relativePath
    : path.resolve(process.cwd(), relativePath)

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Firebase service account file not found: ${absolutePath}`)
  }

  return JSON.parse(fs.readFileSync(absolutePath, 'utf8'))
}

function getFirebaseAdmin() {
  if (!isFirebaseAdminConfigured()) {
    throw new Error('Firebase Admin is not configured')
  }

  if (!initialized) {
    const serviceAccount = loadServiceAccount()
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID,
    })
    initialized = true
  }

  return admin
}

async function verifyFirebaseIdToken(idToken) {
  const firebaseAdmin = getFirebaseAdmin()
  return firebaseAdmin.auth().verifyIdToken(idToken)
}

function mapFirebaseAdminError(err) {
  const code = err?.code || ''
  const messages = {
    'auth/email-already-exists': 'This email is already registered in Firebase.',
    'auth/invalid-email': 'Invalid email address.',
    'auth/invalid-password': 'Password must be at least 6 characters.',
    'auth/weak-password': 'Password is too weak. Use at least 6 characters.',
    'auth/operation-not-allowed': 'Email/password sign-in is disabled in Firebase.',
  }
  const error = new Error(messages[code] || err?.message || 'Firebase authentication error')
  error.status = code === 'auth/email-already-exists' ? 409 : 400
  error.code = code
  return error
}

/**
 * Creates Firebase Auth user, or updates password if email exists in Firebase but not yet in DB.
 * @returns {{ user: import('firebase-admin/auth').UserRecord, created: boolean }}
 */
async function createOrUpdateFirebaseUser({ email, password }) {
  const auth = getFirebaseAdmin().auth()
  const normalizedEmail = String(email).trim().toLowerCase()
  const plainPassword = String(password)

  try {
    const user = await auth.createUser({
      email: normalizedEmail,
      password: plainPassword,
    })
    return { user, created: true }
  } catch (err) {
    if (err.code !== 'auth/email-already-exists') {
      throw mapFirebaseAdminError(err)
    }
    const existing = await auth.getUserByEmail(normalizedEmail)
    await auth.updateUser(existing.uid, { password: plainPassword })
    return { user: existing, created: false }
  }
}

async function deleteFirebaseUserByUid(uid) {
  if (!uid || !isFirebaseAdminConfigured()) return
  try {
    await getFirebaseAdmin().auth().deleteUser(uid)
  } catch (err) {
    if (err?.code === 'auth/user-not-found') return
    console.error('[firebase] delete user failed:', err.message)
  }
}

async function updateFirebaseUserPassword({ email, password }) {
  if (!isFirebaseAdminConfigured()) {
    const err = new Error('Firebase Admin is not configured.')
    err.status = 503
    throw err
  }

  const normalizedEmail = String(email).trim().toLowerCase()
  const plainPassword = String(password)

  if (plainPassword.length < 6) {
    const err = new Error('Password must be at least 6 characters.')
    err.status = 400
    throw err
  }

  const auth = getFirebaseAdmin().auth()

  try {
    const user = await auth.getUserByEmail(normalizedEmail)
    await auth.updateUser(user.uid, { password: plainPassword })
  } catch (err) {
    if (err?.code === 'auth/user-not-found') {
      const notFound = new Error(
        'No Firebase login exists for this email. Re-create the account or add the user in Firebase Console.',
      )
      notFound.status = 404
      throw notFound
    }
    throw mapFirebaseAdminError(err)
  }
}

module.exports = {
  isFirebaseAdminConfigured,
  verifyFirebaseIdToken,
  createOrUpdateFirebaseUser,
  updateFirebaseUserPassword,
  deleteFirebaseUserByUid,
}
