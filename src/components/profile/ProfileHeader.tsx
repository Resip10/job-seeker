'use client';

import { useState, useRef, useEffect } from 'react';
import { User } from 'firebase/auth';
import { UserProfileDoc } from '@/firebase/services/types';
import { useProfile } from '@/contexts/ProfileContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Save,
  X,
  Edit,
  User as UserIcon,
  MapPin,
  Phone,
  Mail,
  Upload,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import {
  uploadFile,
  generateProfileImagePath,
} from '@/firebase/services/storage';

interface ProfileHeaderProps {
  userProfile: UserProfileDoc | null;
  user: User | null;
}

export function ProfileHeader({ userProfile, user }: ProfileHeaderProps) {
  const { updateUserProfileById, addUserProfile } = useProfile();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: userProfile?.firstName || user?.displayName?.split(' ')[0] || '',
    lastName: userProfile?.lastName || user?.displayName?.split(' ')[1] || '',
    bio: userProfile?.bio || '',
    location: userProfile?.location || '',
    phone: userProfile?.phone || '',
    profileImageUrl: userProfile?.profileImageUrl || '',
  });

  const handleSave = async () => {
    setUploadingImage(true);
    setError(null);
    try {
      const finalFormData = { ...formData };

      // Upload image if a new file was selected
      if (selectedFile) {
        const filePath = generateProfileImagePath(
          user?.uid || '',
          selectedFile.name
        );
        const imageUrl = await uploadFile(selectedFile, filePath);
        finalFormData.profileImageUrl = imageUrl;
      }

      if (userProfile) {
        await updateUserProfileById(userProfile.id, finalFormData);
      } else {
        await addUserProfile({
          ...finalFormData,
          email: user?.email || '',
          skills: [],
          experience: [],
          education: [],
        });
      }

      // Clear the selected file and preview
      setSelectedFile(null);
      setPreviewUrl(null);
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to save profile. Please try again.'
      );
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName:
        userProfile?.firstName || user?.displayName?.split(' ')[0] || '',
      lastName: userProfile?.lastName || user?.displayName?.split(' ')[1] || '',
      bio: userProfile?.bio || '',
      location: userProfile?.location || '',
      phone: userProfile?.phone || '',
      profileImageUrl: userProfile?.profileImageUrl || '',
    });
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsEditingProfile(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, or GIF)');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    // Store the selected file and create preview
    setSelectedFile(file);

    // Create preview URL
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);

    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    // Clear selected file and preview
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }

    // Clear the current profile image URL
    setFormData(prev => ({ ...prev, profileImageUrl: '' }));
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const displayName = userProfile
    ? `${userProfile.firstName} ${userProfile.lastName}`.trim()
    : user?.displayName || user?.email?.split('@')[0] || 'User';

  return (
    <Card className='border border-border shadow-sm'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle className='flex items-center gap-2'>
            <UserIcon className='w-5 h-5' />
            Personal Information
          </CardTitle>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className='cursor-pointer'
          >
            {isEditingProfile ? (
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
        {/* Error Display */}
        {error && (
          <Alert variant='destructive' className='mb-4'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription className='flex-1'>{error}</AlertDescription>
            <button
              onClick={() => setError(null)}
              className='ml-auto text-destructive-foreground hover:text-destructive-foreground/80 transition-colors cursor-pointer'
              aria-label='Close error'
            >
              <X className='h-4 w-4' />
            </button>
          </Alert>
        )}

        {isEditingProfile ? (
          <div className='space-y-4'>
            {/* Profile Image Upload */}
            <div className='flex items-center gap-4'>
              <div className='relative'>
                <div className='w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden'>
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt='Profile Preview'
                      className='w-full h-full rounded-full object-cover'
                    />
                  ) : formData.profileImageUrl ? (
                    <img
                      src={formData.profileImageUrl}
                      alt='Profile'
                      className='w-full h-full rounded-full object-cover'
                    />
                  ) : (
                    <UserIcon className='w-10 h-10 text-slate-400' />
                  )}
                </div>
                {uploadingImage && (
                  <div className='absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center'>
                    <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-white'></div>
                  </div>
                )}
              </div>
              <div className='flex flex-col gap-2'>
                <div className='flex gap-2'>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={triggerImageUpload}
                    disabled={uploadingImage}
                    className='cursor-pointer'
                  >
                    <Upload className='w-4 h-4 mr-2' />
                    {previewUrl || formData.profileImageUrl
                      ? 'Change Photo'
                      : 'Select Photo'}
                  </Button>
                  {(previewUrl || formData.profileImageUrl) && (
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={handleRemoveImage}
                      disabled={uploadingImage}
                      className='text-red-600 hover:text-red-700 cursor-pointer'
                    >
                      <Trash2 className='w-4 h-4 mr-2' />
                      Remove
                    </Button>
                  )}
                </div>
                <p className='text-xs text-text-light'>
                  JPG, PNG or GIF. Max size 5MB.
                </p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              onChange={handleImageUpload}
              className='hidden'
            />

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='firstName'>First Name</Label>
                <Input
                  id='firstName'
                  value={formData.firstName}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                  placeholder='Enter first name'
                />
              </div>
              <div>
                <Label htmlFor='lastName'>Last Name</Label>
                <Input
                  id='lastName'
                  value={formData.lastName}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, lastName: e.target.value }))
                  }
                  placeholder='Enter last name'
                />
              </div>
            </div>
            <div>
              <Label htmlFor='bio'>Bio</Label>
              <textarea
                id='bio'
                value={formData.bio}
                onChange={e =>
                  setFormData(prev => ({ ...prev, bio: e.target.value }))
                }
                placeholder='Tell us about yourself...'
                className='w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none'
                rows={3}
              />
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
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
              <div>
                <Label htmlFor='phone'>Phone</Label>
                <Input
                  id='phone'
                  value={formData.phone}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder='+1 (555) 123-4567'
                />
              </div>
            </div>
            <div className='flex gap-2'>
              <Button
                onClick={handleSave}
                size='sm'
                disabled={uploadingImage}
                className='cursor-pointer'
              >
                <Save className='w-4 h-4 mr-2' />
                {uploadingImage ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                onClick={handleCancel}
                variant='outline'
                size='sm'
                disabled={uploadingImage}
                className='cursor-pointer'
              >
                <X className='w-4 h-4 mr-2' />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className='space-y-4'>
            <div className='flex items-center gap-4'>
              <div className='w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden'>
                {userProfile?.profileImageUrl ? (
                  <img
                    src={userProfile.profileImageUrl}
                    alt='Profile'
                    className='w-full h-full rounded-full object-cover'
                  />
                ) : (
                  <UserIcon className='w-8 h-8 text-slate-400' />
                )}
              </div>
              <div className='flex-1'>
                <h2 className='text-h3 text-text-dark'>{displayName}</h2>
                {userProfile?.bio && (
                  <p className='text-body text-text-medium mt-1'>
                    {userProfile.bio}
                  </p>
                )}
              </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border'>
              <div className='flex items-center gap-2'>
                <Mail className='w-4 h-4 text-text-light' />
                <div>
                  <p className='text-caption text-text-light'>Email</p>
                  <p className='text-body text-text-dark'>
                    {user?.email || 'Not provided'}
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <Phone className='w-4 h-4 text-text-light' />
                <div>
                  <p className='text-caption text-text-light'>Phone</p>
                  <p className='text-body text-text-dark'>
                    {userProfile?.phone || 'Not provided'}
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <MapPin className='w-4 h-4 text-text-light' />
                <div>
                  <p className='text-caption text-text-light'>Location</p>
                  <p className='text-body text-text-dark'>
                    {userProfile?.location || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
