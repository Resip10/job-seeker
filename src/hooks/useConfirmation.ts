import { useCallback } from 'react';

interface UseConfirmationOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

export function useConfirmation({
  title: _title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText: _confirmText = 'Confirm',
  cancelText: _cancelText = 'Cancel',
}: UseConfirmationOptions = {}) {
  const confirm = useCallback(
    (customMessage?: string): Promise<boolean> => {
      return new Promise(resolve => {
        const result = window.confirm(customMessage || message);
        resolve(result);
      });
    },
    [message]
  );

  return { confirm };
}
