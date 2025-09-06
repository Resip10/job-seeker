import { DocumentSnapshot, QueryConstraint, where, orderBy, limit, startAfter } from "firebase/firestore";
import { IJobDoc, IJobQueryOptions, FirestoreError, FirestoreErrorCode } from '@/firebase/services/types';
import { VALIDATION_MESSAGES, REQUIRED_JOB_FIELDS } from '@/firebase/services/constants';

/**
 * Type-safe document data extraction with validation
 */
export const extractJobData = (doc: DocumentSnapshot): IJobDoc => {
  const data = doc.data();
  if (!data) {
    throw new FirestoreError(VALIDATION_MESSAGES.EMPTY_DOCUMENT, FirestoreErrorCode.INVALID_DATA);
  }
  
  // Validate required fields exist
  const missingFields = REQUIRED_JOB_FIELDS.filter((field: string) => !(field in data));
  
  if (missingFields.length > 0) {
    throw new FirestoreError(
      `${VALIDATION_MESSAGES.MISSING_FIELDS} ${missingFields.join(', ')}`,
      FirestoreErrorCode.INVALID_DATA
    );
  }
  
  return { id: doc.id, ...data } as IJobDoc;
};

/**
 * Builds query constraints based on options
 */
export const buildQueryConstraints = (userId: string, options: IJobQueryOptions = {}): QueryConstraint[] => {
    const constraints: QueryConstraint[] = [where("userId", "==", userId)];
  
  // Apply filters
  if (options.filters?.status) {
    constraints.push(where("status", "==", options.filters.status));
  }
  if (options.filters?.company) {
    constraints.push(where("company", "==", options.filters.company));
  }
  
  // Apply ordering
  const orderField = options.orderBy || 'createdAt';
  const orderDirection = options.orderDirection || 'desc';
  constraints.push(orderBy(orderField, orderDirection));
  
  // Apply pagination
  if (options.limit) {
    constraints.push(limit(options.limit));
  }
  if (options.startAfter) {
    constraints.push(startAfter(options.startAfter));
  }
  
  return constraints;
};

/**
 * Safely extracts job data from multiple documents, skipping invalid ones
 */
export const extractJobsFromSnapshot = (querySnapshot: { forEach: (callback: (doc: DocumentSnapshot) => void) => void }): IJobDoc[] => {
  const jobs: IJobDoc[] = [];
  
  querySnapshot.forEach((doc: DocumentSnapshot) => {
    try {
      jobs.push(extractJobData(doc));
    } catch (error) {
      console.warn(`Skipping invalid document ${doc.id}:`, error);
    }
  });
  
  return jobs;
};

/**
 * Validates batch operation data
 */
export const validateBatchOperation = (operation: { type: string; data?: unknown; id?: string; updates?: unknown }): void => {
  switch (operation.type) {
    case 'create':
      if (!operation.data) {
        throw new FirestoreError(VALIDATION_MESSAGES.CREATE_DATA_REQUIRED, FirestoreErrorCode.INVALID_INPUT);
      }
      break;
    case 'update':
      if (!operation.id || !operation.updates) {
        throw new FirestoreError(VALIDATION_MESSAGES.UPDATE_DATA_REQUIRED, FirestoreErrorCode.INVALID_INPUT);
      }
      break;
    case 'delete':
      if (!operation.id) {
        throw new FirestoreError(VALIDATION_MESSAGES.DELETE_ID_REQUIRED, FirestoreErrorCode.INVALID_INPUT);
      }
      break;
    default:
      throw new FirestoreError(
        `${VALIDATION_MESSAGES.UNKNOWN_OPERATION} ${operation.type}`,
        FirestoreErrorCode.INVALID_INPUT
      );
  }
};

/**
 * Creates a query for finding a document by ID
 */
export const createIdQuery = (collectionName: string, docId: string) => {
  return where("__name__", "==", docId);
};

/**
 * Checks if a query snapshot is empty
 */
export const isQueryEmpty = (querySnapshot: { empty: boolean }): boolean => {
  return querySnapshot.empty;
};

/**
 * Gets the first document from a query snapshot
 */
export const getFirstDocument = (querySnapshot: { docs: DocumentSnapshot[] }): DocumentSnapshot | null => {
  return querySnapshot.docs.length > 0 ? querySnapshot.docs[0] : null;
};

/**
 * Gets the size of a query snapshot
 */
export const getQuerySize = (querySnapshot: { size: number }): number => {
  return querySnapshot.size;
};
