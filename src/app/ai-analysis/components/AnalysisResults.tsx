'use client';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { JobAnalysisResponse } from '@/firebase/services';
import { formatResponseValue } from '../utils';

interface AnalysisResultsProps {
  response: JobAnalysisResponse;
}

export function AnalysisResults({ response }: AnalysisResultsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-green-700'>
          <CheckCircle className='w-5 h-5' />
          Analysis Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {Object.entries(response).map(([key, value]) => (
            <div key={key} className='space-y-2'>
              <Label className='text-sm font-semibold text-slate-700 capitalize'>
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </Label>
              <Textarea
                value={formatResponseValue(value)}
                readOnly
                rows={
                  key === 'requirements' ||
                  key === 'responsibilities' ||
                  key === 'benefits' ||
                  key === 'recommendations'
                    ? 5
                    : 2
                }
                className='bg-slate-50 resize-none cursor-default'
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
