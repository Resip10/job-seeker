// Application constants
export const JOB_STATUSES = [
  'applied',
  'interview',
  'offer',
  'rejected',
  'withdrawn',
] as const;

export const JOB_STATUS_OPTIONS = [
  { value: 'applied', label: 'Applied' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'withdrawn', label: 'Withdrawn' },
] as const;

export const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'applied', label: 'Applied' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'withdrawn', label: 'Withdrawn' },
] as const;

export const PLATFORM_OPTIONS = [
  { value: 'LinkedIn', label: 'LinkedIn' },
  { value: 'GitHub', label: 'GitHub' },
  { value: 'Twitter', label: 'X (Twitter)' },
  { value: 'Portfolio', label: 'Portfolio/Website' },
  { value: 'Other', label: 'Other' },
] as const;
