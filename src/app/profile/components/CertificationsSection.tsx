'use client';

import { useState } from 'react';
import { UserProfileDoc, Certification } from '@/firebase/services/types';
import { useProfile } from '@/contexts/ProfileContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Award,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Calendar as CalendarIcon,
  ExternalLink,
} from 'lucide-react';
import { format } from 'date-fns';
import { toDateInputFormat } from '@/lib/utils/date';

interface CertificationsSectionProps {
  userProfile: UserProfileDoc | null;
}

export function CertificationsSection({
  userProfile,
}: CertificationsSectionProps) {
  const { updateUserProfileById } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [certifications, setCertifications] = useState<Certification[]>(
    userProfile?.certifications || []
  );
  const [formData, setFormData] = useState({
    name: '',
    issuingOrganization: '',
    issueDate: undefined as Date | undefined,
    expirationDate: undefined as Date | undefined,
    credentialId: '',
    credentialUrl: '',
  });

  const handleAddCertification = () => {
    setFormData({
      name: '',
      issuingOrganization: '',
      issueDate: undefined,
      expirationDate: undefined,
      credentialId: '',
      credentialUrl: '',
    });
    setEditingId(null);
    setIsEditing(true);
  };

  const handleEditCertification = (cert: Certification) => {
    setFormData({
      name: cert.name,
      issuingOrganization: cert.issuingOrganization,
      issueDate: new Date(cert.issueDate),
      expirationDate: cert.expirationDate
        ? new Date(cert.expirationDate)
        : undefined,
      credentialId: cert.credentialId || '',
      credentialUrl: cert.credentialUrl || '',
    });
    setEditingId(cert.id);
    setIsEditing(true);
  };

  const handleSaveCertification = async () => {
    try {
      const certificationData = {
        name: formData.name,
        issuingOrganization: formData.issuingOrganization,
        issueDate: toDateInputFormat(formData.issueDate),
        expirationDate: formData.expirationDate
          ? toDateInputFormat(formData.expirationDate)
          : undefined,
        credentialId: formData.credentialId || undefined,
        credentialUrl: formData.credentialUrl || undefined,
      };

      const newCertifications = editingId
        ? certifications.map(cert =>
            cert.id === editingId
              ? { ...cert, ...certificationData, id: editingId }
              : cert
          )
        : [
            ...certifications,
            { ...certificationData, id: Date.now().toString() },
          ];

      setCertifications(newCertifications);

      if (userProfile) {
        await updateUserProfileById(userProfile.id, {
          certifications: newCertifications,
        });
      }

      setIsEditing(false);
      setEditingId(null);
    } catch (error) {
      console.error('Failed to save certification:', error);
    }
  };

  const handleDeleteCertification = async (certId: string) => {
    if (window.confirm('Are you sure you want to delete this certification?')) {
      try {
        const newCertifications = certifications.filter(
          cert => cert.id !== certId
        );
        setCertifications(newCertifications);

        if (userProfile) {
          await updateUserProfileById(userProfile.id, {
            certifications: newCertifications,
          });
        }
      } catch (error) {
        console.error('Failed to delete certification:', error);
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      name: '',
      issuingOrganization: '',
      issueDate: undefined,
      expirationDate: undefined,
      credentialId: '',
      credentialUrl: '',
    });
  };

  return (
    <Card className='border border-border shadow-sm'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle className='flex items-center gap-2'>
            <Award className='w-5 h-5' />
            Certifications
          </CardTitle>
          {!isEditing && (
            <Button
              onClick={handleAddCertification}
              variant='outline'
              size='sm'
              className='cursor-pointer'
            >
              <Plus className='w-4 h-4 mr-2' />
              Add Certification
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className='space-y-4 p-4 border border-border rounded-lg bg-slate-50'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='certName'>Certification Name *</Label>
                <Input
                  id='certName'
                  value={formData.name}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, name: e.target.value }))
                  }
                  placeholder='e.g., AWS Certified Solutions Architect'
                  required
                />
              </div>
              <div>
                <Label htmlFor='issuingOrg'>Issuing Organization *</Label>
                <Input
                  id='issuingOrg'
                  value={formData.issuingOrganization}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      issuingOrganization: e.target.value,
                    }))
                  }
                  placeholder='e.g., Amazon Web Services'
                  required
                />
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='issueDate'>Issue Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      className='w-full justify-start text-left font-normal'
                    >
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {formData.issueDate
                        ? format(formData.issueDate, 'PPP')
                        : 'Select issue date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      mode='single'
                      selected={formData.issueDate}
                      onSelect={date =>
                        setFormData(prev => ({ ...prev, issueDate: date }))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor='expirationDate'>Expiration Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      className='w-full justify-start text-left font-normal'
                    >
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {formData.expirationDate
                        ? format(formData.expirationDate, 'PPP')
                        : 'Select expiration date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      mode='single'
                      selected={formData.expirationDate}
                      onSelect={date =>
                        setFormData(prev => ({
                          ...prev,
                          expirationDate: date,
                        }))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <p className='text-xs text-text-light mt-1'>
                  Leave empty if it doesn&apos;t expire
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor='credentialId'>Credential ID</Label>
              <Input
                id='credentialId'
                value={formData.credentialId}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    credentialId: e.target.value,
                  }))
                }
                placeholder='Optional credential ID or license number'
              />
            </div>

            <div>
              <Label htmlFor='credentialUrl'>Credential URL</Label>
              <Input
                id='credentialUrl'
                type='url'
                value={formData.credentialUrl}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    credentialUrl: e.target.value,
                  }))
                }
                placeholder='https://example.com/verify/credential'
              />
              <p className='text-xs text-text-light mt-1'>
                Link to verify or view your credential
              </p>
            </div>

            <div className='flex gap-2'>
              <Button
                onClick={handleSaveCertification}
                size='sm'
                disabled={
                  !formData.name ||
                  !formData.issuingOrganization ||
                  !formData.issueDate
                }
                className='cursor-pointer'
              >
                <Save className='w-4 h-4 mr-2' />
                {editingId ? 'Update' : 'Add'} Certification
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
          {certifications.length > 0 ? (
            certifications
              .sort(
                (a, b) =>
                  new Date(b.issueDate).getTime() -
                  new Date(a.issueDate).getTime()
              )
              .map(cert => (
                <div
                  key={cert.id}
                  className='p-4 border border-border rounded-lg hover:bg-slate-50'
                >
                  <div className='flex items-start justify-between'>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-start gap-2'>
                        <Award className='w-5 h-5 text-primary mt-0.5 flex-shrink-0' />
                        <div className='flex-1'>
                          <h3 className='text-h4 text-text-dark'>
                            {cert.name}
                          </h3>
                          <p className='text-body text-text-medium font-medium'>
                            {cert.issuingOrganization}
                          </p>

                          <div className='flex items-center gap-2 mt-2 text-caption text-text-light'>
                            <CalendarIcon className='w-4 h-4' />
                            <span>
                              Issued:{' '}
                              {new Date(cert.issueDate).toLocaleDateString(
                                'en-US',
                                { month: 'short', year: 'numeric' }
                              )}
                              {cert.expirationDate &&
                                ` • Expires: ${new Date(cert.expirationDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                            </span>
                          </div>

                          {cert.credentialId && (
                            <p className='text-caption text-text-light mt-1'>
                              Credential ID: {cert.credentialId}
                            </p>
                          )}

                          {cert.credentialUrl && (
                            <a
                              href={cert.credentialUrl}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='inline-flex items-center gap-1 text-caption text-primary hover:underline mt-1 cursor-pointer'
                            >
                              View Credential{' '}
                              <ExternalLink className='w-3 h-3' />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className='flex items-center gap-1 ml-4'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleEditCertification(cert)}
                        className='cursor-pointer'
                      >
                        <Edit className='w-4 h-4' />
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleDeleteCertification(cert.id)}
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
              No certifications added yet. Click &quot;Add Certification&quot;
              to get started.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
