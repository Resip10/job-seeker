import { useState, useCallback } from 'react';
import { showToast, showErrorToast } from '@/lib/toast';

interface UseFormOptions<T> {
  initialValues: T;
  onSubmit: (values: T) => Promise<void> | void;
  validate?: (values: T) => Record<keyof T, string> | null;
  useToasts?: boolean; // Whether to show toast notifications instead of setting error state
}

export function useForm<T extends Record<string, unknown>>({
  initialValues,
  onSubmit,
  validate,
  useToasts = false,
}: UseFormOptions<T>) {
  const [formData, setFormData] = useState<T>(initialValues);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = useCallback(
    (field: keyof T, value: unknown) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      if (!useToasts && error) {
        setError('');
      }
    },
    [error, useToasts]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);

      if (!useToasts) {
        setError('');
      }

      try {
        // Validate if validator provided
        if (validate) {
          const validationErrors = validate(formData);
          if (validationErrors) {
            const firstError = Object.values(validationErrors).find(Boolean);
            if (firstError) {
              if (useToasts) {
                showToast.warning('Validation Error', firstError);
              } else {
                setError(firstError);
              }

              return;
            }
          }
        }

        await onSubmit(formData);
      } catch (err: unknown) {
        const error = err as Error;
        const errorMessage = error.message || 'An error occurred';

        if (useToasts) {
          showErrorToast(error, errorMessage);
        } else {
          setError(errorMessage);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [formData, onSubmit, validate, useToasts]
  );

  const resetForm = useCallback(() => {
    setFormData(initialValues);
    setError('');
    setIsLoading(false);
  }, [initialValues]);

  return {
    formData,
    setFormData,
    isLoading,
    error,
    setError,
    handleInputChange,
    handleSubmit,
    resetForm,
  };
}
