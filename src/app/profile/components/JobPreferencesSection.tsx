'use client';

import { useState } from 'react';
import { UserProfileDoc, JobPreferences } from '@/firebase/services/types';
import { useProfile } from '@/contexts/ProfileContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Target, Edit, Save, X, Plus } from 'lucide-react';
import {
  WORK_MODES,
  JOB_TYPES,
  CURRENCIES,
  SALARY_PERIODS,
} from '@/lib/constants/profile';

interface JobPreferencesSectionProps {
  userProfile: UserProfileDoc | null;
}

export function JobPreferencesSection({
  userProfile,
}: JobPreferencesSectionProps) {
  const { updateUserProfileById } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<JobPreferences>(
    userProfile?.jobPreferences || {
      workMode: [],
      jobTypes: [],
      desiredJobTitle: '',
      salaryExpectation: {
        min: undefined,
        max: undefined,
        currency: 'USD',
        period: 'yearly',
      },
      willingToRelocate: false,
      preferredLocations: [],
    }
  );
  const [newLocation, setNewLocation] = useState('');

  const handleWorkModeToggle = (mode: string) => {
    setFormData(prev => ({
      ...prev,
      workMode: prev.workMode?.includes(mode)
        ? prev.workMode.filter(m => m !== mode)
        : [...(prev.workMode || []), mode],
    }));
  };

  const handleJobTypeToggle = (type: string) => {
    setFormData(prev => ({
      ...prev,
      jobTypes: prev.jobTypes?.includes(type)
        ? prev.jobTypes.filter(t => t !== type)
        : [...(prev.jobTypes || []), type],
    }));
  };

  const handleAddLocation = () => {
    if (
      newLocation.trim() &&
      !formData.preferredLocations?.includes(newLocation.trim())
    ) {
      setFormData(prev => ({
        ...prev,
        preferredLocations: [
          ...(prev.preferredLocations || []),
          newLocation.trim(),
        ],
      }));
      setNewLocation('');
    }
  };

  const handleRemoveLocation = (location: string) => {
    setFormData(prev => ({
      ...prev,
      preferredLocations: prev.preferredLocations?.filter(
        loc => loc !== location
      ),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddLocation();
    }
  };

  const handleSave = async () => {
    try {
      if (userProfile) {
        await updateUserProfileById(userProfile.id, {
          jobPreferences: formData,
        });
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save job preferences:', error);
    }
  };

  const handleCancel = () => {
    setFormData(
      userProfile?.jobPreferences || {
        workMode: [],
        jobTypes: [],
        desiredJobTitle: '',
        salaryExpectation: {
          min: undefined,
          max: undefined,
          currency: 'USD',
          period: 'yearly',
        },
        willingToRelocate: false,
        preferredLocations: [],
      }
    );
    setNewLocation('');
    setIsEditing(false);
  };

  return (
    <Card className='border border-border shadow-sm'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle className='flex items-center gap-2'>
            <Target className='w-5 h-5' />
            Job Preferences
          </CardTitle>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setIsEditing(!isEditing)}
            className='cursor-pointer'
          >
            {isEditing ? (
              <>
                <X className='w-4 h-4 mr-2' />
                Cancel
              </>
            ) : (
              <>
                <Edit className='w-4 h-4 mr-2' />
                Edit
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className='space-y-6'>
            <div>
              <Label htmlFor='desiredJobTitle'>Desired Job Title</Label>
              <Input
                id='desiredJobTitle'
                value={formData.desiredJobTitle}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    desiredJobTitle: e.target.value,
                  }))
                }
                placeholder='e.g., Senior Software Engineer'
              />
            </div>

            <div>
              <Label>Work Mode Preferences</Label>
              <div className='flex flex-wrap gap-3 mt-2'>
                {WORK_MODES.map(mode => (
                  <div key={mode} className='flex items-center space-x-2'>
                    <Checkbox
                      id={`workMode-${mode}`}
                      checked={formData.workMode?.includes(mode)}
                      onCheckedChange={() => handleWorkModeToggle(mode)}
                    />
                    <Label
                      htmlFor={`workMode-${mode}`}
                      className='font-normal cursor-pointer'
                    >
                      {mode}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Job Type Preferences</Label>
              <div className='flex flex-wrap gap-3 mt-2'>
                {JOB_TYPES.map(type => (
                  <div key={type} className='flex items-center space-x-2'>
                    <Checkbox
                      id={`jobType-${type}`}
                      checked={formData.jobTypes?.includes(type)}
                      onCheckedChange={() => handleJobTypeToggle(type)}
                    />
                    <Label
                      htmlFor={`jobType-${type}`}
                      className='font-normal cursor-pointer'
                    >
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Salary Expectations</Label>
              <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mt-2'>
                <div>
                  <Label htmlFor='minSalary' className='text-xs'>
                    Minimum
                  </Label>
                  <Input
                    id='minSalary'
                    type='number'
                    min='0'
                    value={formData.salaryExpectation?.min || ''}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        salaryExpectation: {
                          ...prev.salaryExpectation!,
                          min: e.target.value
                            ? parseInt(e.target.value)
                            : undefined,
                        },
                      }))
                    }
                    placeholder='50000'
                  />
                </div>
                <div>
                  <Label htmlFor='maxSalary' className='text-xs'>
                    Maximum
                  </Label>
                  <Input
                    id='maxSalary'
                    type='number'
                    min='0'
                    value={formData.salaryExpectation?.max || ''}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        salaryExpectation: {
                          ...prev.salaryExpectation!,
                          max: e.target.value
                            ? parseInt(e.target.value)
                            : undefined,
                        },
                      }))
                    }
                    placeholder='100000'
                  />
                </div>
                <div>
                  <Label htmlFor='currency' className='text-xs'>
                    Currency
                  </Label>
                  <Select
                    value={formData.salaryExpectation?.currency}
                    onValueChange={value =>
                      setFormData(prev => ({
                        ...prev,
                        salaryExpectation: {
                          ...prev.salaryExpectation!,
                          currency: value,
                        },
                      }))
                    }
                  >
                    <SelectTrigger id='currency'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map(curr => (
                        <SelectItem key={curr} value={curr}>
                          {curr}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor='period' className='text-xs'>
                    Period
                  </Label>
                  <Select
                    value={formData.salaryExpectation?.period}
                    onValueChange={value =>
                      setFormData(prev => ({
                        ...prev,
                        salaryExpectation: {
                          ...prev.salaryExpectation!,
                          period: value as 'yearly' | 'monthly' | 'hourly',
                        },
                      }))
                    }
                  >
                    <SelectTrigger id='period'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SALARY_PERIODS.map(period => (
                        <SelectItem key={period.value} value={period.value}>
                          {period.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='willingToRelocate'
                  checked={formData.willingToRelocate}
                  onCheckedChange={checked =>
                    setFormData(prev => ({
                      ...prev,
                      willingToRelocate: checked as boolean,
                    }))
                  }
                />
                <Label htmlFor='willingToRelocate' className='cursor-pointer'>
                  Willing to relocate
                </Label>
              </div>
            </div>

            <div>
              <Label htmlFor='newLocation'>Preferred Locations</Label>
              <div className='flex gap-2'>
                <Input
                  id='newLocation'
                  value={newLocation}
                  onChange={e => setNewLocation(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder='Add a location (e.g., San Francisco, CA)'
                  className='flex-1'
                />
                <Button
                  onClick={handleAddLocation}
                  variant='outline'
                  size='sm'
                  disabled={!newLocation.trim()}
                  className='cursor-pointer'
                >
                  <Plus className='w-4 h-4' />
                </Button>
              </div>
              {formData.preferredLocations &&
                formData.preferredLocations.length > 0 && (
                  <div className='flex flex-wrap gap-2 mt-3'>
                    {formData.preferredLocations.map(location => (
                      <Badge
                        key={location}
                        variant='secondary'
                        className='flex items-center gap-1'
                      >
                        {location}
                        <button
                          onClick={() => handleRemoveLocation(location)}
                          className='ml-1 hover:text-red-600 cursor-pointer'
                        >
                          <X className='w-3 h-3' />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
            </div>

            <div className='flex gap-2 pt-4 border-t border-border'>
              <Button onClick={handleSave} size='sm' className='cursor-pointer'>
                <Save className='w-4 h-4 mr-2' />
                Save Preferences
              </Button>
              <Button
                onClick={handleCancel}
                variant='outline'
                size='sm'
                className='cursor-pointer'
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className='space-y-4'>
            {formData.desiredJobTitle && (
              <div>
                <p className='text-sm text-text-light'>Desired Job Title</p>
                <p className='text-base text-text-dark font-medium'>
                  {formData.desiredJobTitle}
                </p>
              </div>
            )}

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {formData.workMode && formData.workMode.length > 0 && (
                <div>
                  <p className='text-sm text-text-light mb-2'>Work Mode</p>
                  <div className='flex flex-wrap gap-2'>
                    {formData.workMode.map(mode => (
                      <Badge key={mode} variant='secondary'>
                        {mode}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {formData.jobTypes && formData.jobTypes.length > 0 && (
                <div>
                  <p className='text-sm text-text-light mb-2'>Job Types</p>
                  <div className='flex flex-wrap gap-2'>
                    {formData.jobTypes.map(type => (
                      <Badge key={type} variant='secondary'>
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {formData.salaryExpectation &&
              (formData.salaryExpectation.min ||
                formData.salaryExpectation.max) && (
                <div>
                  <p className='text-sm text-text-light'>Salary Expectations</p>
                  <p className='text-base text-text-dark'>
                    {formData.salaryExpectation.min &&
                      `${formData.salaryExpectation.currency} ${formData.salaryExpectation.min.toLocaleString()}`}
                    {formData.salaryExpectation.min &&
                      formData.salaryExpectation.max &&
                      ' - '}
                    {formData.salaryExpectation.max &&
                      `${formData.salaryExpectation.currency} ${formData.salaryExpectation.max.toLocaleString()}`}{' '}
                    {
                      SALARY_PERIODS.find(
                        p => p.value === formData.salaryExpectation?.period
                      )?.label
                    }
                  </p>
                </div>
              )}

            {formData.willingToRelocate && (
              <div>
                <Badge
                  variant='outline'
                  className='bg-green-50 text-green-700 border-green-200'
                >
                  Willing to relocate
                </Badge>
              </div>
            )}

            {formData.preferredLocations &&
              formData.preferredLocations.length > 0 && (
                <div>
                  <p className='text-sm text-text-light mb-2'>
                    Preferred Locations
                  </p>
                  <div className='flex flex-wrap gap-2'>
                    {formData.preferredLocations.map(location => (
                      <Badge key={location} variant='secondary'>
                        {location}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

            {!formData.desiredJobTitle &&
              (!formData.workMode || formData.workMode.length === 0) &&
              (!formData.jobTypes || formData.jobTypes.length === 0) &&
              !formData.salaryExpectation?.min &&
              !formData.salaryExpectation?.max &&
              !formData.willingToRelocate &&
              (!formData.preferredLocations ||
                formData.preferredLocations.length === 0) && (
                <p className='text-text-light text-center py-4'>
                  No job preferences set yet. Click Edit to add your
                  preferences.
                </p>
              )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
