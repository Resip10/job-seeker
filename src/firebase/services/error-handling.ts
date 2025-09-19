import { showErrorToast } from '@/lib/toast';

export const handleError = (
  error: unknown,
  operation: string,
  showToast = false
): never => {
  console.error(`${operation} error:`, error);

  const errorMessage =
    error instanceof Error
      ? `${operation} failed: ${error.message}`
      : `${operation} failed: Unknown error`;

  if (showToast) {
    showErrorToast(new Error(errorMessage));
  }

  throw new Error(errorMessage);
};
