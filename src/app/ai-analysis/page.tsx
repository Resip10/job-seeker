'use client';

import { useState } from 'react';
import { PrivateLayout } from '@/components/layouts/PrivateLayout';
import { AppLayout } from '@/components/layouts/AppLayout';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { Brain, AlertCircle } from 'lucide-react';
import {
  analyzeJobDescription,
  JobAnalysisResponse,
} from '@/firebase/services';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { showToast, showErrorToast } from '@/lib/toast';
import { JobInputForm } from './components/JobInputForm';
import { AnalysisResults } from './components/AnalysisResults';

function AIAnalysisContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<JobAnalysisResponse | null>(null);

  const handleJobSubmit = async (jobDescription: string) => {
    if (!jobDescription.trim()) {
      showToast.warning('Please enter a job description');

      return;
    }

    setIsLoading(true);
    setResponse(null);
    setError(null);

    const loadingToast = showToast.loading('Analyzing job description...');

    try {
      const data = await analyzeJobDescription(jobDescription);
      setResponse(data);
      showToast.dismiss(loadingToast);
      showToast.success('Analysis complete!', 'Your job analysis is ready.');
    } catch (err) {
      showToast.dismiss(loadingToast);
      if (process.env.NODE_ENV === 'development') {
        console.error('Error calling Firebase function:', err);
      }

      // For AI analysis errors, show on page since it might be a service issue
      // that requires user to understand the limitation
      const error = err as Error;
      const errorMessage = error.message || 'Failed to analyze job description';

      if (
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

  return (
    <AppLayout>
      <div className='h-full bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100'>
        {/* Main Content */}
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='space-y-6'>
            {/* Header Section */}
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

            {/* Service Error Display */}
            {error && (
              <Alert variant='destructive'>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Job Input Form */}
            <JobInputForm onSubmit={handleJobSubmit} isLoading={isLoading} />

            {/* Analysis Response */}
            {response && <AnalysisResults response={response} />}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default function AIAnalysisPage() {
  return (
    <PrivateLayout>
      <ProfileProvider>
        <AIAnalysisContent />
      </ProfileProvider>
    </PrivateLayout>
  );
}
