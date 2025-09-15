'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { useAuth } from './AuthContext';
import {
  createJob,
  getJobsByUserId,
  updateJob,
  deleteJob,
} from '@/firebase/services';
import { Job, IJobDoc } from '@/firebase/services/types';
import { Timestamp } from 'firebase/firestore';

interface JobsContextType {
  jobs: IJobDoc[];
  loading: boolean;
  error: string | null;
  addJob: (
    job: Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'userId'>
  ) => Promise<void>;
  updateJobById: (jobId: string, updates: Partial<IJobDoc>) => Promise<void>;
  deleteJobById: (jobId: string) => Promise<void>;
}

const JobsContext = createContext<JobsContextType | undefined>(undefined);

export const useJobs = () => {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobsProvider');
  }

  return context;
};

interface JobsProviderProps {
  children: React.ReactNode;
}

export const JobsProvider = ({ children }: JobsProviderProps) => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<IJobDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadJobs = useCallback(async () => {
    if (!user) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userJobs = await getJobsByUserId(user.uid);
      setJobs(userJobs);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load jobs when user changes
  useEffect(() => {
    if (user) {
      loadJobs();
    } else {
      setJobs([]);
      setError(null);
    }
  }, [user, loadJobs]);

  const addJob = useCallback(
    async (jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      setLoading(true);
      setError(null);

      try {
        const newJob = await createJob({
          ...jobData,
          userId: user.uid,
        });
        setJobs(prev => [newJob, ...prev]);
      } catch (err: unknown) {
        const error = err as Error;
        setError(error.message || 'Failed to add job');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const updateJobById = useCallback(
    async (jobId: string, updates: Partial<IJobDoc>) => {
      setLoading(true);
      setError(null);

      try {
        await updateJob(jobId, updates);
        setJobs(prev =>
          prev.map(job =>
            job.id === jobId
              ? { ...job, ...updates, updatedAt: Timestamp.now() }
              : job
          )
        );
      } catch (err: unknown) {
        const error = err as Error;
        setError(error.message || 'Failed to update job');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteJobById = useCallback(async (jobId: string) => {
    setLoading(true);
    setError(null);

    try {
      await deleteJob(jobId);
      setJobs(prev => prev.filter(job => job.id !== jobId));
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to delete job');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value: JobsContextType = {
    jobs,
    loading,
    error,
    addJob,
    updateJobById,
    deleteJobById,
  };

  return <JobsContext.Provider value={value}>{children}</JobsContext.Provider>;
};
