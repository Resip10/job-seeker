'use client';

import { useState, useRef } from 'react';
import { UserProfileDoc } from '@/firebase/services/types';
import { useProfile } from '@/contexts/ProfileContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  FileText,
  Upload,
  Download,
  Trash2,
  Save,
  X,
  ExternalLink,
} from 'lucide-react';
import { uploadFile, generateUserFilePath } from '@/firebase/services/storage';
import { formatDate } from '@/lib/utils/date';

interface ResumeSectionProps {
  userProfile: UserProfileDoc | null;
}

export function ResumeSection({ userProfile }: ResumeSectionProps) {
  const { updateUserProfileById, resumes, addResume, deleteResumeById } =
    useProfile();
  const [isEditingResume, setIsEditingResume] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

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
      const filePath = generateUserFilePath(
        userProfile?.userId || '',
        file.name
      );
      const fileUrl = await uploadFile(file, filePath);

      // Add to resumes collection
      await addResume({
        fileName: file.name,
        fileUrl,
      });

      // Update user profile with resume URL
      if (userProfile) {
        await updateUserProfileById(userProfile.id, { resumeUrl: fileUrl });
      }

      setIsEditingResume(false);
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

  const handleDeleteResume = async (resumeId: string) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        await deleteResumeById(resumeId);

        // If this was the current resume, remove it from user profile
        if (
          userProfile?.resumeUrl &&
          resumes.find(r => r.id === resumeId)?.fileUrl ===
            userProfile.resumeUrl
        ) {
          await updateUserProfileById(userProfile.id, { resumeUrl: '' });
        }
      } catch (err: unknown) {
        const error = err as Error;
        alert(`Failed to delete resume: ${error.message}`);
      }
    }
  };

  const handleSetAsCurrentResume = async (resumeUrl: string) => {
    if (userProfile) {
      try {
        await updateUserProfileById(userProfile.id, { resumeUrl });
      } catch (err: unknown) {
        const error = err as Error;
        alert(`Failed to set resume: ${error.message}`);
      }
    }
  };

  return (
    <Card className='border border-border shadow-sm'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle className='flex items-center gap-2'>
            <FileText className='w-5 h-5' />
            Resume
          </CardTitle>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setIsEditingResume(!isEditingResume)}
            className='cursor-pointer'
          >
            {isEditingResume ? (
              <>
                <X className='w-4 h-4 mr-2' />
                Cancel
              </>
            ) : (
              <>
                <Upload className='w-4 h-4 mr-2' />
                Upload Resume
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isEditingResume && (
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

        {/* Resumes List */}
        <div className='space-y-3'>
          {resumes.length === 0 ? (
            <p className='text-text-light text-center py-4'>
              No resumes uploaded yet. Click &quot;Upload Resume&quot; to add
              your first resume.
            </p>
          ) : (
            // Sort resumes to show active resume first
            resumes
              .sort((a, b) => {
                // Active resume (matching userProfile.resumeUrl) comes first
                if (a.fileUrl === userProfile?.resumeUrl) return -1;
                if (b.fileUrl === userProfile?.resumeUrl) return 1;
                // Then sort by upload date (newest first)
                return (
                  new Date(b.uploadedAt.toDate()).getTime() -
                  new Date(a.uploadedAt.toDate()).getTime()
                );
              })
              .map(resume => (
                <div
                  key={resume.id}
                  className={`flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 ${
                    resume.fileUrl === userProfile?.resumeUrl
                      ? 'border-green-200 bg-green-50'
                      : 'border-border'
                  }`}
                >
                  <div className='flex items-center gap-3'>
                    <FileText
                      className={`w-5 h-5 ${
                        resume.fileUrl === userProfile?.resumeUrl
                          ? 'text-green-600'
                          : 'text-slate-500'
                      }`}
                    />
                    <div>
                      <p className='font-medium text-text-dark'>
                        {resume.fileName}
                        {resume.fileUrl === userProfile?.resumeUrl && (
                          <span className='ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded'>
                            Active
                          </span>
                        )}
                      </p>
                      <p className='text-caption text-text-light'>
                        Uploaded {formatDate(resume.uploadedAt)}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => window.open(resume.fileUrl, '_blank')}
                      className='cursor-pointer'
                    >
                      <ExternalLink className='w-4 h-4' />
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => window.open(resume.fileUrl, '_blank')}
                      className='cursor-pointer'
                    >
                      <Download className='w-4 h-4' />
                    </Button>
                    {resume.fileUrl !== userProfile?.resumeUrl && (
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleSetAsCurrentResume(resume.fileUrl)}
                        className='cursor-pointer'
                      >
                        <Save className='w-4 h-4' />
                      </Button>
                    )}
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
              ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
