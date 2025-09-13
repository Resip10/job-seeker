import { Card, CardContent } from './card';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Card className={cn('', className)}>
      <CardContent className='text-center py-12'>
        {icon && <div className='text-text-light mb-4'>{icon}</div>}
        <h3 className='text-h3 text-text-dark mb-2'>{title}</h3>
        <p className='text-text-medium mb-4'>{description}</p>
        {action}
      </CardContent>
    </Card>
  );
}
