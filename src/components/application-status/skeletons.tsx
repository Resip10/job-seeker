import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase, Clock, CheckCircle, X, Minus } from 'lucide-react';

// Single status item skeleton
interface SkeletonStatusItemProps {
  icon: React.ComponentType<{ className?: string }>;
}

export function SkeletonStatusItem({ icon: Icon }: SkeletonStatusItemProps) {
  return (
    <div className='flex items-center space-x-3'>
      <div className='w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center'>
        <Icon className='w-4 h-4 text-gray-400' />
      </div>
      <Skeleton className='h-6 w-8 mb-1' />
      <Skeleton className='h-4 w-16' />
    </div>
  );
}

// Complete summary card skeleton
export function SummaryCardSkeleton() {
  return (
    <Card className='border border-border shadow-sm p-4'>
      <CardContent>
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-0'>
          <SkeletonStatusItem icon={Briefcase} />
          <div className='hidden lg:block w-px h-12 bg-border'></div>
          <SkeletonStatusItem icon={Clock} />
          <div className='hidden lg:block w-px h-12 bg-border'></div>
          <SkeletonStatusItem icon={CheckCircle} />
          <div className='hidden lg:block w-px h-12 bg-border'></div>
          <SkeletonStatusItem icon={X} />
          <div className='hidden lg:block w-px h-12 bg-border'></div>
          <SkeletonStatusItem icon={Minus} />
        </div>
      </CardContent>
    </Card>
  );
}
