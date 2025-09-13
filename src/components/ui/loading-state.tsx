import { cn } from '@/lib/utils';

interface LoadingStateProps {
  message?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingState({
  message = 'Loading...',
  className,
  size = 'md',
}: LoadingStateProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={cn('text-center py-12', className)}>
      <div
        className={cn(
          'border-4 border-text-light/30 border-t-primary rounded-full animate-spin mx-auto mb-4',
          sizeClasses[size]
        )}
      ></div>
      <p className='text-text-medium'>{message}</p>
    </div>
  );
}
