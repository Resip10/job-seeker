'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { useJobs } from '@/contexts/JobsContext';
import { useProfile } from '@/contexts/ProfileContext';
import { SummaryCard } from '@/components/application-status/SummaryCard';
import { OverviewSection } from './OverviewSection';
import { ProfileCompletionCard } from './ProfileCompletionCard';
import { useStatusCounts } from '@/components/application-status/hooks/useStatusCounts';
import { useUserName } from './hooks/useUserName';
import { formatWeekdayDate, getTimeOfDay } from '@/lib/utils/date';

export function DashboardPageContent() {
  const { userProfile, loading: profileLoading } = useProfile();
  const { error, loading: jobsLoading } = useJobs();
  const statusCounts = useStatusCounts();
  const userName = useUserName();

  return (
    <AppLayout>
      <div className='h-full bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='space-y-4'>
            <div>
              <div className='mb-4'>
                <div className='text-sm text-text-light mb-1'>
                  {formatWeekdayDate()}
                </div>
                <h1 className='text-3xl font-bold text-text-dark'>
                  Good {getTimeOfDay()},{' '}
                  {profileLoading ? (
                    <Skeleton className='inline-block h-8 w-20' />
                  ) : (
                    userName
                  )}
                </h1>
                <p className='text-text-medium mt-1'>
                  Welcome to your job search dashboard
                </p>
              </div>
            </div>

            <ProfileCompletionCard userProfile={userProfile} />

            {error && (
              <Alert variant='destructive'>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <OverviewSection userProfile={userProfile} />

            <SummaryCard statusCounts={statusCounts} loading={jobsLoading} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
