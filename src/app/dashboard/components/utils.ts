import {
  UserProfileDoc,
  WorkExperience,
  Education,
  ResumeDoc,
} from '@/firebase/services/types';

/**
 * Calculate total years of experience from user profile
 */
export const getExperienceYears = (
  userProfile: UserProfileDoc | null
): number => {
  if (!userProfile?.experience || userProfile.experience.length === 0) {
    return 0;
  }

  const now = new Date();
  let totalYears = 0;

  userProfile.experience.forEach(exp => {
    const startDate = new Date(exp.startDate);
    const endDate = exp.current ? now : new Date(exp.endDate || '');
    const years =
      (endDate.getTime() - startDate.getTime()) /
      (1000 * 60 * 60 * 24 * 365.25);
    totalYears += Math.max(0, years);
  });

  return Math.floor(totalYears);
};

/**
 * Get the latest job title from user profile experience
 */
export const getLatestJobTitle = (
  userProfile: UserProfileDoc | null
): WorkExperience | null => {
  if (!userProfile?.experience || userProfile.experience.length === 0) {
    return null;
  }

  // Sort by start date (most recent first)
  const sortedExperience = [...userProfile.experience].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  return sortedExperience[0];
};

/**
 * Get the latest education from user profile
 */
export const getLatestEducation = (
  userProfile: UserProfileDoc | null
): Education | null => {
  if (!userProfile?.education || userProfile.education.length === 0) {
    return null;
  }

  // Sort by start date (most recent first)
  const sortedEducation = [...userProfile.education].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  return sortedEducation[0];
};

/**
 * Get the active resume from user profile
 */
export const getActiveResume = (
  userProfile: UserProfileDoc | null,
  resumes: ResumeDoc[]
): ResumeDoc | null => {
  if (!userProfile?.resumeUrl) {
    return null;
  }

  return (
    resumes.find(resume => resume.fileUrl === userProfile.resumeUrl) || null
  );
};
