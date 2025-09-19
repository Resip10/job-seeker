'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Plus } from 'lucide-react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { useJobs } from '@/contexts/JobsContext';
import { JobList } from './JobList';
import { JobForm } from './JobForm';
import { SummaryCard } from '@/components/application-status/SummaryCard';
import { useStatusCounts } from '@/components/application-status/hooks/useStatusCounts';
import { IJobDoc } from '@/firebase/services/types';

export function ApplicationsPageContent() {
  const { jobs, loading, error, addJob, updateJobById, deleteJobById } =
    useJobs();
  const [showJobForm, setShowJobForm] = useState(false);
  const statusCounts = useStatusCounts();

  const handleAddJob = async (
    jobData: Omit<IJobDoc, 'id' | 'createdAt' | 'updatedAt' | 'userId'>
  ) => {
    await addJob(jobData);
    setShowJobForm(false);
  };

  return (
    <AppLayout>
      <div className='h-full bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='space-y-4'>
            <div>
              <div className='flex items-start justify-between mb-4'>
                <div>
                  <h1 className='text-3xl font-bold text-text-dark'>
                    Job Applications
                  </h1>
                  <p className='text-text-medium mt-1'>
                    Track and manage your job applications
                  </p>
                </div>
                <Button
                  size='sm'
                  className='h-9 cursor-pointer'
                  onClick={() => setShowJobForm(true)}
                >
                  <Plus className='w-4 h-4 mr-2' />
                  Add Application
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant='destructive'>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <SummaryCard statusCounts={statusCounts} />

            <JobList
              jobs={jobs}
              onAddJob={addJob}
              onUpdateJob={updateJobById}
              onDeleteJob={deleteJobById}
              isLoading={loading}
            />
          </div>

          {showJobForm && (
            <div className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50'>
              <div className='w-full max-w-4xl max-h-[90vh] overflow-y-auto'>
                <JobForm
                  onSave={handleAddJob}
                  onCancel={() => setShowJobForm(false)}
                  isLoading={loading}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
