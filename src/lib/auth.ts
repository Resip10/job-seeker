import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User, UserCredential, AuthError} from "firebase/auth";
import {auth} from "@/firebase/config";

export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  agreeToMarketing: boolean;
}

export interface LoginData {
  email: string;
  password: string;
  rememberMe: boolean;
}

// Sign up with email and password
export const signUpWithEmail = async (signupData: SignupData): Promise<UserCredential> => {
  try {
    const { email, password } = signupData;
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (error: unknown) {
    const authError = error as AuthError;
    throw new Error(getAuthErrorMessage(authError.code));
  }
};

// Sign in with email and password
export const signInWithEmail = async (loginData: LoginData): Promise<UserCredential> => {
  try {
    const { email, password } = loginData;
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error: unknown) {
    const authError = error as AuthError;
    throw new Error(getAuthErrorMessage(authError.code));
  }
};

// Sign out
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: unknown) {
    console.error("Sign out error:", error);
    throw new Error("Failed to sign out. Please try again.");
  }
};

// Get current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Helper function to get user-friendly error messages
const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case "auth/email-already-in-use":
      return "An account with this email already exists. Please sign in instead.";
    case "auth/weak-password":
      return "Password should be at least 6 characters long.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-not-found":
      return "No account found with this email address.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error. Please check your connection and try again.";
    default:
      return "An error occurred. Please try again.";
  }
};
