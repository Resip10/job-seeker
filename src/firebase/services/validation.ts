import { FirestoreError, FirestoreErrorCode, IJobData } from './types';
import { VALIDATION_MESSAGES, REQUIRED_JOB_FIELDS } from './constants';

/**
 * Validates job data before database operations
 */
export const validateJobData = (job: Omit<IJobData, 'createdAt' | 'updatedAt'>): void => {
  if (!job.title?.trim()) {
    throw new FirestoreError(VALIDATION_MESSAGES.TITLE_REQUIRED, FirestoreErrorCode.INVALID_INPUT);
  }
  if (!job.company?.trim()) {
    throw new FirestoreError(VALIDATION_MESSAGES.COMPANY_REQUIRED, FirestoreErrorCode.INVALID_INPUT);
  }
  if (!job.link?.trim()) {
    throw new FirestoreError(VALIDATION_MESSAGES.LINK_REQUIRED, FirestoreErrorCode.INVALID_INPUT);
  }
  if (!job.status?.trim()) {
    throw new FirestoreError(VALIDATION_MESSAGES.STATUS_REQUIRED, FirestoreErrorCode.INVALID_INPUT);
  }
};

/**
 * Validates job ID before database operations
 */
export const validateJobId = (jobId: string): void => {
  if (!jobId?.trim()) {
    throw new FirestoreError(VALIDATION_MESSAGES.JOB_ID_REQUIRED, FirestoreErrorCode.INVALID_INPUT);
  }
};

/**
 * Validates user ID before database operations
 */
export const validateUserId = (userId: string): void => {
  if (!userId?.trim()) {
    throw new FirestoreError(VALIDATION_MESSAGES.USER_ID_REQUIRED, FirestoreErrorCode.INVALID_INPUT);
  }
};

/**
 * Validates batch operation limits
 */
export const validateBatchOperations = (operations: unknown[]): void => {
  if (operations.length === 0) {
    return;
  }
  
  if (operations.length > 500) {
    throw new FirestoreError(
      VALIDATION_MESSAGES.BATCH_LIMIT_EXCEEDED,
      FirestoreErrorCode.INVALID_INPUT
    );
  }
};

/**
 * Validates that required fields exist in an object
 */
export const validateRequiredFields = (data: Record<string, unknown>, requiredFields: readonly string[]): void => {
  const missingFields = requiredFields.filter(field => !(field in data));
  
  if (missingFields.length > 0) {
    throw new FirestoreError(
      `${VALIDATION_MESSAGES.MISSING_FIELDS} ${missingFields.join(', ')}`,
      FirestoreErrorCode.INVALID_DATA
    );
  }
};
