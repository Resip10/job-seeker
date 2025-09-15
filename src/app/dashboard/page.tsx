'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { PrivateLayout } from '@/components/layouts/PrivateLayout';
import { AppLayout } from '@/components/layouts/AppLayout';
import { JobsProvider, useJobs } from '@/contexts/JobsContext';
import { ProfileProvider, useProfile } from '@/contexts/ProfileContext';
import { SummaryCard } from '@/components/dashboard/SummaryCard';
import { OverviewSection } from '@/components/dashboard/OverviewSection';
import { ProfileCompletionCard } from '@/components/dashboard/ProfileCompletionCard';
import { useStatusCounts } from '@/components/dashboard/hooks/useStatusCounts';
import { useUserName } from '@/components/dashboard/hooks/useUserName';
import { formatWeekdayDate, getTimeOfDay } from '@/lib/utils/date';

function DashboardContent() {
  const { userProfile } = useProfile();
  const { error } = useJobs();
  const statusCounts = useStatusCounts();
  const userName = useUserName();

  return (
    <AppLayout>
      <div className='h-full bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100'>
        {/* Main Content */}
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='space-y-4'>
            {/* Welcome Section */}
            <div>
              {/* Date and Greeting Row */}
              <div className='mb-4'>
                <div className='text-sm text-text-light mb-1'>
                  {formatWeekdayDate()}
                </div>
                <h1 className='text-3xl font-bold text-text-dark'>
                  Good {getTimeOfDay()}, {userName}
                </h1>
                <p className='text-text-medium mt-1'>
                  Welcome to your job search dashboard
                </p>
              </div>
            </div>

            {/* Profile Completion Card */}
            <ProfileCompletionCard userProfile={userProfile} />

            {/* Error Display */}
            {error && (
              <Alert variant='destructive'>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Overview Section */}
            <OverviewSection userProfile={userProfile} />

            {/* Summary Card */}
            <SummaryCard statusCounts={statusCounts} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default function DashboardPage() {
  return (
    <PrivateLayout>
      <ProfileProvider>
        <JobsProvider>
          <DashboardContent />
        </JobsProvider>
      </ProfileProvider>
    </PrivateLayout>
  );
}
