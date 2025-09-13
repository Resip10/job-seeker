'use client';

import { useState } from 'react';
import { UserProfileDoc, Education } from '@/firebase/services/types';
import { useProfile } from '@/contexts/ProfileContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  GraduationCap,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { format } from 'date-fns';

interface EducationSectionProps {
  userProfile: UserProfileDoc | null;
}

export function EducationSection({ userProfile }: EducationSectionProps) {
  const { updateUserProfileById } = useProfile();
  const [isEditingEdu, setIsEditingEdu] = useState(false);
  const [editingEduId, setEditingEduId] = useState<string | null>(null);
  const [education, setEducation] = useState<Education[]>(
    userProfile?.education || []
  );
  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    current: false,
    description: '',
  });

  const handleAddEducation = () => {
    setFormData({
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: undefined,
      endDate: undefined,
      current: false,
      description: '',
    });
    setEditingEduId(null);
    setIsEditingEdu(true);
  };

  const handleEditEducation = (edu: Education) => {
    setFormData({
      institution: edu.institution,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy || '',
      startDate: new Date(edu.startDate),
      endDate: edu.endDate ? new Date(edu.endDate) : undefined,
      current: edu.current,
      description: edu.description || '',
    });
    setEditingEduId(edu.id);
    setIsEditingEdu(true);
  };

  const handleSaveEducation = async () => {
    try {
      const educationData = {
        ...formData,
        startDate: formData.startDate?.toISOString().split('T')[0] || '',
        endDate: formData.current
          ? ''
          : formData.endDate?.toISOString().split('T')[0] || '',
      };

      const newEducation = editingEduId
        ? education.map(edu =>
            edu.id === editingEduId
              ? { ...edu, ...educationData, id: editingEduId }
              : edu
          )
        : [...education, { ...educationData, id: Date.now().toString() }];

      setEducation(newEducation);

      if (userProfile) {
        await updateUserProfileById(userProfile.id, {
          education: newEducation,
        });
      }

      setIsEditingEdu(false);
      setEditingEduId(null);
    } catch (error) {
      console.error('Failed to save education:', error);
    }
  };

  const handleDeleteEducation = async (eduId: string) => {
    if (
      window.confirm('Are you sure you want to delete this education entry?')
    ) {
      try {
        const newEducation = education.filter(edu => edu.id !== eduId);
        setEducation(newEducation);

        if (userProfile) {
          await updateUserProfileById(userProfile.id, {
            education: newEducation,
          });
        }
      } catch (error) {
        console.error('Failed to delete education:', error);
      }
    }
  };

  const handleCancel = () => {
    setIsEditingEdu(false);
    setEditingEduId(null);
    setFormData({
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: undefined,
      endDate: undefined,
      current: false,
      description: '',
    });
  };

  return (
    <Card className='border border-border shadow-sm'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle className='flex items-center gap-2'>
            <GraduationCap className='w-5 h-5' />
            Education
          </CardTitle>
          {!isEditingEdu && (
            <Button
              onClick={handleAddEducation}
              variant='outline'
              size='sm'
              className='cursor-pointer'
            >
              <Plus className='w-4 h-4 mr-2' />
              Add Education
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditingEdu ? (
          <div className='space-y-4 p-4 border border-border rounded-lg bg-slate-50'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='institution'>Institution *</Label>
                <Input
                  id='institution'
                  value={formData.institution}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      institution: e.target.value,
                    }))
                  }
                  placeholder='University or school name'
                  required
                />
              </div>
              <div>
                <Label htmlFor='degree'>Degree *</Label>
                <Input
                  id='degree'
                  value={formData.degree}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, degree: e.target.value }))
                  }
                  placeholder="Bachelor's, Master's, etc."
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor='fieldOfStudy'>Field of Study</Label>
              <Input
                id='fieldOfStudy'
                value={formData.fieldOfStudy}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    fieldOfStudy: e.target.value,
                  }))
                }
                placeholder='Computer Science, Business, etc.'
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='startDate'>Start Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      className='w-full justify-start text-left font-normal'
                    >
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {formData.startDate
                        ? format(formData.startDate, 'PPP')
                        : 'Select start date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      mode='single'
                      selected={formData.startDate}
                      onSelect={date =>
                        setFormData(prev => ({ ...prev, startDate: date }))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor='endDate'>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      className='w-full justify-start text-left font-normal'
                      disabled={formData.current}
                    >
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {formData.endDate
                        ? format(formData.endDate, 'PPP')
                        : 'Select end date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      mode='single'
                      selected={formData.endDate}
                      onSelect={date =>
                        setFormData(prev => ({ ...prev, endDate: date }))
                      }
                      disabled={formData.current}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className='flex items-center space-x-2'>
              <Checkbox
                id='current'
                checked={formData.current}
                onCheckedChange={checked =>
                  setFormData(prev => ({
                    ...prev,
                    current: checked as boolean,
                    endDate: checked ? undefined : prev.endDate,
                  }))
                }
              />
              <Label htmlFor='current'>I am currently studying here</Label>
            </div>

            <div>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                value={formData.description}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder='Describe your studies, achievements, or relevant coursework...'
                rows={3}
              />
            </div>

            <div className='flex gap-2'>
              <Button
                onClick={handleSaveEducation}
                size='sm'
                className='cursor-pointer'
              >
                <Save className='w-4 h-4 mr-2' />
                {editingEduId ? 'Update' : 'Add'} Education
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
        ) : null}

        <div className='space-y-4'>
          {education.length > 0 ? (
            education
              .sort(
                (a, b) =>
                  new Date(b.startDate).getTime() -
                  new Date(a.startDate).getTime()
              )
              .map(edu => (
                <div
                  key={edu.id}
                  className='p-4 border border-border rounded-lg hover:bg-slate-50'
                >
                  <div className='flex items-start justify-between'>
                    <div className='flex-1 min-w-0'>
                      <h3 className='text-h4 text-text-dark'>{edu.degree}</h3>
                      <p className='text-body text-text-medium font-medium'>
                        {edu.institution}
                      </p>
                      {edu.fieldOfStudy && (
                        <p className='text-caption text-text-light'>
                          {edu.fieldOfStudy}
                        </p>
                      )}

                      <div className='flex items-center gap-2 mt-2 text-caption text-text-light'>
                        <CalendarIcon className='w-4 h-4' />
                        <span>
                          {new Date(edu.startDate).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric',
                          })}{' '}
                          -{' '}
                          {edu.current
                            ? 'Present'
                            : new Date(edu.endDate || '').toLocaleDateString(
                                'en-US',
                                { month: 'short', year: 'numeric' }
                              )}
                        </span>
                      </div>

                      {edu.description && (
                        <p className='text-body text-text-medium mt-2'>
                          {edu.description}
                        </p>
                      )}
                    </div>

                    <div className='flex items-center gap-1 ml-4'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleEditEducation(edu)}
                        className='cursor-pointer'
                      >
                        <Edit className='w-4 h-4' />
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleDeleteEducation(edu.id)}
                        className='text-red-600 hover:text-red-700 cursor-pointer'
                      >
                        <Trash2 className='w-4 h-4' />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <p className='text-text-light text-center py-8'>
              No education added yet. Click &quot;Add Education&quot; to get
              started.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
