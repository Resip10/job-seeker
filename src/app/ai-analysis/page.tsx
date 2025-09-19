'use client';

import { PrivateLayout } from '@/components/layouts/PrivateLayout';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { AIAnalysisPageContent } from './components/AIAnalysisPageContent';

export default function AIAnalysisPage() {
  return (
    <PrivateLayout>
      <ProfileProvider>
        <AIAnalysisPageContent />
      </ProfileProvider>
    </PrivateLayout>
  );
}
