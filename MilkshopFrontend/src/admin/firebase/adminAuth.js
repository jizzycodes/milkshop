import { signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";
import { getAdminFirebaseAuth } from "./config";

export async function signInAdmin(email, password) {
  const auth = getAdminFirebaseAuth();
  const credential = await signInWithEmailAndPassword(
    auth,
    String(email).trim(),
    String(password),
  );
  const token = await credential.user.getIdToken();
  return {
    token,
    profile: {
      email: credential.user.email,
      username: credential.user.email,
    },
  };
}

export async function signOutAdmin() {
  await signOut(getAdminFirebaseAuth());
}

export async function sendAdminPasswordReset(email) {
  const auth = getAdminFirebaseAuth();
  await sendPasswordResetEmail(auth, String(email).trim());
}

export function mapFirebaseAuthError(err) {
  const code = err?.code || "";
  switch (code) {
    case "auth/invalid-email":
    case "auth/missing-email":
      return "Please enter a valid email address.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Invalid email or password.";
    default:
      return err?.message || "Unable to sign in. Please try again.";
  }
}
