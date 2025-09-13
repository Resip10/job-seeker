'use client';

import { useState } from 'react';
import { UserProfileDoc } from '@/firebase/services/types';
import { useProfile } from '@/contexts/ProfileContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Link as LinkIcon, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { formatDate } from '@/lib/utils/date';
import { PLATFORM_OPTIONS } from '@/firebase/services/constants';

interface ProfileLinksSectionProps {
  userProfile: UserProfileDoc | null;
}

export function ProfileLinksSection({
  userProfile: _userProfile,
}: ProfileLinksSectionProps) {
  const { profiles, addProfile, updateProfileById, deleteProfileById } =
    useProfile();
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState<string | null>(null);
  const [profileForm, setProfileForm] = useState({
    platform: 'LinkedIn',
    profileUrl: '',
    notes: '',
  });

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profileForm.profileUrl.trim()) {
      alert('Profile URL is required');
      return;
    }

    try {
      if (editingProfile) {
        await updateProfileById(editingProfile, profileForm);
        setEditingProfile(null);
      } else {
        await addProfile(profileForm);
      }
      setProfileForm({ platform: 'LinkedIn', profileUrl: '', notes: '' });
      setShowProfileForm(false);
    } catch (err: unknown) {
      const error = err as Error;
      alert(`Failed to save profile: ${error.message}`);
    }
  };

  const handleEditProfile = (profile: any) => {
    setEditingProfile(profile.id);
    setProfileForm({
      platform: profile.platform,
      profileUrl: profile.profileUrl,
      notes: profile.notes,
    });
    setShowProfileForm(true);
  };

  const handleDeleteProfile = async (profileId: string) => {
    if (window.confirm('Are you sure you want to delete this profile link?')) {
      try {
        await deleteProfileById(profileId);
      } catch (err: unknown) {
        const error = err as Error;
        alert(`Failed to delete profile: ${error.message}`);
      }
    }
  };

  const handleCancel = () => {
    setShowProfileForm(false);
    setEditingProfile(null);
    setProfileForm({ platform: 'LinkedIn', profileUrl: '', notes: '' });
  };

  return (
    <Card className='border border-border shadow-sm'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle className='flex items-center gap-2'>
            <LinkIcon className='w-5 h-5' />
            Additional Profile Links
          </CardTitle>
          <Button
            variant='outline'
            size='sm'
            onClick={() => {
              setShowProfileForm(!showProfileForm);
              setEditingProfile(null);
              setProfileForm({
                platform: 'LinkedIn',
                profileUrl: '',
                notes: '',
              });
            }}
            className='cursor-pointer'
          >
            <Plus className='w-4 h-4 mr-2' />
            Add Link
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showProfileForm && (
          <div className='mb-4 p-4 border border-slate-200 rounded-lg bg-slate-50'>
            <form onSubmit={handleProfileSubmit} className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='platform'>Platform</Label>
                  <select
                    id='platform'
                    value={profileForm.platform}
                    onChange={e =>
                      setProfileForm(prev => ({
                        ...prev,
                        platform: e.target.value,
                      }))
                    }
                    className='w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500'
                  >
                    {PLATFORM_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='profileUrl'>Profile URL *</Label>
                  <Input
                    id='profileUrl'
                    type='url'
                    value={profileForm.profileUrl}
                    onChange={e =>
                      setProfileForm(prev => ({
                        ...prev,
                        profileUrl: e.target.value,
                      }))
                    }
                    placeholder='https://linkedin.com/in/yourname'
                    required
                  />
                </div>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='notes'>Notes (Optional)</Label>
                <Input
                  id='notes'
                  value={profileForm.notes}
                  onChange={e =>
                    setProfileForm(prev => ({ ...prev, notes: e.target.value }))
                  }
                  placeholder='Add any notes about this profile...'
                />
              </div>
              <div className='flex gap-2'>
                <Button type='submit' size='sm' className='cursor-pointer'>
                  <Save className='w-4 h-4 mr-2' />
                  {editingProfile ? 'Update' : 'Add'} Profile
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={handleCancel}
                  className='cursor-pointer'
                >
                  <X className='w-4 h-4 mr-2' />
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className='space-y-3'>
          {profiles.length === 0 ? (
            <p className='text-text-light text-center py-4'>
              No additional profile links added yet. Click &quot;Add Link&quot;
              to add your first profile link.
            </p>
          ) : (
            profiles.map(profile => (
              <div
                key={profile.id}
                className='flex items-center justify-between p-3 border border-border rounded-lg hover:bg-slate-50'
              >
                <div className='flex items-center gap-3'>
                  <LinkIcon className='w-5 h-5 text-slate-500' />
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2 mb-1'>
                      <Badge
                        variant='secondary'
                        className='bg-blue-100 text-blue-800 border-blue-200'
                      >
                        {profile.platform}
                      </Badge>
                      <a
                        href={profile.profileUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-blue-600 hover:text-blue-800 hover:underline truncate'
                      >
                        {profile.profileUrl}
                      </a>
                    </div>
                    {profile.notes && (
                      <p className='text-sm text-slate-600 truncate'>
                        {profile.notes}
                      </p>
                    )}
                    <p className='text-xs text-text-light'>
                      Added {formatDate(profile.createdAt)}
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handleEditProfile(profile)}
                    className='cursor-pointer'
                  >
                    <Edit className='w-4 h-4' />
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handleDeleteProfile(profile.id)}
                    className='text-red-600 hover:text-red-700 cursor-pointer'
                  >
                    <Trash2 className='w-4 h-4' />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
