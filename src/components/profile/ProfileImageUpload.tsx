'use client';

import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Trash2, User as UserIcon } from 'lucide-react';

interface ProfileImageUploadProps {
  currentImageUrl?: string;
  onImageChange: (url: string) => void;
  isUploading?: boolean;
}

export function ProfileImageUpload({
  currentImageUrl,
  onImageChange,
  isUploading = false,
}: ProfileImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const uploading = isUploading;

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, or GIF)');

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');

      return;
    }

    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
    onImageChange(preview);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    onImageChange('');
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const displayImage = previewUrl || currentImageUrl;

  return (
    <div className='flex items-center gap-4'>
      <div className='relative'>
        <div className='w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden'>
          {displayImage ? (
            <img
              src={displayImage}
              alt={previewUrl ? 'Profile Preview' : 'Profile'}
              className='w-full h-full rounded-full object-cover'
            />
          ) : (
            <UserIcon className='w-10 h-10 text-slate-400' />
          )}
        </div>
        {uploading && (
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
            disabled={uploading}
            className='cursor-pointer'
          >
            <Upload className='w-4 h-4 mr-2' />
            {displayImage ? 'Change Photo' : 'Select Photo'}
          </Button>
          {displayImage && (
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={handleRemoveImage}
              disabled={uploading}
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

      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        onChange={handleImageUpload}
        className='hidden'
      />
    </div>
  );
}
