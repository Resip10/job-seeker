import { Timestamp, DocumentSnapshot } from "firebase/firestore";

// Core job data interfaces
export interface IJobData {
  userId: string;
  title: string;
  company: string;
  link: string;
  status: string;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface IJobDoc extends IJobData {
  id: string;
}

// Query and filter interfaces
export interface IJobFilters {
  status?: string;
  company?: string;
}

export interface IJobQueryOptions {
  filters?: IJobFilters;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  limit?: number;
  startAfter?: DocumentSnapshot;
}

// Batch operation interfaces
export interface IJobBatchOperation {
  type: 'create' | 'update' | 'delete';
  data?: Omit<IJobData, 'createdAt' | 'updatedAt'>;
  id?: string;
  updates?: Partial<IJobData>;
}

// Error handling
export class FirestoreError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'FirestoreError';
  }
}

// Error codes enum for better type safety
export enum FirestoreErrorCode {
  PERMISSION_DENIED = 'permission-denied',
  NOT_FOUND = 'not-found',
  ALREADY_EXISTS = 'already-exists',
  FAILED_PRECONDITION = 'failed-precondition',
  UNAVAILABLE = 'unavailable',
  INVALID_INPUT = 'invalid-input',
  INVALID_DATA = 'invalid-data',
  UNKNOWN = 'unknown'
}
