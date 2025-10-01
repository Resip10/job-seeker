'use client';

import { useState } from 'react';
import { Brain, AlertCircle } from 'lucide-react';
import {
  analyzeJobDescription,
  JobAnalysisResponse,
} from '@/firebase/services';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AppLayout } from '@/components/layouts/AppLayout';
import { showToast, showErrorToast } from '@/lib/toast';
import { useAuth } from '@/contexts/AuthContext';
import { JobInputForm } from './JobInputForm';
import { AnalysisResults } from './AnalysisResults';
import { TokenUsageDisplay } from './TokenUsageDisplay';

export function AIAnalysisPageContent() {
  const { user, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<JobAnalysisResponse | null>(null);

  const handleJobSubmit = async (jobDescription: string) => {
    if (!jobDescription.trim()) {
      showToast.warning('Please enter a job description');

      return;
    }

    if (!user) {
      showToast.error(
        'Authentication Required',
        'Please log in to use AI analysis'
      );

      return;
    }

    setIsLoading(true);
    setResponse(null);

    setError(null);

    const loadingToast = showToast.loading('Analyzing job description...');

    try {
      console.log('🚀 Starting AI analysis request...');
      const startTime = Date.now();
      const data = await analyzeJobDescription(jobDescription);
      const endTime = Date.now();

      console.log('✅ AI analysis completed:', {
        duration: `${endTime - startTime}ms`,
        responseKeys: Object.keys(data),
        jobDescriptionLength: jobDescription.length,
      });

      setResponse(data);
      showToast.dismiss(loadingToast);
      showToast.success('Analysis complete!', 'Your job analysis is ready.');
    } catch (err) {
      showToast.dismiss(loadingToast);
      if (process.env.NODE_ENV === 'development') {
        console.error('Error calling Firebase function:', err);
      }

      const error = err as Error;
      const errorMessage = error.message || 'Failed to analyze job description';

      // Handle token limit errors specifically
      if (
        errorMessage.includes('token limit') ||
        errorMessage.includes('resource-exhausted')
      ) {
        setError(errorMessage);
        showToast.error('Token Limit Reached', errorMessage);
      } else if (
        errorMessage.includes('network') ||
        errorMessage.includes('timeout') ||
        errorMessage.includes('unavailable')
      ) {
        setError(
          `AI Analysis Service Issue: ${errorMessage}. Please try again later.`
        );
      } else {
        showErrorToast(err, errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <AppLayout>
        <div className='h-full bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <div className='flex items-center justify-center h-64'>
              <div className='text-center'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4'></div>
                <p className='text-text-medium'>Loading...</p>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <AppLayout>
        <div className='h-full bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <div className='text-center'>
              <Brain className='w-16 h-16 text-blue-600 mx-auto mb-4' />
              <h1 className='text-3xl font-bold text-text-dark mb-2'>
                AI Job Analysis
              </h1>
              <p className='text-text-medium mb-6'>
                Please log in to access AI-powered job analysis
              </p>
              <Alert>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription>
                  Authentication is required to use this feature. Please log in
                  to continue.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className='h-full bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
            {/* Main content */}
            <div className='lg:col-span-3 space-y-6'>
              <div>
                <div className='flex items-start justify-between mb-4'>
                  <div>
                    <h1 className='text-3xl font-bold text-text-dark flex items-center gap-3'>
                      <Brain className='w-8 h-8 text-blue-600' />
                      AI Job Analysis
                    </h1>
                    <p className='text-text-medium mt-1'>
                      Get AI-powered insights on job opportunities and market
                      trends
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <Alert variant='destructive'>
                  <AlertCircle className='h-4 w-4' />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <JobInputForm onSubmit={handleJobSubmit} isLoading={isLoading} />

              {response && <AnalysisResults response={response} />}
            </div>

            {/* Sidebar with token usage */}
            <div className='lg:col-span-1'>
              <TokenUsageDisplay />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
