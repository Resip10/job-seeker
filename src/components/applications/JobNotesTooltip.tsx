'use client';

import { FileText } from 'lucide-react';
import { Tooltip, TooltipTrigger } from '@/components/ui/tooltip';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

interface JobNotesTooltipProps {
  notes?: string;
}

export function JobNotesTooltip({ notes }: JobNotesTooltipProps) {
  if (!notes) {
    return null;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className='flex items-center justify-center w-5 h-5 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors cursor-help mt-0.5 flex-shrink-0'>
          <FileText className='w-3 h-3 text-blue-600' />
        </div>
      </TooltipTrigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side='top'
          className='max-w-xs bg-white text-gray-900 border border-gray-200 shadow-lg z-50 rounded-md px-3 py-2 text-xs animate-in fade-in-0 zoom-in-95'
          sideOffset={5}
        >
          <p className='leading-relaxed'>{notes}</p>
          <TooltipPrimitive.Arrow className='bg-white fill-white border-l border-t border-gray-200 z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45' />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </Tooltip>
  );
}
