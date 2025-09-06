/**
 * Generic error handling utilities that can be used across the entire application
 * These are not specific to any domain or service
 */

/**
 * Generic error handling utility for any service
 * Can be extended for other services beyond Firestore
 */
export const handleServiceError = (
  error: unknown, 
  operation: string, 
  serviceName: string = 'Service'
): never => {
  console.error(`${serviceName} ${operation} error:`, error);
  
  if (error instanceof Error) {
    throw new Error(`${serviceName} ${operation} failed: ${error.message}`);
  }
  
  throw new Error(`An unexpected error occurred during ${serviceName} ${operation}.`);
};

/**
 * Creates a standardized error response
 */
export const createErrorResponse = (message: string, code: string, details?: unknown) => ({
  success: false,
  error: {
    message,
    code,
    details,
    timestamp: new Date().toISOString(),
  }
});

/**
 * Creates a standardized success response
 */
export const createSuccessResponse = (data: unknown, message?: string) => ({
  success: true,
  data,
  message,
  timestamp: new Date().toISOString(),
});

/**
 * Checks if an error is a specific type
 */
export const isError = (error: unknown): error is Error => {
  return error instanceof Error;
};

/**
 * Extracts error message from various error types
 */
export const getErrorMessage = (error: unknown): string => {
  if (isError(error)) {
    return error.message;
  }
  return 'An unknown error occurred';
};

/**
 * Wraps an async function with error handling
 */
export const withErrorHandling = async <T>(
  fn: () => Promise<T>,
  operation: string,
  serviceName: string = 'Service'
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    return handleServiceError(error, operation, serviceName);
  }
};