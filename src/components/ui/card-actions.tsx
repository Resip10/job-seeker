import { Button } from './button';
import { Edit, Trash2, ExternalLink, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CardActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  onDownload?: () => void;
  editLabel?: string;
  deleteLabel?: string;
  viewLabel?: string;
  downloadLabel?: string;
  className?: string;
  size?: 'sm' | 'default';
}

export function CardActions({
  onEdit,
  onDelete,
  onView,
  onDownload,
  editLabel = 'Edit',
  deleteLabel = 'Delete',
  viewLabel = 'View',
  downloadLabel = 'Download',
  className,
  size = 'sm',
}: CardActionsProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {onView && (
        <Button
          variant='outline'
          size={size}
          onClick={onView}
          className='cursor-pointer'
          title={viewLabel}
        >
          <ExternalLink className='w-4 h-4' />
        </Button>
      )}
      {onDownload && (
        <Button
          variant='outline'
          size={size}
          onClick={onDownload}
          className='cursor-pointer'
          title={downloadLabel}
        >
          <Download className='w-4 h-4' />
        </Button>
      )}
      {onEdit && (
        <Button
          variant='outline'
          size={size}
          onClick={onEdit}
          className='cursor-pointer'
          title={editLabel}
        >
          <Edit className='w-4 h-4' />
        </Button>
      )}
      {onDelete && (
        <Button
          variant='outline'
          size={size}
          onClick={onDelete}
          className='text-red-600 hover:text-red-700 cursor-pointer'
          title={deleteLabel}
        >
          <Trash2 className='w-4 h-4' />
        </Button>
      )}
    </div>
  );
}
