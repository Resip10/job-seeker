/**
 * Common form validation utilities
 */

export const validateRequired = (
  value: string,
  fieldName: string
): string | null => {
  if (!value?.trim()) {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  return null;
};

export const validatePasswordMatch = (
  password: string,
  confirmPassword: string
): string | null => {
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return null;
};

export const validateUrl = (url: string): string | null => {
  try {
    new URL(url);
    return null;
  } catch {
    return 'Please enter a valid URL';
  }
};

/**
 * Common form field change handler
 */
export const createFieldChangeHandler = <T extends Record<string, unknown>>(
  setFormData: React.Dispatch<React.SetStateAction<T>>,
  setError?: React.Dispatch<React.SetStateAction<string>>
) => {
  return (field: keyof T, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (setError) setError('');
  };
};
