// Firestore collection names
export const COLLECTIONS = {
  JOBS: 'jobs',
} as const;

// Default configuration values
export const DEFAULT_CONFIG = {
  PAGE_SIZE: 20,
  MAX_BATCH_OPERATIONS: 500,
} as const;

// Error messages mapping
export const ERROR_MESSAGES = {
  PERMISSION_DENIED: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested job was not found.',
  ALREADY_EXISTS: 'A job with this information already exists.',
  FAILED_PRECONDITION: 'The operation failed due to a precondition.',
  UNAVAILABLE: 'The service is currently unavailable. Please try again later.',
  INVALID_INPUT: 'Invalid input provided.',
  INVALID_DATA: 'Invalid data format.',
  UNKNOWN: 'An unexpected error occurred.',
} as const;

// Validation messages
export const VALIDATION_MESSAGES = {
  USER_ID_REQUIRED: 'User ID is required.',
  JOB_ID_REQUIRED: 'Job ID is required.',
  TITLE_REQUIRED: 'Job title is required.',
  COMPANY_REQUIRED: 'Company name is required.',
  LINK_REQUIRED: 'Job link is required.',
  STATUS_REQUIRED: 'Job status is required.',
  EMPTY_DOCUMENT: 'Document data is empty.',
  MISSING_FIELDS: 'Document is missing required fields:',
  BATCH_LIMIT_EXCEEDED: 'Batch operations are limited to 500 operations at a time.',
  CREATE_DATA_REQUIRED: 'Create operation requires data.',
  UPDATE_DATA_REQUIRED: 'Update operation requires id and updates.',
  DELETE_ID_REQUIRED: 'Delete operation requires id.',
  UNKNOWN_OPERATION: 'Unknown operation type:',
} as const;

// Required fields for job documents
export const REQUIRED_JOB_FIELDS = [
  'userId',
  'title', 
  'company',
  'link',
  'status',
  'createdAt',
  'updatedAt'
] as const;
