'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, X } from 'lucide-react';
import { ProfileHeader } from './ProfileHeader';
import { ExperienceSection } from './ExperienceSection';
import { EducationSection } from './EducationSection';
import { SkillsSection } from './SkillsSection';
import { SocialLinksSection } from './SocialLinksSection';
import { ResumeSection } from './ResumeSection';
import { ProfileLinksSection } from './ProfileLinksSection';

export function ProfilePageContent() {
  const { user } = useAuth();
  const { userProfile, loading, error, clearError } = useProfile();

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-primary' />
      </div>
    );
  }

  return (
    <div className='h-full bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header Section */}
        <div className='mb-6'>
          <div>
            <h1 className='text-3xl font-bold text-text-dark'>Profile</h1>
            <p className='text-text-medium mt-1'>
              Manage your personal and professional information
            </p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant='destructive' className='mb-6'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription className='flex-1'>{error}</AlertDescription>
            <button
              onClick={clearError}
              className='ml-auto text-destructive-foreground hover:text-destructive-foreground/80 transition-colors cursor-pointer'
              aria-label='Close error'
            >
              <X className='h-4 w-4' />
            </button>
          </Alert>
        )}

        {/* Profile Header */}
        <ProfileHeader userProfile={userProfile} user={user} />

        {/* Main Content */}
        <div className='space-y-6 mt-6'>
          <SkillsSection userProfile={userProfile} />

          <ExperienceSection userProfile={userProfile} />

          <EducationSection userProfile={userProfile} />

          <SocialLinksSection userProfile={userProfile} />

          <ResumeSection userProfile={userProfile} />

          <ProfileLinksSection userProfile={userProfile} />
        </div>
      </div>
    </div>
  );
}
