import { toast } from 'sonner';

/**
 * Utility functions for displaying toast notifications
 */
export const showToast = {
  /**
   * Show a success toast
   */
  success: (message: string, description?: string) => {
    toast.success(message, {
      description,
      duration: 4000,
    });
  },

  /**
   * Show an error toast
   */
  error: (message: string, description?: string) => {
    toast.error(message, {
      description,
      duration: 6000,
    });
  },

  /**
   * Show an info toast
   */
  info: (message: string, description?: string) => {
    toast.info(message, {
      description,
      duration: 4000,
    });
  },

  /**
   * Show a warning toast
   */
  warning: (message: string, description?: string) => {
    toast.warning(message, {
      description,
      duration: 5000,
    });
  },

  /**
   * Show a loading toast that can be updated
   */
  loading: (message: string) => {
    return toast.loading(message);
  },

  /**
   * Dismiss a specific toast
   */
  dismiss: (toastId: string | number) => {
    toast.dismiss(toastId);
  },

  /**
   * Dismiss all toasts
   */
  dismissAll: () => {
    toast.dismiss();
  },
};

/**
 * Helper to show error from caught exceptions
 */
export const showErrorToast = (
  error: unknown,
  fallbackMessage = 'An error occurred'
) => {
  const message = error instanceof Error ? error.message : fallbackMessage;
  showToast.error('Error', message);
};

/**
 * Helper for Firebase Auth errors with user-friendly messages
 */
export const showAuthErrorToast = (errorCode: string) => {
  const getAuthErrorMessage = (code: string): string => {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'An account with this email already exists. Please sign in instead.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection and try again.';
      default:
        return 'An authentication error occurred. Please try again.';
    }
  };

  showToast.error('Authentication Error', getAuthErrorMessage(errorCode));
};
