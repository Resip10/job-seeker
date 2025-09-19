'use client';

import { useState } from 'react';
import { UserProfileDoc } from '@/firebase/services/types';
import { useProfile } from '@/contexts/ProfileContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link as LinkIcon, Globe, Edit, Save, X } from 'lucide-react';
import { XIcon } from '@/components/icons/XIcon';
import { GitHubIcon } from '@/components/icons/GitHubIcon';
import { LinkedInIcon } from '@/components/icons/LinkedInIcon';

interface SocialLinksSectionProps {
  userProfile: UserProfileDoc | null;
}

const socialLinks = [
  {
    key: 'linkedinUrl',
    label: 'LinkedIn',
    icon: LinkedInIcon,
    placeholder: 'https://linkedin.com/in/yourname',
    color: 'text-blue-600',
  },
  {
    key: 'githubUrl',
    label: 'GitHub',
    icon: GitHubIcon,
    placeholder: 'https://github.com/yourname',
    color: 'text-foreground',
  },
  {
    key: 'twitterUrl',
    label: 'X (Twitter)',
    icon: XIcon,
    placeholder: 'https://x.com/yourname',
    color: 'text-foreground',
  },
  {
    key: 'website',
    label: 'Portfolio/Website',
    icon: Globe,
    placeholder: 'https://yourportfolio.com',
    color: 'text-purple-600',
  },
];

export function SocialLinksSection({ userProfile }: SocialLinksSectionProps) {
  const { updateUserProfileById } = useProfile();
  const [isEditingLinks, setIsEditingLinks] = useState(false);
  const [formData, setFormData] = useState({
    linkedinUrl: userProfile?.linkedinUrl || '',
    githubUrl: userProfile?.githubUrl || '',
    twitterUrl: userProfile?.twitterUrl || '',
    website: userProfile?.website || '',
  });

  const handleSaveLinks = async () => {
    try {
      if (userProfile) {
        await updateUserProfileById(userProfile.id, formData);
      }
      setIsEditingLinks(false);
    } catch (error) {
      console.error('Failed to save social links:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      linkedinUrl: userProfile?.linkedinUrl || '',
      githubUrl: userProfile?.githubUrl || '',
      twitterUrl: userProfile?.twitterUrl || '',
      website: userProfile?.website || userProfile?.portfolioUrl || '',
    });
    setIsEditingLinks(false);
  };

  const getDisplayValue = (value: string) => {
    if (!value) {
      return null;
    }

    return value.startsWith('http') ? value : `https://${value}`;
  };

  return (
    <Card className='border border-border shadow-sm'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle className='flex items-center gap-2'>
            <LinkIcon className='w-5 h-5' />
            Social Links
          </CardTitle>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setIsEditingLinks(!isEditingLinks)}
            className='cursor-pointer'
          >
            {isEditingLinks ? (
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
        {isEditingLinks ? (
          <div className='space-y-4'>
            {socialLinks.map(link => (
              <div key={link.key}>
                <Label htmlFor={link.key} className='flex items-center gap-2'>
                  <link.icon className='w-4 h-4' />
                  {link.label}
                </Label>
                <Input
                  id={link.key}
                  value={formData[link.key as keyof typeof formData]}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      [link.key]: e.target.value,
                    }))
                  }
                  placeholder={link.placeholder}
                  className='mt-1'
                />
              </div>
            ))}

            <div className='flex gap-2'>
              <Button
                onClick={handleSaveLinks}
                size='sm'
                className='cursor-pointer'
              >
                <Save className='w-4 h-4 mr-2' />
                Save Links
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
          <div className='space-y-3'>
            {socialLinks.map(link => {
              const value = formData[link.key as keyof typeof formData];
              const displayValue = getDisplayValue(value);

              return displayValue ? (
                <div key={link.key} className='flex items-center gap-3'>
                  <link.icon
                    className={`w-4 h-4 ${link.color} flex-shrink-0`}
                  />
                  <a
                    href={displayValue}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-sm text-blue-600 hover:text-blue-800 hover:underline truncate'
                  >
                    {displayValue}
                  </a>
                </div>
              ) : null;
            })}

            {!socialLinks.some(link =>
              getDisplayValue(formData[link.key as keyof typeof formData])
            ) && (
              <p className='text-text-light text-sm'>
                No social links added yet. Click Edit to add your links.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
