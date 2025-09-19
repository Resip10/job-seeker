import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase, GraduationCap, FileText, Award } from 'lucide-react';

// Generic skeleton card for overview section
interface SkeletonCardProps {
  icon: React.ComponentType<{ className?: string }>;
  bgColor?: string;
}

export function SkeletonCard({
  icon: Icon,
  bgColor = 'bg-gray-100',
}: SkeletonCardProps) {
  return (
    <Card className='border border-border shadow-sm hover:shadow-md transition-shadow p-0'>
      <CardContent className='p-4'>
        <div className='flex items-center justify-between gap-2'>
          <div className='flex-1'>
            <Skeleton className='h-4 w-16 mb-2' />
            <Skeleton className='h-5 w-24 mb-1' />
            <Skeleton className='h-3 w-20' />
          </div>
          <div className={`p-3 ${bgColor} rounded-lg`}>
            <Icon className='w-6 h-6 text-gray-400' />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Skills card skeleton with badge placeholders
export function SkeletonSkillsCard() {
  return (
    <Card className='border border-border shadow-sm hover:shadow-md transition-shadow p-0'>
      <CardContent className='p-4'>
        <div className='flex items-center justify-between gap-2'>
          <div className='flex-1 min-w-0'>
            <Skeleton className='h-4 w-12 mb-2' />
            <div className='flex flex-wrap gap-1'>
              <Skeleton className='h-6 w-16 rounded-full' />
              <Skeleton className='h-6 w-20 rounded-full' />
              <Skeleton className='h-6 w-14 rounded-full' />
              <Skeleton className='h-6 w-18 rounded-full' />
            </div>
          </div>
          <div className='p-3 bg-gray-100 rounded-lg ml-3 flex-shrink-0'>
            <Award className='w-6 h-6 text-gray-400' />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Resume card skeleton with button placeholders
export function SkeletonResumeCard() {
  return (
    <Card className='border border-border shadow-sm hover:shadow-md transition-shadow p-0'>
      <CardContent className='p-4'>
        <div className='flex items-center justify-between mb-3 gap-2'>
          <div className='flex-1 min-w-0'>
            <Skeleton className='h-4 w-14 mb-1' />
            <Skeleton className='h-5 w-32' />
          </div>
          <div className='p-3 bg-gray-100 rounded-lg'>
            <FileText className='w-6 h-6 text-gray-400' />
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Skeleton className='h-6 w-14 rounded-md' />
          <Skeleton className='h-6 w-20 rounded-md' />
        </div>
      </CardContent>
    </Card>
  );
}

// Complete overview section skeleton
export function OverviewSectionSkeleton() {
  return (
    <div className='space-y-6'>
      {/* Stats Grid - Skeleton Loading */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <SkeletonCard icon={Briefcase} />
        <SkeletonCard icon={GraduationCap} />
        <SkeletonSkillsCard />
        <SkeletonResumeCard />
      </div>
    </div>
  );
}

// Profile completion card skeleton
export function ProfileCompletionCardSkeleton() {
  return (
    <Card className='border border-border shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50 p-0'>
      <CardContent className='p-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3 flex-1'>
            <Skeleton className='w-8 h-8 rounded-lg' />
            <div className='flex-1'>
              <div className='flex items-center gap-3 mb-2'>
                <Skeleton className='h-4 w-24' />
                <div className='flex items-center gap-1'>
                  <Skeleton className='h-4 w-8' />
                  <Skeleton className='h-3 w-16' />
                </div>
              </div>
              <Skeleton className='w-full h-1.5 rounded-full mb-2' />
              <Skeleton className='h-3 w-48' />
            </div>
          </div>
          <div className='flex items-center gap-2 ml-4'>
            <Skeleton className='h-7 w-20 rounded-md' />
            <Skeleton className='w-8 h-8 rounded-md' />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
