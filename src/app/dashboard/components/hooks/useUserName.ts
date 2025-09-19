import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';

export function useUserName() {
  const { user } = useAuth();
  const { userProfile } = useProfile();

  if (userProfile?.firstName && userProfile?.lastName) {
    return `${userProfile.firstName} ${userProfile.lastName}`.trim();
  }

  return user?.displayName || user?.email?.split('@')[0] || 'User';
}
