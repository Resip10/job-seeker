'use client';

import { useState } from 'react';
import { UserProfileDoc } from '@/firebase/services/types';
import { useProfile } from '@/contexts/ProfileContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Award, Plus, X, Save, Edit } from 'lucide-react';

interface SkillsSectionProps {
  userProfile: UserProfileDoc | null;
}

export function SkillsSection({ userProfile }: SkillsSectionProps) {
  const { updateUserProfileById } = useProfile();
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [skills, setSkills] = useState<string[]>(userProfile?.skills || []);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      const updatedSkills = [...skills, newSkill.trim()];
      setSkills(updatedSkills);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updatedSkills = skills.filter(skill => skill !== skillToRemove);
    setSkills(updatedSkills);
  };

  const handleSaveSkills = async () => {
    try {
      if (userProfile) {
        await updateUserProfileById(userProfile.id, { skills });
      } else {
        // This shouldn't happen as userProfile should exist, but handle gracefully
        console.error('No user profile found');
      }
      setIsEditingSkills(false);
    } catch (error) {
      console.error('Failed to save skills:', error);
    }
  };

  const handleCancel = () => {
    setSkills(userProfile?.skills || []);
    setNewSkill('');
    setIsEditingSkills(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <Card className='border border-border shadow-sm'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle className='flex items-center gap-2'>
            <Award className='w-5 h-5' />
            Skills
          </CardTitle>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setIsEditingSkills(!isEditingSkills)}
            className='cursor-pointer'
          >
            {isEditingSkills ? (
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
        {isEditingSkills ? (
          <div className='space-y-4'>
            <div className='flex gap-2'>
              <Input
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder='Add a skill...'
                className='flex-1'
              />
              <Button
                onClick={handleAddSkill}
                variant='outline'
                size='sm'
                className='cursor-pointer'
              >
                <Plus className='w-4 h-4' />
              </Button>
            </div>

            {skills.length > 0 && (
              <div className='space-y-2'>
                <p className='text-sm font-medium text-slate-700'>
                  Current Skills:
                </p>
                <div className='flex flex-wrap gap-2'>
                  {skills.map(skill => (
                    <Badge
                      key={skill}
                      variant='secondary'
                      className='flex items-center gap-1'
                    >
                      {skill}
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className='ml-1 hover:text-red-600 cursor-pointer'
                      >
                        <X className='w-3 h-3' />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className='flex gap-2'>
              <Button
                onClick={handleSaveSkills}
                size='sm'
                className='cursor-pointer'
              >
                <Save className='w-4 h-4 mr-2' />
                Save Skills
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
          <div>
            {skills.length > 0 ? (
              <div className='flex flex-wrap gap-2'>
                {skills.map(skill => (
                  <Badge key={skill} variant='secondary' className='text-xs'>
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className='text-text-light text-center py-4'>
                No skills added yet. Click Edit to add your skills.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
