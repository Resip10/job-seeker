import { Card, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { User } from 'lucide-react';

// Profile header skeleton
export function ProfileHeaderSkeleton() {
  return (
    <Card className='border border-border shadow-sm'>
      <CardHeader>
        <div className='flex flex-col md:flex-row md:items-start gap-6'>
          <div className='flex flex-col items-center gap-4'>
            <div className='w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center'>
              <User className='w-12 h-12 text-gray-400' />
            </div>
          </div>

          <div className='flex-1 space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <Skeleton className='h-4 w-16 mb-2' />
                <Skeleton className='h-10 w-full' />
              </div>
              <div>
                <Skeleton className='h-4 w-16 mb-2' />
                <Skeleton className='h-10 w-full' />
              </div>
              <div className='md:col-span-2'>
                <Skeleton className='h-4 w-24 mb-2' />
                <Skeleton className='h-20 w-full' />
              </div>
              <div>
                <Skeleton className='h-4 w-16 mb-2' />
                <Skeleton className='h-10 w-full' />
              </div>
              <div>
                <Skeleton className='h-4 w-12 mb-2' />
                <Skeleton className='h-10 w-full' />
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
