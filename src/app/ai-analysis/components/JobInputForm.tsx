'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, Send, AlertCircle } from 'lucide-react';

interface JobInputFormProps {
  onSubmit: (jobDescription: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function JobInputForm({
  onSubmit,
  isLoading,
  error,
}: JobInputFormProps) {
  const [jobDescription, setJobDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!jobDescription.trim()) {
      return;
    }

    await onSubmit(jobDescription);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          Enter a Job Description
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Textarea
              id='job-description'
              placeholder='Paste job description text or provide a link to the job posting...'
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              rows={6}
              className='resize-y'
              disabled={isLoading}
            />
          </div>

          {error && (
            <Alert variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type='submit'
            disabled={isLoading || !jobDescription.trim()}
            className='w-full cursor-pointer'
          >
            {isLoading ? (
              <>
                <Brain className='w-4 h-4 mr-2 animate-spin' />
                Analyzing...
              </>
            ) : (
              <>
                <Send className='w-4 h-4 mr-2' />
                Analyze Job
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
