'use client';

import { useState } from 'react';
import { UserProfileDoc, Language } from '@/firebase/services/types';
import { useProfile } from '@/contexts/ProfileContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Globe, Plus, Edit, Save, X, Trash2 } from 'lucide-react';
import {
  LANGUAGE_PROFICIENCY_LEVELS,
  type LanguageProficiency,
} from '@/lib/constants/profile';

interface LanguagesSectionProps {
  userProfile: UserProfileDoc | null;
}

export function LanguagesSection({ userProfile }: LanguagesSectionProps) {
  const { updateUserProfileById } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [languages, setLanguages] = useState<Language[]>(
    userProfile?.languages || []
  );
  const [newLanguage, setNewLanguage] = useState({
    name: '',
    proficiency: 'Professional' as Language['proficiency'],
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddLanguage = () => {
    if (newLanguage.name.trim()) {
      const language: Language = {
        id: Date.now().toString(),
        name: newLanguage.name.trim(),
        proficiency: newLanguage.proficiency,
      };
      setLanguages(prev => [...prev, language]);
      setNewLanguage({ name: '', proficiency: 'Professional' });
    }
  };

  const handleEditLanguage = (lang: Language) => {
    setEditingId(lang.id);
    setNewLanguage({
      name: lang.name,
      proficiency: lang.proficiency,
    });
  };

  const handleUpdateLanguage = () => {
    if (editingId && newLanguage.name.trim()) {
      setLanguages(prev =>
        prev.map(lang =>
          lang.id === editingId
            ? {
                ...lang,
                name: newLanguage.name,
                proficiency: newLanguage.proficiency,
              }
            : lang
        )
      );
      setNewLanguage({ name: '', proficiency: 'Professional' });
      setEditingId(null);
    }
  };

  const handleRemoveLanguage = (id: string) => {
    setLanguages(prev => prev.filter(lang => lang.id !== id));
  };

  const handleSave = async () => {
    try {
      if (userProfile) {
        await updateUserProfileById(userProfile.id, { languages });
      }
      setIsEditing(false);
      setEditingId(null);
      setNewLanguage({ name: '', proficiency: 'Professional' });
    } catch (error) {
      console.error('Failed to save languages:', error);
    }
  };

  const handleCancel = () => {
    setLanguages(userProfile?.languages || []);
    setNewLanguage({ name: '', proficiency: 'Professional' });
    setEditingId(null);
    setIsEditing(false);
  };

  const getProficiencyColor = (proficiency: Language['proficiency']) => {
    switch (proficiency) {
      case 'Native':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Professional':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Conversational':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Basic':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className='border border-border shadow-sm'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle className='flex items-center gap-2'>
            <Globe className='w-5 h-5' />
            Languages
          </CardTitle>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setIsEditing(!isEditing)}
            className='cursor-pointer'
          >
            {isEditing ? (
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
        {isEditing ? (
          <div className='space-y-4'>
            <div className='p-4 border border-border rounded-lg bg-slate-50'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='languageName'>Language</Label>
                  <Input
                    id='languageName'
                    value={newLanguage.name}
                    onChange={e =>
                      setNewLanguage(prev => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder='e.g., English, Spanish'
                  />
                </div>
                <div>
                  <Label htmlFor='proficiency'>Proficiency</Label>
                  <Select
                    value={newLanguage.proficiency}
                    onValueChange={(value: LanguageProficiency) =>
                      setNewLanguage(prev => ({ ...prev, proficiency: value }))
                    }
                  >
                    <SelectTrigger id='proficiency'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGE_PROFICIENCY_LEVELS.map(level => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className='flex gap-2 mt-4'>
                {editingId ? (
                  <>
                    <Button
                      onClick={handleUpdateLanguage}
                      variant='outline'
                      size='sm'
                      className='cursor-pointer'
                    >
                      <Save className='w-4 h-4 mr-2' />
                      Update
                    </Button>
                    <Button
                      onClick={() => {
                        setEditingId(null);
                        setNewLanguage({
                          name: '',
                          proficiency: 'Professional',
                        });
                      }}
                      variant='outline'
                      size='sm'
                      className='cursor-pointer'
                    >
                      <X className='w-4 h-4 mr-2' />
                      Cancel Edit
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={handleAddLanguage}
                    variant='outline'
                    size='sm'
                    disabled={!newLanguage.name.trim()}
                    className='cursor-pointer'
                  >
                    <Plus className='w-4 h-4 mr-2' />
                    Add Language
                  </Button>
                )}
              </div>
            </div>

            {languages.length > 0 && (
              <div className='space-y-2'>
                <p className='text-sm font-medium text-slate-700'>
                  Your Languages:
                </p>
                <div className='space-y-2'>
                  {languages.map(lang => (
                    <div
                      key={lang.id}
                      className='flex items-center justify-between p-3 border border-border rounded-lg'
                    >
                      <div className='flex items-center gap-2'>
                        <span className='font-medium text-text-dark'>
                          {lang.name}
                        </span>
                        <Badge
                          variant='outline'
                          className={getProficiencyColor(lang.proficiency)}
                        >
                          {lang.proficiency}
                        </Badge>
                      </div>
                      <div className='flex gap-1'>
                        <Button
                          onClick={() => handleEditLanguage(lang)}
                          variant='outline'
                          size='sm'
                          className='cursor-pointer'
                        >
                          <Edit className='w-4 h-4' />
                        </Button>
                        <Button
                          onClick={() => handleRemoveLanguage(lang.id)}
                          variant='outline'
                          size='sm'
                          className='text-red-600 hover:text-red-700 cursor-pointer'
                        >
                          <Trash2 className='w-4 h-4' />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className='flex gap-2 pt-4 border-t border-border'>
              <Button onClick={handleSave} size='sm' className='cursor-pointer'>
                <Save className='w-4 h-4 mr-2' />
                Save Languages
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
            {languages.length > 0 ? (
              <div className='flex flex-wrap gap-2'>
                {languages.map(lang => (
                  <Badge
                    key={lang.id}
                    variant='outline'
                    className={`${getProficiencyColor(lang.proficiency)} text-sm`}
                  >
                    {lang.name} • {lang.proficiency}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className='text-text-light text-center py-4'>
                No languages added yet. Click Edit to add your language skills.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
