"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { 
  createResume, 
  getResumesByUserId, 
  deleteResume,
  createProfile,
  getProfilesByUserId,
  updateProfile,
  deleteProfile
} from '@/firebase/services/firestore'
import { ResumeDoc, ProfileDoc } from '@/firebase/services/types'

interface ProfileContextType {
  resumes: ResumeDoc[]
  profiles: ProfileDoc[]
  loading: boolean
  error: string | null
  addResume: (resume: Omit<ResumeDoc, 'id' | 'uploadedAt' | 'userId'>) => Promise<void>
  deleteResumeById: (resumeId: string) => Promise<void>
  addProfile: (profile: Omit<ProfileDoc, 'id' | 'createdAt' | 'userId'>) => Promise<void>
  updateProfileById: (profileId: string, updates: Partial<ProfileDoc>) => Promise<void>
  deleteProfileById: (profileId: string) => Promise<void>
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export const useProfile = () => {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}

interface ProfileProviderProps {
  children: React.ReactNode
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const { user } = useAuth()
  const [resumes, setResumes] = useState<ResumeDoc[]>([])
  const [profiles, setProfiles] = useState<ProfileDoc[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load profiles when user changes
  const loadProfiles = useCallback(async () => {
    if (!user) return

    setLoading(true)
    setError(null)
    
    try {
      const [userResumes, userProfiles] = await Promise.all([
        getResumesByUserId(user.uid),
        getProfilesByUserId(user.uid)
      ])
      setResumes(userResumes)
      setProfiles(userProfiles)
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to load profile data')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      loadProfiles()
    } else {
      setResumes([])
      setProfiles([])
      setError(null)
    }
  }, [user, loadProfiles])

  const addResume = useCallback(async (resumeData: Omit<ResumeDoc, 'id' | 'uploadedAt' | 'userId'>) => {
    if (!user) throw new Error('User not authenticated')

    setLoading(true)
    setError(null)

    try {
      const newResume = await createResume({
        ...resumeData,
        userId: user.uid
      })
      setResumes(prev => [newResume, ...prev])
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to add resume')
      throw err
    } finally {
      setLoading(false)
    }
  }, [user])

  const deleteResumeById = useCallback(async (resumeId: string) => {
    setLoading(true)
    setError(null)

    try {
      await deleteResume(resumeId)
      setResumes(prev => prev.filter(resume => resume.id !== resumeId))
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to delete resume')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const addProfile = useCallback(async (profileData: Omit<ProfileDoc, 'id' | 'createdAt' | 'userId'>) => {
    if (!user) throw new Error('User not authenticated')

    setLoading(true)
    setError(null)

    try {
      const newProfile = await createProfile({
        ...profileData,
        userId: user.uid
      })
      setProfiles(prev => [newProfile, ...prev])
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to add profile')
      throw err
    } finally {
      setLoading(false)
    }
  }, [user])

  const updateProfileById = useCallback(async (profileId: string, updates: Partial<ProfileDoc>) => {
    setLoading(true)
    setError(null)

    try {
      await updateProfile(profileId, updates)
      setProfiles(prev => prev.map(profile => 
        profile.id === profileId 
          ? { ...profile, ...updates }
          : profile
      ))
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to update profile')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteProfileById = useCallback(async (profileId: string) => {
    setLoading(true)
    setError(null)

    try {
      await deleteProfile(profileId)
      setProfiles(prev => prev.filter(profile => profile.id !== profileId))
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to delete profile')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])


  const value: ProfileContextType = {
    resumes,
    profiles,
    loading,
    error,
    addResume,
    deleteResumeById,
    addProfile,
    updateProfileById,
    deleteProfileById
  }

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  )
}
