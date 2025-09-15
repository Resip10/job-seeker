'use client';

import { useState } from 'react';
import { UserProfileDoc, WorkExperience } from '@/firebase/services/types';
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
  Briefcase,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  MapPin,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { format } from 'date-fns';
import { toDateInputFormat } from '@/lib/utils/date';

interface ExperienceSectionProps {
  userProfile: UserProfileDoc | null;
}

export function ExperienceSection({ userProfile }: ExperienceSectionProps) {
  const { updateUserProfileById } = useProfile();
  const [isEditingExp, setIsEditingExp] = useState(false);
  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [experience, setExperience] = useState<WorkExperience[]>(
    userProfile?.experience || []
  );
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    location: '',
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    current: false,
    description: '',
  });

  const handleAddExperience = () => {
    setFormData({
      company: '',
      position: '',
      location: '',
      startDate: undefined,
      endDate: undefined,
      current: false,
      description: '',
    });
    setEditingExpId(null);
    setIsEditingExp(true);
  };

  const handleEditExperience = (exp: WorkExperience) => {
    setFormData({
      company: exp.company,
      position: exp.position,
      location: exp.location || '',
      startDate: new Date(exp.startDate),
      endDate: exp.endDate ? new Date(exp.endDate) : undefined,
      current: exp.current,
      description: exp.description || '',
    });
    setEditingExpId(exp.id);
    setIsEditingExp(true);
  };

  const handleSaveExperience = async () => {
    try {
      const experienceData = {
        ...formData,
        startDate: toDateInputFormat(formData.startDate),
        endDate: formData.current ? '' : toDateInputFormat(formData.endDate),
      };

      const newExperience = editingExpId
        ? experience.map(exp =>
            exp.id === editingExpId
              ? { ...exp, ...experienceData, id: editingExpId }
              : exp
          )
        : [...experience, { ...experienceData, id: Date.now().toString() }];

      setExperience(newExperience);

      if (userProfile) {
        await updateUserProfileById(userProfile.id, {
          experience: newExperience,
        });
      }

      setIsEditingExp(false);
      setEditingExpId(null);
    } catch (error) {
      console.error('Failed to save experience:', error);
    }
  };

  const handleDeleteExperience = async (expId: string) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      try {
        const newExperience = experience.filter(exp => exp.id !== expId);
        setExperience(newExperience);

        if (userProfile) {
          await updateUserProfileById(userProfile.id, {
            experience: newExperience,
          });
        }
      } catch (error) {
        console.error('Failed to delete experience:', error);
      }
    }
  };

  const handleCancel = () => {
    setIsEditingExp(false);
    setEditingExpId(null);
    setFormData({
      company: '',
      position: '',
      location: '',
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
            <Briefcase className='w-5 h-5' />
            Work Experience
          </CardTitle>
          {!isEditingExp && (
            <Button
              onClick={handleAddExperience}
              variant='outline'
              size='sm'
              className='cursor-pointer'
            >
              <Plus className='w-4 h-4 mr-2' />
              Add Experience
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditingExp ? (
          <div className='space-y-4 p-4 border border-border rounded-lg bg-slate-50'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='company'>Company *</Label>
                <Input
                  id='company'
                  value={formData.company}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, company: e.target.value }))
                  }
                  placeholder='Company name'
                  required
                />
              </div>
              <div>
                <Label htmlFor='position'>Position *</Label>
                <Input
                  id='position'
                  value={formData.position}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, position: e.target.value }))
                  }
                  placeholder='Job title'
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor='location'>Location</Label>
              <Input
                id='location'
                value={formData.location}
                onChange={e =>
                  setFormData(prev => ({ ...prev, location: e.target.value }))
                }
                placeholder='City, Country'
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
              <Label htmlFor='current'>I currently work here</Label>
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
                placeholder='Describe your role and achievements...'
                rows={3}
              />
            </div>

            <div className='flex gap-2'>
              <Button
                onClick={handleSaveExperience}
                size='sm'
                className='cursor-pointer'
              >
                <Save className='w-4 h-4 mr-2' />
                {editingExpId ? 'Update' : 'Add'} Experience
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
          {experience.length > 0 ? (
            experience
              .sort(
                (a, b) =>
                  new Date(b.startDate).getTime() -
                  new Date(a.startDate).getTime()
              )
              .map(exp => (
                <div
                  key={exp.id}
                  className='p-4 border border-border rounded-lg hover:bg-slate-50'
                >
                  <div className='flex items-start justify-between'>
                    <div className='flex-1 min-w-0'>
                      <h3 className='text-h4 text-text-dark'>{exp.position}</h3>
                      <p className='text-body text-text-medium font-medium'>
                        {exp.company}
                      </p>

                      <div className='flex flex-wrap items-center gap-2 mt-2 text-caption text-text-light'>
                        <div className='flex items-center gap-1'>
                          <CalendarIcon className='w-4 h-4' />
                          <span>
                            {new Date(exp.startDate).toLocaleDateString(
                              'en-US',
                              { month: 'short', year: 'numeric' }
                            )}{' '}
                            -{' '}
                            {exp.current
                              ? 'Present'
                              : new Date(exp.endDate || '').toLocaleDateString(
                                  'en-US',
                                  { month: 'short', year: 'numeric' }
                                )}
                          </span>
                        </div>
                        {exp.location && (
                          <div className='flex items-center gap-1'>
                            <MapPin className='w-4 h-4' />
                            <span>{exp.location}</span>
                          </div>
                        )}
                      </div>

                      {exp.description && (
                        <p className='text-body text-text-medium mt-2'>
                          {exp.description}
                        </p>
                      )}
                    </div>

                    <div className='flex items-center gap-1 ml-4'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleEditExperience(exp)}
                        className='cursor-pointer'
                      >
                        <Edit className='w-4 h-4' />
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleDeleteExperience(exp.id)}
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
              No work experience added yet. Click &quot;Add Experience&quot; to
              get started.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
