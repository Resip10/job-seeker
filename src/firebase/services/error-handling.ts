import { FirestoreError, FirestoreErrorCode } from './types';
import { ERROR_MESSAGES } from './constants';

/**
 * Error handling utility for Firestore operations
 * Maps common Firestore errors to user-friendly messages
 */
export const handleFirestoreError = (error: unknown, operation: string): never => {
  console.error(`Firestore ${operation} error:`, error);
  
  if (error instanceof Error) {
    // Map common Firestore errors to user-friendly messages
    switch (error.message) {
      case FirestoreErrorCode.PERMISSION_DENIED:
        throw new FirestoreError(
          ERROR_MESSAGES.PERMISSION_DENIED,
          FirestoreErrorCode.PERMISSION_DENIED,
          error
        );
      case FirestoreErrorCode.NOT_FOUND:
        throw new FirestoreError(
          ERROR_MESSAGES.NOT_FOUND,
          FirestoreErrorCode.NOT_FOUND,
          error
        );
      case FirestoreErrorCode.ALREADY_EXISTS:
        throw new FirestoreError(
          ERROR_MESSAGES.ALREADY_EXISTS,
          FirestoreErrorCode.ALREADY_EXISTS,
          error
        );
      case FirestoreErrorCode.FAILED_PRECONDITION:
        throw new FirestoreError(
          ERROR_MESSAGES.FAILED_PRECONDITION,
          FirestoreErrorCode.FAILED_PRECONDITION,
          error
        );
      case FirestoreErrorCode.UNAVAILABLE:
        throw new FirestoreError(
          ERROR_MESSAGES.UNAVAILABLE,
          FirestoreErrorCode.UNAVAILABLE,
          error
        );
      default:
        throw new FirestoreError(
          `An error occurred during ${operation}. Please try again.`,
          FirestoreErrorCode.UNKNOWN,
          error
        );
    }
  }
  
  throw new FirestoreError(
    `An unexpected error occurred during ${operation}.`,
    FirestoreErrorCode.UNKNOWN,
    error
  );
};
