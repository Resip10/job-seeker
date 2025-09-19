'use client';

import { PrivateLayout } from '@/components/layouts/PrivateLayout';
import { JobsProvider } from '@/contexts/JobsContext';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { DashboardPageContent } from './components/DashboardPageContent';

export default function DashboardPage() {
  return (
    <PrivateLayout>
      <ProfileProvider>
        <JobsProvider>
          <DashboardPageContent />
        </JobsProvider>
      </ProfileProvider>
    </PrivateLayout>
  );
}
