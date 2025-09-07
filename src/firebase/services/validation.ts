// Simple validation for MVP
export const validateJob = (job: { title: string; company: string; status: string }): void => {
  if (!job.title?.trim()) {
    throw new Error('Job title is required');
  }
  if (!job.company?.trim()) {
    throw new Error('Company name is required');
  }
  if (!job.status?.trim()) {
    throw new Error('Job status is required');
  }
};
