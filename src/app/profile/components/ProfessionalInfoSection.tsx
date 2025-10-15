'use client';

import { useState } from 'react';
import { UserProfileDoc } from '@/firebase/services/types';
import { useProfile } from '@/contexts/ProfileContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Briefcase, Edit, Save, X } from 'lucide-react';
import {
  WORK_AUTHORIZATION_OPTIONS,
  AVAILABILITY_STATUS_OPTIONS,
  NOTICE_PERIOD_OPTIONS,
} from '@/lib/constants/profile';
import {
  shouldShowNoticePeriod,
  calculateYearsOfExperience,
} from '@/lib/utils/profile';

interface ProfessionalInfoSectionProps {
  userProfile: UserProfileDoc | null;
}

export function ProfessionalInfoSection({
  userProfile,
}: ProfessionalInfoSectionProps) {
  const { updateUserProfileById, addUserProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    headline: userProfile?.headline || '',
    yearsOfExperience: userProfile?.yearsOfExperience || 0,
    availabilityStatus: userProfile?.availabilityStatus || '',
    noticePeriod: userProfile?.noticePeriod || '',
    workAuthorization: userProfile?.workAuthorization || '',
  });

  const handleSave = async () => {
    try {
      if (userProfile) {
        await updateUserProfileById(userProfile.id, formData);
      } else {
        await addUserProfile({
          firstName: '',
          lastName: '',
          email: '',
          skills: [],
          experience: [],
          education: [],
          ...formData,
        });
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save professional info:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      headline: userProfile?.headline || '',
      yearsOfExperience: userProfile?.yearsOfExperience || 0,
      availabilityStatus: userProfile?.availabilityStatus || '',
      noticePeriod: userProfile?.noticePeriod || '',
      workAuthorization: userProfile?.workAuthorization || '',
    });
    setIsEditing(false);
  };

  const showNoticePeriod = shouldShowNoticePeriod(formData.availabilityStatus);

  const calculatedYears = userProfile?.experience
    ? calculateYearsOfExperience(userProfile.experience)
    : 0;

  const handleCalculateExperience = () => {
    setFormData(prev => ({
      ...prev,
      yearsOfExperience: calculatedYears,
    }));
  };

  return (
    <Card className='border border-border shadow-sm'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle className='flex items-center gap-2'>
            <Briefcase className='w-5 h-5' />
            Professional Information
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
          <div className='space-y-4'>
            <div>
              <Label htmlFor='headline'>Professional Headline</Label>
              <Input
                id='headline'
                value={formData.headline}
                onChange={e =>
                  setFormData(prev => ({ ...prev, headline: e.target.value }))
                }
                placeholder='e.g., Senior Software Engineer | Full-Stack Developer'
              />
              <p className='text-xs text-text-light mt-1'>
                A brief professional title or tagline
              </p>
            </div>

            <div>
              <Label htmlFor='yearsOfExperience'>
                Years of Professional Experience
              </Label>
              <div className='flex gap-2'>
                <Input
                  id='yearsOfExperience'
                  type='number'
                  min='0'
                  max='50'
                  step='0.5'
                  value={formData.yearsOfExperience}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      yearsOfExperience: parseFloat(e.target.value) || 0,
                    }))
                  }
                  placeholder='0'
                  className='flex-1'
                />
                {calculatedYears > 0 && (
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={handleCalculateExperience}
                    className='cursor-pointer whitespace-nowrap'
                  >
                    Use {calculatedYears} yrs
                  </Button>
                )}
              </div>
              {calculatedYears > 0 && (
                <p className='text-xs text-text-light mt-1'>
                  Calculated from work history: {calculatedYears} years
                  {formData.yearsOfExperience !== calculatedYears && (
                    <span className='text-amber-600'>
                      {' '}
                      • Manual: {formData.yearsOfExperience} years
                    </span>
                  )}
                </p>
              )}
              {calculatedYears === 0 && (
                <p className='text-xs text-text-light mt-1'>
                  Enter manually or add work experience to calculate
                  automatically
                </p>
              )}
            </div>

            <div>
              <Label htmlFor='workAuthorization'>Work Authorization</Label>
              <Select
                value={formData.workAuthorization}
                onValueChange={value =>
                  setFormData(prev => ({ ...prev, workAuthorization: value }))
                }
              >
                <SelectTrigger id='workAuthorization'>
                  <SelectValue placeholder='Select work authorization status' />
                </SelectTrigger>
                <SelectContent>
                  {WORK_AUTHORIZATION_OPTIONS.map(option => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor='availabilityStatus'>Availability Status</Label>
              <Select
                value={formData.availabilityStatus}
                onValueChange={value =>
                  setFormData(prev => ({ ...prev, availabilityStatus: value }))
                }
              >
                <SelectTrigger id='availabilityStatus'>
                  <SelectValue placeholder='Select your availability' />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABILITY_STATUS_OPTIONS.map(option => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {showNoticePeriod && (
              <div>
                <Label htmlFor='noticePeriod'>Notice Period</Label>
                <Select
                  value={formData.noticePeriod}
                  onValueChange={value =>
                    setFormData(prev => ({ ...prev, noticePeriod: value }))
                  }
                >
                  <SelectTrigger id='noticePeriod'>
                    <SelectValue placeholder='Select notice period' />
                  </SelectTrigger>
                  <SelectContent>
                    {NOTICE_PERIOD_OPTIONS.map(option => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className='flex gap-2'>
              <Button onClick={handleSave} size='sm' className='cursor-pointer'>
                <Save className='w-4 h-4 mr-2' />
                Save Changes
              </Button>
              <Button
                onClick={handleCancel}
                variant='outline'
                size='sm'
                className='cursor-pointer'
              >
                <X className='w-4 h-4 mr-2' />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className='space-y-3'>
            {userProfile?.headline ? (
              <div>
                <p className='text-sm text-text-light'>Headline</p>
                <p className='text-base text-text-dark font-medium'>
                  {userProfile.headline}
                </p>
              </div>
            ) : null}

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div>
                <p className='text-sm text-text-light'>Years of Experience</p>
                <p className='text-base text-text-dark'>
                  {userProfile?.yearsOfExperience || calculatedYears || 0} years
                  {!userProfile?.yearsOfExperience && calculatedYears > 0 && (
                    <span className='text-xs text-text-light ml-1'>
                      (from work history)
                    </span>
                  )}
                </p>
              </div>

              {userProfile?.workAuthorization && (
                <div>
                  <p className='text-sm text-text-light'>Work Authorization</p>
                  <p className='text-base text-text-dark'>
                    {userProfile.workAuthorization}
                  </p>
                </div>
              )}

              {userProfile?.availabilityStatus && (
                <div>
                  <p className='text-sm text-text-light'>Availability</p>
                  <p className='text-base text-text-dark'>
                    {userProfile.availabilityStatus}
                  </p>
                </div>
              )}

              {userProfile?.noticePeriod && (
                <div>
                  <p className='text-sm text-text-light'>Notice Period</p>
                  <p className='text-base text-text-dark'>
                    {userProfile.noticePeriod}
                  </p>
                </div>
              )}
            </div>

            {!userProfile?.headline &&
              !userProfile?.availabilityStatus &&
              !userProfile?.workAuthorization && (
                <p className='text-text-light text-center py-4'>
                  No professional information added yet. Click Edit to add
                  details.
                </p>
              )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
