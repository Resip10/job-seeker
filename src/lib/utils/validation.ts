/**
 * Generic validation utilities that can be used across the entire application
 * These are not specific to any domain or service
 */

/**
 * Generic string validation utility
 */
export const validateRequiredString = (
  value: string | undefined,
  fieldName: string
): void => {
  if (!value?.trim()) {
    throw new Error(`${fieldName} is required.`);
  }
};

/**
 * Generic email validation
 */
export const validateEmail = (email: string): void => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Please enter a valid email address.');
  }
};

/**
 * Generic URL validation
 */
export const validateUrl = (url: string): void => {
  try {
    new URL(url);
  } catch {
    throw new Error('Please enter a valid URL.');
  }
};

/**
 * Sanitizes string input by trimming whitespace
 */
export const sanitizeString = (value: string | undefined): string => {
  return value?.trim() || '';
};

/**
 * Validates pagination parameters
 */
export const validatePagination = (limit?: number, offset?: number): void => {
  if (limit !== undefined && (limit < 1 || limit > 1000)) {
    throw new Error('Limit must be between 1 and 1000.');
  }

  if (offset !== undefined && offset < 0) {
    throw new Error('Offset must be non-negative.');
  }
};

/**
 * Validates that a value is not null or undefined
 */
export const validateRequired = (value: unknown, fieldName: string): void => {
  if (value === null || value === undefined) {
    throw new Error(`${fieldName} is required.`);
  }
};

/**
 * Validates that a string has minimum length
 */
export const validateMinLength = (
  value: string,
  minLength: number,
  fieldName: string
): void => {
  if (value.length < minLength) {
    throw new Error(
      `${fieldName} must be at least ${minLength} characters long.`
    );
  }
};

/**
 * Validates that a string has maximum length
 */
export const validateMaxLength = (
  value: string,
  maxLength: number,
  fieldName: string
): void => {
  if (value.length > maxLength) {
    throw new Error(
      `${fieldName} must be no more than ${maxLength} characters long.`
    );
  }
};
