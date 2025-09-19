'use client';

import { PrivateLayout } from '@/components/layouts/PrivateLayout';
import { JobsProvider } from '@/contexts/JobsContext';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { ApplicationsPageContent } from './components/ApplicationsPageContent';

export default function ApplicationsPage() {
  return (
    <PrivateLayout>
      <ProfileProvider>
        <JobsProvider>
          <ApplicationsPageContent />
        </JobsProvider>
      </ProfileProvider>
    </PrivateLayout>
  );
}
