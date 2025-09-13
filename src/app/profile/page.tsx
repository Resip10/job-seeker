'use client';

import { PrivateLayout } from '@/components/layouts/PrivateLayout';
import { AppLayout } from '@/components/layouts/AppLayout';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { ProfilePageContent } from '@/components/profile/ProfilePageContent';

export default function ProfilePage() {
  return (
    <PrivateLayout>
      <ProfileProvider>
        <AppLayout>
          <ProfilePageContent />
        </AppLayout>
      </ProfileProvider>
    </PrivateLayout>
  );
}
