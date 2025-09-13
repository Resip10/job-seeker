import { useJobs } from '@/contexts/JobsContext';
import { IJobDoc } from '@/firebase/services/types';

const getStatusCounts = (jobs: IJobDoc[]) => {
  return jobs.reduce(
    (acc, job) => {
      acc[job.status] = (acc[job.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
};

export function useStatusCounts() {
  const { jobs } = useJobs();
  return getStatusCounts(jobs);
}
