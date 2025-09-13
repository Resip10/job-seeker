'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, X } from 'lucide-react';
import { UserProfileDoc } from '@/firebase/services/types';
import Link from 'next/link';

interface ProfileCompletionCardProps {
  userProfile: UserProfileDoc | null;
}

export function ProfileCompletionCard({
  userProfile,
}: ProfileCompletionCardProps) {
  const [isProfileProgressClosed, setIsProfileProgressClosed] = useState(false);

  // Calculate profile completion percentage
  const getProfileCompletion = () => {
    const sections = [
      userProfile?.firstName && userProfile?.lastName,
      userProfile?.bio,
      userProfile?.location,
      userProfile?.phone,
      userProfile?.website,
      userProfile?.experience && userProfile.experience.length > 0,
      userProfile?.education && userProfile.education.length > 0,
      userProfile?.skills && userProfile.skills.length > 0,
      userProfile?.resumeUrl,
    ];

    const completedSections = sections.filter(Boolean).length;
    return Math.round((completedSections / sections.length) * 100);
  };

  const completionPercentage = getProfileCompletion();

  // Load close state from localStorage on component mount
  useEffect(() => {
    const storedCloseState = localStorage.getItem('profile-progress-closed');
    if (storedCloseState === 'true') {
      setIsProfileProgressClosed(true);
    }
  }, []);

  // Reset close state when profile completion changes significantly
  useEffect(() => {
    const lastCompletion = localStorage.getItem('last-profile-completion');
    const currentCompletion = completionPercentage.toString();

    // If completion dropped significantly (more than 20%), show the progress again
    if (
      lastCompletion &&
      parseInt(lastCompletion) - completionPercentage > 20
    ) {
      setIsProfileProgressClosed(false);
      localStorage.removeItem('profile-progress-closed');
    }

    // Store current completion for next comparison
    localStorage.setItem('last-profile-completion', currentCompletion);
  }, [completionPercentage]);

  // Handle closing the profile progress section
  const handleCloseProfileProgress = () => {
    setIsProfileProgressClosed(true);
    localStorage.setItem('profile-progress-closed', 'true');
  };

  // Don't render if closed
  if (isProfileProgressClosed) {
    return null;
  }

  return (
    <Card className='border border-border shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50 p-0'>
      <CardContent className='p-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3 flex-1'>
            <div className='p-2 bg-blue-100 rounded-lg'>
              <Target className='w-4 h-4 text-blue-600' />
            </div>
            <div className='flex-1'>
              <div className='flex items-center gap-3 mb-2'>
                <h3 className='text-sm font-semibold text-text-dark'>
                  Profile Strength
                </h3>
                <div className='flex items-center gap-1'>
                  <div className='text-sm font-bold text-blue-600'>
                    {completionPercentage}%
                  </div>
                  <div className='text-xs text-text-light'>Complete</div>
                </div>
              </div>

              {/* Compact Progress Bar */}
              <div className='w-full bg-gray-200 rounded-full h-1.5 mb-2'>
                <div
                  className='bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full transition-all duration-500'
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>

              {completionPercentage < 100 && (
                <p className='text-xs text-text-medium'>
                  {completionPercentage < 50
                    ? 'Complete more sections to improve your profile'
                    : completionPercentage < 80
                      ? "Great progress! You're almost there"
                      : 'Almost complete! Just a few more details'}
                </p>
              )}
            </div>
          </div>

          <div className='flex items-center gap-2 ml-4'>
            {completionPercentage < 100 && (
              <Button
                asChild
                size='sm'
                className='bg-blue-600 hover:bg-blue-700 text-xs px-3 py-1'
              >
                <Link href='/profile'>Complete</Link>
              </Button>
            )}
            <Button
              variant='secondary'
              size='icon'
              onClick={handleCloseProfileProgress}
              className='size-8 cursor-pointer bg-transparent hover:bg-transparent'
            >
              <X />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
