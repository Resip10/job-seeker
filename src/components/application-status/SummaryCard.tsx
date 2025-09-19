import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, Clock, CheckCircle, X, Minus } from 'lucide-react';
import { StatusItem } from './StatusItem';

interface SummaryCardProps {
  statusCounts: Record<string, number>;
}

export function SummaryCard({ statusCounts }: SummaryCardProps) {
  return (
    <Card className='border border-border shadow-sm p-4'>
      <CardContent>
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-0'>
          <StatusItem
            icon={Briefcase}
            count={statusCounts.applied || 0}
            label='Applied'
            iconColor='text-primary'
            iconBgColor='bg-primary/10'
          />

          <div className='hidden lg:block w-px h-12 bg-border'></div>

          <StatusItem
            icon={Clock}
            count={statusCounts.interview || 0}
            label='Interview'
          />

          <div className='hidden lg:block w-px h-12 bg-border'></div>

          <StatusItem
            icon={CheckCircle}
            count={statusCounts.offer || 0}
            label='Offer'
            iconColor='text-chart-2'
            iconBgColor='bg-chart-2/10'
          />

          <div className='hidden lg:block w-px h-12 bg-border'></div>

          <StatusItem
            icon={X}
            count={statusCounts.rejected || 0}
            label='Rejected'
            iconColor='text-destructive'
            iconBgColor='bg-destructive/10'
          />

          <div className='hidden lg:block w-px h-12 bg-border'></div>

          <StatusItem
            icon={Minus}
            count={statusCounts.withdrawn || 0}
            label='Withdrawn'
          />
        </div>
      </CardContent>
    </Card>
  );
}
