'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X, Save, Plus } from 'lucide-react';
import { IJobDoc } from '@/firebase/services/types';
import { JOB_STATUS_OPTIONS } from '@/firebase/services/constants';
import { useForm } from '@/hooks/useForm';
import { FormField } from '@/components/ui/form-field';
import { validateRequired, validateUrl } from './form';

interface JobFormProps {
  job?: IJobDoc | null;
  onSave: (
    job: Omit<IJobDoc, 'id' | 'createdAt' | 'updatedAt' | 'userId'>
  ) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function JobForm({
  job,
  onSave,
  onCancel,
  isLoading = false,
}: JobFormProps) {
  const { formData, error, handleSubmit, handleInputChange } = useForm({
    initialValues: {
      title: job?.title || '',
      company: job?.company || '',
      link: job?.link || '',
      status: job?.status || 'applied',
      notes: job?.notes || '',
    },
    onSubmit: onSave,
    validate: values => {
      const errors: Record<string, string> = {};

      if (validateRequired(values.title, 'Job title')) {
        errors.title = validateRequired(values.title, 'Job title')!;
      }
      if (validateRequired(values.company, 'Company name')) {
        errors.company = validateRequired(values.company, 'Company name')!;
      }
      if (validateRequired(values.link, 'Job link')) {
        errors.link = validateRequired(values.link, 'Job link')!;
      } else if (validateUrl(values.link)) {
        errors.link = validateUrl(values.link)!;
      }

      return Object.keys(errors).length > 0 ? errors : null;
    },
  });

  return (
    <Card className='w-full max-w-2xl mx-auto'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className='flex items-center gap-2'>
              {job ? (
                <>
                  <Save className='w-5 h-5' />
                  Edit Job
                </>
              ) : (
                <>
                  <Plus className='w-5 h-5' />
                  Add New Job
                </>
              )}
            </CardTitle>
            <CardDescription>
              {job
                ? 'Update job information'
                : 'Add a new job application to track'}
            </CardDescription>
          </div>
          <Button
            variant='ghost'
            size='sm'
            onClick={onCancel}
            className='h-8 w-8 p-0'
          >
            <X className='w-4 h-4' />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-6'>
          {error && (
            <Alert variant='destructive'>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <FormField
              label='Job Title'
              id='title'
              value={formData.title}
              onChange={value => handleInputChange('title', value)}
              placeholder='e.g. Frontend Developer'
              required
            />

            <FormField
              label='Company'
              id='company'
              value={formData.company}
              onChange={value => handleInputChange('company', value)}
              placeholder='e.g. Tech Corp'
              required
            />
          </div>

          <FormField
            label='Job Link'
            id='link'
            type='url'
            value={formData.link}
            onChange={value => handleInputChange('link', value)}
            placeholder='https://company.com/job-posting'
            required
          />

          <div className='space-y-2'>
            <Label htmlFor='status'>Status</Label>
            <select
              id='status'
              value={formData.status}
              onChange={e => handleInputChange('status', e.target.value)}
              className='w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent cursor-pointer'
            >
              {JOB_STATUS_OPTIONS.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <FormField
            label='Notes (Optional)'
            id='notes'
            type='textarea'
            value={formData.notes}
            onChange={value => handleInputChange('notes', value)}
            placeholder='Add any notes about this job application...'
            rows={3}
          />

          <div className='flex gap-3 pt-4'>
            <Button type='submit' disabled={isLoading} className='flex-1'>
              {isLoading ? 'Saving...' : job ? 'Update Job' : 'Add Job'}
            </Button>
            <Button
              type='button'
              variant='outline'
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
