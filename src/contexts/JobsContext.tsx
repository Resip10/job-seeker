"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { 
  createJob, 
  getJobsByUserId, 
  updateJob, 
  deleteJob
} from '@/firebase/services/firestore'
import { IJobDoc, IJobQueryOptions } from '@/firebase/services/types'

interface JobsContextType {
  jobs: IJobDoc[]
  loading: boolean
  error: string | null
  addJob: (job: Omit<IJobDoc, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<void>
  updateJobById: (jobId: string, updates: Partial<IJobDoc>) => Promise<void>
  deleteJobById: (jobId: string) => Promise<void>
  refreshJobs: () => Promise<void>
  getJobsWithFilters: (options: IJobQueryOptions) => Promise<IJobDoc[]>
}

const JobsContext = createContext<JobsContextType | undefined>(undefined)

export const useJobs = () => {
  const context = useContext(JobsContext)
  if (!context) {
    throw new Error('useJobs must be used within a JobsProvider')
  }
  return context
}

interface JobsProviderProps {
  children: React.ReactNode
}

export const JobsProvider: React.FC<JobsProviderProps> = ({ children }) => {
  const { user } = useAuth()
  const [jobs, setJobs] = useState<IJobDoc[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load jobs when user changes
  useEffect(() => {
    if (user) {
      loadJobs()
    } else {
      setJobs([])
      setError(null)
    }
  }, [user])

  const loadJobs = useCallback(async () => {
    if (!user) return

    setLoading(true)
    setError(null)
    
    try {
      const userJobs = await getJobsByUserId(user.uid)
      setJobs(userJobs)
    } catch (err: any) {
      setError(err.message || 'Failed to load jobs')
      console.error('Error loading jobs:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  const addJob = useCallback(async (jobData: Omit<IJobDoc, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    if (!user) throw new Error('User not authenticated')

    setLoading(true)
    setError(null)

    try {
      const newJob = await createJob(jobData as any, user.uid)
      setJobs(prev => [newJob, ...prev])
    } catch (err: any) {
      setError(err.message || 'Failed to add job')
      throw err
    } finally {
      setLoading(false)
    }
  }, [user])

  const updateJobById = useCallback(async (jobId: string, updates: Partial<IJobDoc>) => {
    setLoading(true)
    setError(null)

    try {
      await updateJob(jobId, updates)
      setJobs(prev => prev.map(job => 
        job.id === jobId 
          ? { ...job, ...updates, updatedAt: new Date() as any }
          : job
      ))
    } catch (err: any) {
      setError(err.message || 'Failed to update job')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteJobById = useCallback(async (jobId: string) => {
    setLoading(true)
    setError(null)

    try {
      await deleteJob(jobId)
      setJobs(prev => prev.filter(job => job.id !== jobId))
    } catch (err: any) {
      setError(err.message || 'Failed to delete job')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshJobs = useCallback(async () => {
    await loadJobs()
  }, [loadJobs])

  const getJobsWithFilters = useCallback(async (options: IJobQueryOptions) => {
    if (!user) return []

    try {
      return await getJobsByUserId(user.uid, options)
    } catch (err: any) {
      setError(err.message || 'Failed to filter jobs')
      return []
    }
  }, [user])

  const value: JobsContextType = {
    jobs,
    loading,
    error,
    addJob,
    updateJobById,
    deleteJobById,
    refreshJobs,
    getJobsWithFilters
  }

  return (
    <JobsContext.Provider value={value}>
      {children}
    </JobsContext.Provider>
  )
}
