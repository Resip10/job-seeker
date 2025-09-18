'use client';

import { useState } from 'react';
import { PrivateLayout } from '@/components/layouts/PrivateLayout';
import { AppLayout } from '@/components/layouts/AppLayout';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { Brain } from 'lucide-react';
import {
  analyzeJobDescription,
  JobAnalysisResponse,
} from '@/firebase/services';
import { JobInputForm } from './components/JobInputForm';
import { AnalysisResults } from './components/AnalysisResults';

function AIAnalysisContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<JobAnalysisResponse | null>(null);

  const handleJobSubmit = async (jobDescription: string) => {
    if (!jobDescription.trim()) {
      setError('Please enter a job description');

      return;
    }

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const data = await analyzeJobDescription(jobDescription);
      setResponse(data);
      setError(null);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error calling Firebase function:', err);
      }
      setError(
        err instanceof Error ? err.message : 'Failed to analyze job description'
      );
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

            {/* Job Input Form */}
            <JobInputForm
              onSubmit={handleJobSubmit}
              isLoading={isLoading}
              error={error}
            />

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
