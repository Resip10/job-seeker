import { useState, useCallback } from 'react';

interface UseFormOptions<T> {
  initialValues: T;
  onSubmit: (values: T) => Promise<void> | void;
  validate?: (values: T) => Record<keyof T, string> | null;
}

export function useForm<T extends Record<string, unknown>>({
  initialValues,
  onSubmit,
  validate,
}: UseFormOptions<T>) {
  const [formData, setFormData] = useState<T>(initialValues);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = useCallback(
    (field: keyof T, value: unknown) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      if (error) {
        setError('');
      }
    },
    [error]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');

      try {
        // Validate if validator provided
        if (validate) {
          const validationErrors = validate(formData);
          if (validationErrors) {
            const firstError = Object.values(validationErrors).find(Boolean);
            if (firstError) {
              setError(firstError);

              return;
            }
          }
        }

        await onSubmit(formData);
      } catch (err: unknown) {
        const error = err as Error;
        setError(error.message || 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    },
    [formData, onSubmit, validate]
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
