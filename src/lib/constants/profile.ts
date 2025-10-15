// Work Mode Options
export const WORK_MODES = ['Remote', 'Hybrid', 'On-site'] as const;
export type WorkMode = (typeof WORK_MODES)[number];

// Job Type Options
export const JOB_TYPES = [
  'Full-time',
  'Part-time',
  'Contract',
  'Freelance',
] as const;
export type JobType = (typeof JOB_TYPES)[number];

// Currency Options
export const CURRENCIES = ['USD', 'EUR', 'GBP'] as const;
export type Currency = (typeof CURRENCIES)[number];

// Salary Period Options
export const SALARY_PERIODS = [
  { value: 'yearly', label: 'Per Year' },
  { value: 'monthly', label: 'Per Month' },
  { value: 'hourly', label: 'Per Hour' },
] as const;
export type SalaryPeriod = 'yearly' | 'monthly' | 'hourly';

// Work Authorization Options
export const WORK_AUTHORIZATION_OPTIONS = [
  'Citizen',
  'Permanent Resident',
  'Work Visa (H1B)',
  'Work Visa (Other)',
  'Employment Authorization Document (EAD)',
  'Require Sponsorship',
  'Not Specified',
] as const;
export type WorkAuthorization = (typeof WORK_AUTHORIZATION_OPTIONS)[number];

// Availability Status Options
export const AVAILABILITY_STATUS_OPTIONS = [
  'Actively looking',
  'Open to opportunities',
  'Not looking',
  'Employed - not interested',
] as const;
export type AvailabilityStatus = (typeof AVAILABILITY_STATUS_OPTIONS)[number];

// Notice Period Options
export const NOTICE_PERIOD_OPTIONS = [
  'Immediate',
  '1 week',
  '2 weeks',
  '1 month',
  '2 months',
  '3 months',
] as const;
export type NoticePeriod = (typeof NOTICE_PERIOD_OPTIONS)[number];

// Language Proficiency Options
export const LANGUAGE_PROFICIENCY_LEVELS = [
  'Basic',
  'Conversational',
  'Professional',
  'Native',
] as const;
export type LanguageProficiency = (typeof LANGUAGE_PROFICIENCY_LEVELS)[number];
