'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Upload,
  FileText,
  Link,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  X,
  Save,
} from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';
import { useAuth } from '@/contexts/AuthContext';
import { uploadFile, generateUserFilePath } from '@/firebase/services/storage';
import { formatDate } from '@/lib/utils/date';
import { ProfileDoc } from '@/firebase/services/types';
import { PLATFORM_OPTIONS } from '@/firebase/services/constants';

export function ProfileSection() {
  const { user } = useAuth();
  const {
    resumes,
    profiles,
    loading,
    error,
    addResume,
    deleteResumeById,
    addProfile,
    updateProfileById,
    deleteProfileById,
  } = useProfile();

  const [showResumeForm, setShowResumeForm] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileForm, setProfileForm] = useState({
    platform: 'LinkedIn',
    profileUrl: '',
    notes: '',
  });

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');

      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');

      return;
    }

    setUploading(true);
    try {
      if (!user) {
        alert('You must be logged in to upload files');

        return;
      }

      const filePath = generateUserFilePath(user.uid, file.name);
      const fileUrl = await uploadFile(file, filePath);
      await addResume({
        fileName: file.name,
        fileUrl,
      });
      setShowResumeForm(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: unknown) {
      const error = err as Error;
      alert(`Failed to upload resume: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

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

  const handleEditProfile = (profile: ProfileDoc) => {
    setEditingProfile(profile.id);
    setProfileForm({
      platform: profile.platform,
      profileUrl: profile.profileUrl,
      notes: profile.notes,
    });
    setShowProfileForm(true);
  };

  const handleDeleteResume = async (resumeId: string) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        await deleteResumeById(resumeId);
      } catch (err: unknown) {
        const error = err as Error;
        alert(`Failed to delete resume: ${error.message}`);
      }
    }
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

  return (
    <div className='space-y-6'>
      {/* Error Display */}
      {error && (
        <Alert variant='destructive'>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Resume Section */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='flex items-center gap-2'>
                <FileText className='w-5 h-5' />
                Resume
              </CardTitle>
              <CardDescription>
                Upload and manage your resume files
              </CardDescription>
            </div>
            <Button
              onClick={() => setShowResumeForm(!showResumeForm)}
              variant='outline'
              size='sm'
            >
              <Upload className='w-4 h-4 mr-2' />
              Upload Resume
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {showResumeForm && (
            <div className='mb-4 p-4 border border-slate-200 rounded-lg bg-slate-50'>
              <Label htmlFor='resume-upload' className='block mb-2'>
                Select PDF Resume
              </Label>
              <input
                ref={fileInputRef}
                id='resume-upload'
                type='file'
                accept='.pdf'
                onChange={handleFileUpload}
                disabled={uploading}
                className='block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
              />
              {uploading && (
                <p className='text-sm text-slate-600 mt-2'>Uploading...</p>
              )}
            </div>
          )}

          {resumes.length === 0 ? (
            <p className='text-slate-500 text-center py-4'>
              No resumes uploaded yet. Click &quot;Upload Resume&quot; to add
              your first resume.
            </p>
          ) : (
            <div className='space-y-3'>
              {resumes.map(resume => (
                <div
                  key={resume.id}
                  className='flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50'
                >
                  <div className='flex items-center gap-3'>
                    <FileText className='w-5 h-5 text-slate-500' />
                    <div>
                      <p className='font-medium text-slate-900'>
                        {resume.fileName}
                      </p>
                      <p className='text-sm text-slate-500'>
                        Uploaded {formatDate(resume.uploadedAt)}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => window.open(resume.fileUrl, '_blank')}
                    >
                      <ExternalLink className='w-4 h-4' />
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleDeleteResume(resume.id)}
                      className='text-red-600 hover:text-red-700 cursor-pointer'
                    >
                      <Trash2 className='w-4 h-4' />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Profile Links Section */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='flex items-center gap-2'>
                <Link className='w-5 h-5' />
                Profile Links
              </CardTitle>
              <CardDescription>
                Add your professional profile links
              </CardDescription>
            </div>
            <Button
              onClick={() => {
                setShowProfileForm(!showProfileForm);
                setEditingProfile(null);
                setProfileForm({
                  platform: 'LinkedIn',
                  profileUrl: '',
                  notes: '',
                });
              }}
              variant='outline'
              size='sm'
            >
              <Plus className='w-4 h-4 mr-2' />
              Add Profile
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
                      setProfileForm(prev => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    placeholder='Add any notes about this profile...'
                  />
                </div>
                <div className='flex gap-2'>
                  <Button
                    type='submit'
                    size='sm'
                    disabled={loading}
                    className='cursor-pointer'
                  >
                    <Save className='w-4 h-4 mr-2' />
                    {editingProfile ? 'Update' : 'Add'} Profile
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      setShowProfileForm(false);
                      setEditingProfile(null);
                      setProfileForm({
                        platform: 'LinkedIn',
                        profileUrl: '',
                        notes: '',
                      });
                    }}
                  >
                    <X className='w-4 h-4 mr-2' />
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

          {profiles.length === 0 ? (
            <p className='text-slate-500 text-center py-4'>
              No profile links added yet. Click &quot;Add Profile&quot; to add
              your first profile link.
            </p>
          ) : (
            <div className='space-y-3'>
              {profiles.map(profile => (
                <div
                  key={profile.id}
                  className='flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50'
                >
                  <div className='flex items-center gap-3'>
                    <Link className='w-5 h-5 text-slate-500' />
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
                      <p className='text-xs text-slate-500'>
                        Added {formatDate(profile.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleEditProfile(profile)}
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
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
