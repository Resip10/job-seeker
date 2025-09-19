import { useMemo } from 'react';
import { UserProfileDoc } from '@/firebase/services/types';
import { useProfile } from '@/contexts/ProfileContext';

export function useProfileCompletion(userProfile: UserProfileDoc | null) {
  const { loading } = useProfile();

  const completionPercentage = useMemo(() => {
    if (!userProfile) {
      return 0;
    }

    const sections = [
      userProfile.firstName && userProfile.lastName,
      userProfile.bio,
      userProfile.location,
      userProfile.phone,
      userProfile.website,
      userProfile.experience && userProfile.experience.length > 0,
      userProfile.education && userProfile.education.length > 0,
      userProfile.skills && userProfile.skills.length > 0,
      userProfile.resumeUrl,
    ];

    const completedSections = sections.filter(Boolean).length;

    return Math.round((completedSections / sections.length) * 100);
  }, [userProfile]);

  return { completionPercentage, isLoading: loading };
}
