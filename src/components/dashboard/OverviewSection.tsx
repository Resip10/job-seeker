'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Briefcase,
  GraduationCap,
  FileText,
  Award,
  ExternalLink,
  Download,
} from 'lucide-react';
import { UserProfileDoc } from '@/firebase/services/types';
import { useProfile } from '@/contexts/ProfileContext';
import {
  getExperienceYears,
  getLatestJobTitle,
  getLatestEducation,
  getActiveResume,
} from './utils';

interface OverviewSectionProps {
  userProfile: UserProfileDoc | null;
}

export function OverviewSection({ userProfile }: OverviewSectionProps) {
  const { resumes } = useProfile();
  const experienceYears = getExperienceYears(userProfile);
  const latestJob = getLatestJobTitle(userProfile);
  const latestEducation = getLatestEducation(userProfile);
  const activeResume = getActiveResume(userProfile, resumes);

  return (
    <div className='space-y-6'>
      {/* Stats Grid - GitHub Style */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {/* Experience Card */}
        <Card className='border border-border shadow-sm hover:shadow-md transition-shadow p-0'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between gap-2'>
              <div>
                <p className='text-sm font-medium text-text-light'>
                  Experience
                </p>
                {latestJob ? (
                  <>
                    <p
                      className='text-lg font-bold text-text-dark truncate'
                      title={latestJob.position}
                    >
                      {latestJob.position}
                    </p>
                    <p className='text-xs text-text-light'>
                      {experienceYears}+ years •{' '}
                      {userProfile?.experience?.length || 0} position
                      {(userProfile?.experience?.length || 0) !== 1 ? 's' : ''}
                    </p>
                  </>
                ) : (
                  <>
                    <p className='text-2xl font-bold text-text-dark'>
                      {experienceYears}+ years
                    </p>
                    <p className='text-xs text-text-light'>
                      {userProfile?.experience?.length || 0} position
                      {(userProfile?.experience?.length || 0) !== 1 ? 's' : ''}
                    </p>
                  </>
                )}
              </div>
              <div className='p-3 bg-orange-100 rounded-lg'>
                <Briefcase className='w-6 h-6 text-orange-600' />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Education Card */}
        <Card className='border border-border shadow-sm hover:shadow-md transition-shadow p-0'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between gap-2'>
              <div>
                <p className='text-sm font-medium text-text-light'>Education</p>
                {latestEducation ? (
                  <>
                    <p
                      className='text-lg font-bold text-text-dark truncate'
                      title={`${latestEducation.degree} ${latestEducation.fieldOfStudy ? `in ${latestEducation.fieldOfStudy}` : ''}`}
                    >
                      {latestEducation.degree}
                      {latestEducation.fieldOfStudy && (
                        <span className='text-sm font-normal text-text-medium'>
                          {' '}
                          in {latestEducation.fieldOfStudy}
                        </span>
                      )}
                    </p>
                    <p className='text-xs text-text-light'>
                      {userProfile?.education?.length || 0} degree
                      {(userProfile?.education?.length || 0) !== 1 ? 's' : ''}
                    </p>
                  </>
                ) : (
                  <>
                    <p className='text-2xl font-bold text-text-dark'>
                      {userProfile?.education?.length || 0}
                    </p>
                    <p className='text-xs text-text-light'>
                      degree
                      {(userProfile?.education?.length || 0) !== 1 ? 's' : ''}
                    </p>
                  </>
                )}
              </div>
              <div className='p-3 bg-green-100 rounded-lg'>
                <GraduationCap className='w-6 h-6 text-green-600' />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills Card */}
        <Card className='border border-border shadow-sm hover:shadow-md transition-shadow p-0'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between gap-2'>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium text-text-light mb-2'>
                  Skills
                </p>
                {userProfile?.skills && userProfile.skills.length > 0 ? (
                  <div className='flex flex-wrap gap-1 overflow-hidden'>
                    {userProfile.skills.slice(0, 4).map(skill => (
                      <Badge
                        key={skill}
                        variant='secondary'
                        className='text-xs px-2 py-1 bg-purple-100 text-purple-700 border-purple-200'
                      >
                        {skill}
                      </Badge>
                    ))}
                    {userProfile.skills.length > 4 && (
                      <Badge
                        variant='outline'
                        className='text-xs px-2 py-1 text-text-light'
                      >
                        +{userProfile.skills.length - 4} more
                      </Badge>
                    )}
                  </div>
                ) : (
                  <p className='text-sm text-text-light italic'>
                    No skills added
                  </p>
                )}
              </div>
              <div className='p-3 bg-purple-100 rounded-lg ml-3 flex-shrink-0'>
                <Award className='w-6 h-6 text-purple-600' />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resume Card */}
        <Card className='border border-border shadow-sm hover:shadow-md transition-shadow p-0'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between mb-3 gap-2'>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium text-text-light'>Resume</p>
                <p
                  className='text-lg font-bold text-text-dark truncate'
                  title={activeResume?.fileName}
                >
                  {activeResume ? activeResume.fileName : 'Missing'}
                </p>
              </div>
              <div
                className={`p-3 rounded-lg ${activeResume ? 'bg-green-100' : 'bg-gray-100'}`}
              >
                <FileText
                  className={`w-6 h-6 ${activeResume ? 'text-green-600' : 'text-gray-400'}`}
                />
              </div>
            </div>
            {activeResume && (
              <div className='flex items-center gap-2'>
                <button
                  onClick={() => window.open(activeResume.fileUrl, '_blank')}
                  className='flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-600 hover:bg-green-100 rounded-md transition-colors cursor-pointer'
                  title='Open resume'
                >
                  <ExternalLink className='w-3 h-3' />
                  Open
                </button>
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = activeResume.fileUrl;
                    link.download = activeResume.fileName;
                    link.target = '_blank';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className='flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-600 hover:bg-green-100 rounded-md transition-colors cursor-pointer'
                  title='Download resume'
                >
                  <Download className='w-3 h-3' />
                  Download
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
