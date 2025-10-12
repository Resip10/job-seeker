'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, ExternalLink, Calendar, Building2 } from 'lucide-react';
import { IJobDoc } from '@/firebase/services/types';
import { formatDate } from '@/lib/utils/date';
import { JobNotesTooltip } from '@/components/applications/JobNotesTooltip';

interface JobCardProps {
  job: IJobDoc;
  onEdit: (job: IJobDoc) => void;
  onDelete: (jobId: string) => void;
  isLoading?: boolean;
}

const STATUS_LABELS = {
  applied: 'Applied',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'applied':
      return 'default';
    case 'interview':
      return 'secondary';
    case 'offer':
      return 'default';
    case 'rejected':
      return 'destructive';
    case 'withdrawn':
      return 'outline';
    default:
      return 'outline';
  }
};

const getStatusClassName = (status: string) => {
  switch (status) {
    case 'applied':
      return 'bg-blue-50 text-blue-700 border-blue-200 font-medium';
    case 'interview':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200 font-medium';
    case 'offer':
      return 'bg-green-50 text-green-700 border-green-200 font-medium';
    case 'rejected':
      return 'bg-red-50 text-red-700 border-red-200 font-medium';
    case 'withdrawn':
      return 'bg-gray-50 text-gray-700 border-gray-200 font-medium';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200 font-medium';
  }
};

export function JobCard({
  job,
  onEdit,
  onDelete,
  isLoading = false,
}: JobCardProps) {
  const handleDelete = () => {
    if (
      window.confirm('Are you sure you want to delete this job application?')
    ) {
      onDelete(job.id);
    }
  };

  return (
    <Card className='h-full flex flex-col hover:shadow-card transition-shadow duration-200 gap-1'>
      <CardHeader>
        <div className='space-y-3'>
          <div className='flex items-start justify-between gap-3'>
            <div className='flex-1 min-w-0'>
              <div className='flex items-start gap-2 mb-1'>
                <CardTitle className='text-lg font-semibold text-text-dark leading-tight line-clamp-2 h-12 flex-1'>
                  {job.title}
                </CardTitle>
                <JobNotesTooltip notes={job.notes} />
              </div>
              <CardDescription className='flex items-center gap-1'>
                <Building2 className='w-4 h-4 text-text-light flex-shrink-0' />
                <span className='truncate text-text-medium'>{job.company}</span>
              </CardDescription>
            </div>
            <Badge
              variant={getStatusVariant(job.status)}
              className={`flex-shrink-0 text-xs px-2 py-1 ${getStatusClassName(job.status)}`}
            >
              {STATUS_LABELS[job.status as keyof typeof STATUS_LABELS] ||
                job.status}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className='pt-0 flex-1 flex flex-col'>
        <div className='space-y-3 flex-1'>
          {/* Job Link */}
          <div className='flex items-center gap-2'>
            <ExternalLink className='w-4 h-4 text-text-light flex-shrink-0' />
            <a
              href={job.link}
              target='_blank'
              rel='noopener noreferrer'
              className='text-body text-primary hover:text-primary/80 hover:underline truncate cursor-pointer'
            >
              View Job Posting
            </a>
          </div>

          {/* Dates */}
          <div className='flex flex-col gap-1 text-caption text-text-light'>
            <div className='flex items-center gap-1'>
              <Calendar className='w-3 h-3 flex-shrink-0' />
              <span>Created: {formatDate(job.createdAt)}</span>
            </div>
            {job.updatedAt && job.updatedAt !== job.createdAt && (
              <div className='flex items-center gap-1'>
                <Calendar className='w-3 h-3 flex-shrink-0' />
                <span>Updated: {formatDate(job.updatedAt)}</span>
              </div>
            )}
          </div>
        </div>

        <div className='flex gap-2 pt-4 mt-auto border-t border-border'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => onEdit(job)}
            disabled={isLoading}
            className='flex-1 cursor-pointer hover:bg-blue-50 hover:border-blue-200'
          >
            <Edit className='w-3 h-3 mr-1' />
            Edit
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={handleDelete}
            disabled={isLoading}
            className='flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200 cursor-pointer'
          >
            <Trash2 className='w-3 h-3 mr-1' />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
