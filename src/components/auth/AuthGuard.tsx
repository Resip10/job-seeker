'use client';

import { ReactNode } from 'react';
import { Brain, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';

interface AuthGuardProps {
  children: ReactNode;
  loadingComponent?: ReactNode;
  unauthenticatedComponent?: ReactNode;
}

export function AuthGuard({
  children,
  loadingComponent,
  unauthenticatedComponent,
}: AuthGuardProps) {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <>
        {loadingComponent || (
          <div className='flex items-center justify-center h-64'>
            <div className='text-center'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4'></div>
              <p className='text-text-medium'>Loading...</p>
            </div>
          </div>
        )}
      </>
    );
  }

  if (!user) {
    return (
      <>
        {unauthenticatedComponent || (
          <div className='text-center'>
            <Brain className='w-16 h-16 text-blue-600 mx-auto mb-4' />
            <h1 className='text-3xl font-bold text-text-dark mb-2'>
              Authentication Required
            </h1>
            <p className='text-text-medium mb-6'>
              Please log in to access this feature
            </p>
            <Alert>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>
                Authentication is required to use this feature. Please log in to
                continue.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </>
    );
  }

  return <>{children}</>;
}
